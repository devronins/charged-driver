// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Location from 'expo-location';
import { editDriver, logoutDriver } from './driver';
import { GetThunkAPI } from '@reduxjs/toolkit';
import { Toast } from '@/utils/toast';
import {
  hasStartedLocationUpdatesBackgroundTask,
  startLocationUpdatesBackgroundTask,
} from './task-manager';

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
    console.log('AppState_Task_Handler_Error', error);
    dispatch(editDriver({ driverDetails: { is_online: false } }));
  }
}
