// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
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
import { RideModal } from '@/utils/modals/ride';
import { fetchRideMapDirection } from '@/api/axios';

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
  // try {
  //   if (error.response?.code === 401 || error?.status === 401) {
  //     const { accessToken } = await firebaseApi.getNewAccessToken();
  //     await AsyncStorage.setItem('accessToken', accessToken);
  //     return thunkApi.rejectWithValue(error.response?.status);
  //   } else {
  //     throw error;
  //   }
  // } catch (error: any) {
  //   Toast.show({
  //     type: 'error',
  //     text1: error?.data?.message || "Oop's something went wrong!",
  //   });
  //   return thunkApi.rejectWithValue(error.response?.status || error?.status || 500);
  // }
  throw error;
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
    return true;
  } catch (error) {
    console.log(`Location Permission Error: ${JSON.stringify(error)}`);
    throw {
      response: {
        status: 400,
      },
      data: {
        code: 400,
        message: 'Background permission not granted',
      },
    };
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
        distanceInterval: 1,
      },
      async (location) => {
        const { latitude, longitude } = location.coords;
        console.log('260>>>>>>', location.coords);

        const coords = await fetchRideMapDirection({
          origin: { lat: latitude, lng: longitude },
          destination: {
            lat: Number(activeRide.dropoff_lat),
            lng: Number(activeRide.dropoff_lng),
          },
          waypoints: [
            {
              lat: Number(activeRide.pickup_lat),
              lng: Number(activeRide.pickup_lng),
            },
          ]
            .map((wp) => `${wp.lat},${wp.lng}`)
            .join('|'),
        });
        dispatch(
          DriverActions.setDriverLocation({
            last_location_lat: latitude,
            last_location_lng: longitude,
          })
        );
        dispatch(
          RideActions.setActiveRideMapDirection({
            activeRideMapDirectionCoordinates: [{ latitude, longitude }, ...coords],
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
