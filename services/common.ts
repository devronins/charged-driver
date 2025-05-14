// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { getDistance } from 'geolib';
import { editDriver } from './driver';
import { GetThunkAPI } from '@reduxjs/toolkit';
import { Toast } from '@/utils/toast';
import {
  hasStartedLocationUpdatesBackgroundTask,
  startLocationUpdatesBackgroundTask,
} from './task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking, Platform } from 'react-native';
import { DriverActions, RideActions } from '@/reducers';
import { RideModal, RideStatus } from '@/utils/modals/ride';
import { fetchRideMapDirection } from '@/api/axios';
import { Coordinates } from '@/utils/modals/common';

export type PickedImageModal = {
  uri: string;
  fileName?: string | null;
  type?: string;
  fileSize: number | null;
};

export enum PickerSourceEnumType {
  Camera = 'camera',
  Gallery = 'gallery',
}

export const fileSizeValidation = async (uri: string): Promise<number | null> => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);

    if (!fileInfo.exists || fileInfo.size === undefined) {
      return null;
    }

    const fileSizeInMB = fileInfo.size / (1024 * 1024);

    return fileSizeInMB;
  } catch (error) {
    // You can handle it or rethrow it to be caught by calling function
    console.error('Error calculating file size:', error);
    throw error;
  }
};

export async function pickImageFromCamera(): Promise<PickedImageModal | null> {
  try {
    // Ask for permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      throw {
        response: {
          status: 400,
        },
        data: {
          code: 400,
          message: 'Permission to use camera is required!',
        },
      };
    }

    // Launch picker
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];

    const fileSize = await fileSizeValidation(asset.uri);
    return {
      uri: asset.uri,
      type: asset.mimeType,
      fileName: asset.fileName || asset.uri.split('/').pop() || `photo_${Date.now()}.jpg`, // in ios we dont get fileName from image picker library
      fileSize: fileSize,
    };
  } catch (error: any) {
    throw error;
  }
}

export async function pickImageFromGallery(): Promise<PickedImageModal | null> {
  try {
    // Ask for permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      throw {
        response: {
          status: 400,
        },
        data: {
          code: 400,
          message: 'Permission to use Media Library is required!',
        },
      };
    }

    // Launch picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'livePhotos'],
      allowsEditing: true,
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return null;
    }

    const asset = result.assets[0];
    const fileSize = await fileSizeValidation(asset.uri);

    return {
      uri: asset.uri,
      type: asset.mimeType,
      fileName: asset.fileName || asset.uri.split('/').pop() || `photo_${Date.now()}.jpg`, // in ios we dont get fileName from image picker library
      fileSize: fileSize,
    };
  } catch (error: any) {
    throw error;
  }
}

export const handleUnauthorizedError = async (error: any, thunkApi: GetThunkAPI<any>) => {
  Toast.show({
    type: 'error',
    text1: error?.data?.message || "Oop's something went wrong!",
  });
  return thunkApi.rejectWithValue(error.response?.status || error?.status || 500);
};

export async function requestLocationPermission(): Promise<boolean> {
  try {
    // Request permission to access location in the foreground
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw {
        response: {
          status: 400,
        },
        data: {
          code: 400,
          message: 'Foreground permission not granted',
          type: 'Location Permission',
        },
      };
    }
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    if (bgStatus !== 'granted') {
      throw {
        response: {
          status: 400,
        },
        data: {
          code: 400,
          message: 'Background permission not granted',
          type: 'Location Permission',
        },
      };
    }

    //check location icon on or not only in android
    if (Platform.OS === 'android') {
      await Location.getCurrentPositionAsync();
    }
    return true;
  } catch (error: any) {
    // console.log(`Location Permission Error: ${JSON.stringify(error)}`);
    if (error?.code === 'ERR_LOCATION_SETTINGS_UNSATISFIED') {
      throw {
        response: {
          status: 400,
        },
        data: {
          code: 400,
          message: 'Location services are turned off. Please enable GPS.',
          type: 'Location Services',
        },
      };
    }
    throw error;
  }
}

export async function appStateTaskHandler(dispatch: Function) {
  try {
    await requestLocationPermission();
    const hasStarted = await hasStartedLocationUpdatesBackgroundTask();
    if (!hasStarted) {
      await startLocationUpdatesBackgroundTask();
    }
  } catch (error: any) {
    await dispatch(editDriver({ driverDetails: { is_online: false } }));
    Alert.alert(error.data.type, error.data.message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        style: 'destructive',
        onPress: () => {
          openAppSettings();
        },
      },
    ]);
  }
}

export const openAppSettings = async () => {
  try {
    if (Platform.OS === 'ios') {
      const supported = await Linking.canOpenURL('app-settings:');
      if (supported) {
        await Linking.openURL('app-settings:');
      } else {
        Alert.alert('Error', 'Unable to open settings on this device.');
      }
    } else {
      await Linking.openSettings();
    }
  } catch (error) {
    console.error('Failed to open settings:', error);
    Alert.alert('Error', 'Could not open settings. Please do it manually.');
  }
};

export const getPersistedSlice = async <T = any>(sliceName: string): Promise<T | null> => {
  try {
    const persisted = await AsyncStorage.getItem('persist:root');
    if (!persisted) return null;

    const rootState = JSON.parse(persisted);
    if (!rootState[sliceName]) return null;

    return JSON.parse(rootState[sliceName]);
  } catch (error) {
    console.error(`Failed to get persisted slice: ${sliceName}`, error);
    throw `Failed to get persisted slice: ${sliceName}`;
  }
};

export let locationSubscriber: Location.LocationSubscription | null = null;

export const startDriverLocationTracking = async (dispatch: Function, activeRide: RideModal) => {
  try {
    await requestLocationPermission();
    locationSubscriber = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: 50, // in meters
      },
      async (location) => {
        const { latitude, longitude } = location.coords;

        const coordsObj =
          activeRide.status === RideStatus.Started
            ? {
                origin: { lat: latitude, lng: longitude },
                destination: {
                  lat: Number(activeRide.dropoff_lat),
                  lng: Number(activeRide.dropoff_lng),
                },
              }
            : {
                origin: { lat: latitude, lng: longitude },
                destination: {
                  lat: Number(activeRide.pickup_lat),
                  lng: Number(activeRide.pickup_lng),
                },
              };

        const coords = await fetchRideMapDirection(coordsObj);
        dispatch(
          DriverActions.setDriverLocation({
            last_location_lat: latitude,
            last_location_lng: longitude,
          })
        );
        dispatch(
          RideActions.setActiveRideMapDirection({
            activeRideMapDirectionCoordinates: coords,
          })
        );
      }
    );
  } catch (error: any) {
    Alert.alert(error.data.type, error.data.message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open Settings',
        style: 'destructive',
        onPress: () => {
          openAppSettings();
        },
      },
    ]);
  }
};

export const stopDriverLocationTracking = () => {
  locationSubscriber?.remove();
  locationSubscriber = null;
};

export const calculateDistance = (coords: {
  from: Coordinates;
  to: Coordinates;
}): { distanceInMeters: number; distanceInKilometers: number } => {
  const distanceInMeters = getDistance(coords.from, coords.to);
  const distanceInKilometers = distanceInMeters / 1000;

  return {
    distanceInMeters,
    distanceInKilometers: parseFloat(distanceInKilometers.toFixed(3)),
  };
};
