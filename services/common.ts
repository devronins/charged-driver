// utils/imagePicker.ts
import * as ImagePicker from 'expo-image-picker';
import { logoutDriver } from './driver';
import { GetThunkAPI } from '@reduxjs/toolkit';
import { Toast } from '@/utils/toast';

export type PickedImageModal = {
  uri: string;
  fileName?: string | null;
  type?: string;
};

export enum PickerSourceEnumType {
  Camera = 'camera',
  Gallery = 'gallery',
}

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

    return {
      uri: asset.uri,
      type: asset.mimeType,
      fileName: asset.fileName,
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

    return {
      uri: asset.uri,
      type: asset.mimeType,
      fileName: asset.fileName,
    };
  } catch (error: any) {
    throw error;
  }
}

export const handleUnauthorizedError = (error: any, thunkApi: GetThunkAPI<any>) => {
  if (error.response?.code === 401 || error?.status === 401) {
    thunkApi.dispatch(logoutDriver({}));
    return thunkApi.rejectWithValue(error.response?.status);
  } else {
    Toast.show({
      type: 'error',
      text1: error?.data?.message || "Oop's something went wrong!",
    });
    return thunkApi.rejectWithValue(error.response?.status || error?.status || 500);
  }
};
