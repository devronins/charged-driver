import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchDocumentTypes,
  fetchDriver,
  fetchDrivers,
  fetchUploadedDocuments,
  updateDriver,
  uploadFileDocument,
} from "@/api/axios";
import { Toast } from "@/utils/toast";
import { firebaseApi, formatFirebaseError } from "@/api/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DriverActions, VehicleActions } from "@/reducers";

export const registerDriver = createAsyncThunk<any, any>(
  "DriverSlice/registerDriver",
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.registerUserWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem("accessToken", data.accessToken);

      //call this api neccessary to register the Driver in our system database
      await fetchDriver();

      // update Driver details in our system database
      await updateDriver(params?.data);

      const { data: driverUpdatedDataRes } = await fetchDriver();

      // params?.navigate()// call navigate function
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        driverDetails: driverUpdatedDataRes.data,
        navigate: params?.navigate,
      }); // save Driver data;
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Driver Resgistered successfully",
      });
    }
  }
);

export const loginDriver = createAsyncThunk<any, any>(
  "DriverSlice/loginDriver",
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.loginWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem("accessToken", data.accessToken);

      //call this api to register this Driver if somehow this Driver entry not exist in our system database
      const { data: driverDataRes } = await fetchDriver();
      if (driverDataRes.data.user_type != "driver") {
        throw formatFirebaseError('"auth/invalid-credential"');
      }
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        driverDetails: driverDataRes.data,
        navigate: params?.navigate,
      });
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Driver Login successfully",
      });
    }
  }
);

export const logoutDriver = createAsyncThunk<any, any>(
  "DriverSlice/logoutDriver",
  async (params, thunkApi) => {
    try {
      await AsyncStorage.clear();

      params?.navigate();
      thunkApi.dispatch(DriverActions.setIntialState({}));
      thunkApi.dispatch(VehicleActions.setIntialState({}));

      return thunkApi.fulfillWithValue({});
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Driver Logout successfully",
      });
    }
  }
);

export const getDriver = createAsyncThunk<any, any>(
  "DriverSlice/getDriver",
  async (params, thunkApi) => {
    try {
      const { data } = await fetchDriver();
      return thunkApi.fulfillWithValue(data.data);
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "Error ",
        text1: error?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);

export const uploadDriverDocument = createAsyncThunk<any, any>(
  "DriverSlice/uploadDriverDocument",
  async (params, thunkApi) => {
    try {
      await uploadFileDocument(params?.data?.documentType);

      const { data } = await fetchUploadedDocuments();

      return thunkApi.fulfillWithValue({
        driverUploadedDocuments: data.data,
      });
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Driver Document uploaded successfully",
      });
    }
  }
);

export const getDriverUploadedDocuments = createAsyncThunk<any, any>(
  "DriverSlice/getDriverUploadedDocuments",
  async (params, thunkApi) => {
    try {
      const { data } = await fetchUploadedDocuments();

      return thunkApi.fulfillWithValue({
        driverUploadedDocuments: data.data,
      });
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);

export const getDriverDocumentTypes = createAsyncThunk<any, any>(
  "DriverSlice/getDriverDocumentTypes",
  async (params, thunkApi) => {
    try {
      const { data } = await fetchDocumentTypes();

      return thunkApi.fulfillWithValue({
        driverDocumentTypes: data.data,
      });
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);
