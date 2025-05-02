import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchDocumentTypes,
  fetchDriver,
  fetchUploadedDocuments,
  fileUpload,
  updateDriver,
  uploadFileDocument,
} from '@/api/axios';
import { Toast } from '@/utils/toast';
import { firebaseApi, formatFirebaseError } from '@/api/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverActions, VehicleActions } from '@/reducers';
import { handleUnauthorizedError, PickedImageModal, requestLocationPermission } from './common';
import { DriverModal } from '@/utils/modals/driver';
import {
  startLocationUpdatesBackgroundTask,
  stopLocationUpdatesBackgroundTask,
} from './task-manager';
const FormData = global.FormData; // sometime default formdata not loaded in react native, so we manually loaded this to prevent issues

export const registerDriver = createAsyncThunk<any, any>(
  'DriverSlice/registerDriver',
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.registerUserWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem('accessToken', data.accessToken);

      //call this api neccessary to register the Driver in our system database
      await fetchDriver();

      // update Driver details in our system database
      await updateDriver(params?.data);

      const { data: driverUpdatedDataRes } = await fetchDriver();

      Toast.show({
        type: 'success',
        text1: 'Driver Resgistered successfully',
      });

      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        driverDetails: driverUpdatedDataRes.data,
        navigate: params?.navigate,
      }); // save Driver data;
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const loginDriver = createAsyncThunk<any, any>(
  'DriverSlice/loginDriver',
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.loginWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem('accessToken', data.accessToken);

      //call this api to register this Driver if somehow this Driver entry not exist in our system database
      const { data: driverDataRes } = await fetchDriver();
      if (driverDataRes.data.user_type != 'driver') {
        throw formatFirebaseError('"auth/invalid-credential"');
      }

      Toast.show({
        type: 'success',
        text1: 'Driver Login successfully',
      });

      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        driverDetails: driverDataRes.data,
        navigate: params?.navigate,
      });
    } catch (err: any) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const logoutDriver = createAsyncThunk<any, any>(
  'DriverSlice/logoutDriver',
  async (params, thunkApi) => {
    try {
      await stopLocationUpdatesBackgroundTask();
      await AsyncStorage.clear();

      // params?.navigate();
      thunkApi.dispatch(DriverActions.setIntialState({}));
      thunkApi.dispatch(VehicleActions.setIntialState({}));

      Toast.show({
        type: 'success',
        text1: 'Driver Logout successfully',
      });

      return thunkApi.fulfillWithValue({});
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: 'error',
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);

export const getDriver = createAsyncThunk<any, any>(
  'DriverSlice/getDriver',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchDriver();
      return thunkApi.fulfillWithValue(data.data);
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const editDriver = createAsyncThunk<any, any>(
  'DriverSlice/editDriver',
  async (params, thunkApi) => {
    try {
      if (params?.driverDetails?.is_online) {
        await requestLocationPermission();
        await startLocationUpdatesBackgroundTask();
      } else {
        await stopLocationUpdatesBackgroundTask();
      }
      await updateDriver({ ...params?.driverDetails });
      const { data: driverDataRes } = await fetchDriver();

      Toast.show({
        type: 'success',
        text1: driverDataRes.data?.is_online
          ? 'You’re now available for rides!'
          : 'You’re now offline. See you soon!',
      });
      return thunkApi.fulfillWithValue({ driverDetails: driverDataRes.data });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const uploadDriverDocument = createAsyncThunk<
  any,
  { imageData: PickedImageModal; documentTypeId: number }
>('DriverSlice/uploadDriverDocument', async (params, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: params.imageData.uri,
      name: params.imageData.fileName,
      type: params.imageData.type,
    } as any);

    await uploadFileDocument(params.documentTypeId, formData);
    const { data } = await fetchUploadedDocuments();

    Toast.show({
      type: 'success',
      text1: 'Driver Document uploaded successfully',
    });

    return thunkApi.fulfillWithValue({
      driverUploadedDocuments: data.data,
    });
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});

export const getDriverUploadedDocuments = createAsyncThunk<any, any>(
  'DriverSlice/getDriverUploadedDocuments',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchUploadedDocuments();

      return thunkApi.fulfillWithValue({
        driverUploadedDocuments: data.data,
      });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const getDriverDocumentTypes = createAsyncThunk<any, any>(
  'DriverSlice/getDriverDocumentTypes',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchDocumentTypes();

      return thunkApi.fulfillWithValue({
        driverDocumentTypes: data.data,
      });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const uploadDriverProfileImage = createAsyncThunk<
  any,
  { imageData: PickedImageModal; driverDetails: DriverModal | null }
>('DriverSlice/uploadDriverProfileImage', async (params, thunkApi) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri: params.imageData.uri,
      name: params.imageData.fileName,
      type: params.imageData.type,
    } as any);

    const { data: fileData } = await fileUpload(formData);
    await updateDriver({ ...params?.driverDetails, photo: fileData.data });
    const { data: driverDataRes } = await fetchDriver();

    Toast.show({
      type: 'success',
      text1: 'Driver Profile Image uploaded successfully',
    });

    return thunkApi.fulfillWithValue({
      driverDetails: driverDataRes.data,
    });
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});
