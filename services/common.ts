// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import { logoutDriver } from './driver';
import { GetThunkAPI } from '@reduxjs/toolkit';
import { Toast } from '@/utils/toast';
import { updateDriverForBackgroundTask } from '@/api/axios';
import eventBus from '@/constants/event';

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

export const handleUnauthorizedError = (error: any, thunkApi: GetThunkAPI<any>) => {
  console.log('!39>>>>>>>>>>>>>>>>>', error);
  if (error.response?.code === 401 || error?.status === 401) {
    thunkApi.dispatch(logoutDriver({ data: { isSessionExpired: true } }));
    return thunkApi.rejectWithValue(error.response?.status);
  } else {
    Toast.show({
      type: 'error',
      text1: error?.data?.message || "Oop's something went wrong!",
    });
    return thunkApi.rejectWithValue(error.response?.status || error?.status || 500);
  }
};

//--------------------------------------------Location
const LOCATION_TASK_NAME = 'BACKGROUND_LOCATION_TASK';

// Define the background location task
TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error }: { data: any; error: any }): Promise<void> => {
    if (error) {
      try {
        if (error.code === 1) {
          await Promise.all([
            Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME),
            updateDriverForBackgroundTask({ is_online: false }),
          ]);

          Toast.show({
            type: 'success',
            text1: 'You’re now offline. See you soon!',
          });
          eventBus.emit('driverUpdate');
          return;
        }
      } catch (error: any) {
        console.log('Background Task Error:', error);
        Toast.show({
          type: 'error',
          text1: error,
        });
      }
    }
    if (data) {
      const { locations } = data;
      // await updateDriverForBackgroundTask({ address_coordinates: locations[0]?.coords || null }),
      console.log('Received new locations in background:', locations);
      // You can send this data to your server here
    }
  }
);

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
        },
      };
    }
    const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
    console.log('status>>>>>', status, bgStatus);
    if (bgStatus !== 'granted') {
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
    return true;
  } catch (error) {
    console.log('187>>>>>>>>>>>', JSON.stringify(error));
    throw error;
  }
}

export async function startBackgroundLocationUpdates(): Promise<void> {
  try {
    //call location permission function
    const locationStatus = await requestLocationPermission();

    // Check if the location updates task has already been started
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME);
    if (!hasStarted) {
      // Start background location updates
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 seconds
        distanceInterval: 0, // meters
        showsBackgroundLocationIndicator: true, // Show the location indicator in the status bar
        foregroundService: {
          notificationTitle: 'Tracking location',
          notificationBody: 'Location services are running in background',
          notificationColor: '#0000ff',
        },
      });
    }
  } catch (error: any) {
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
