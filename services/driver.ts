import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDriver, fetchDrivers, updateDriver } from "@/api/axios";
import { RoutesName } from "@/constants/routes-name";
import { Toast } from "@/utils/toast";
import { firebaseApi, formatFirebaseError } from "@/api/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      Toast.show({
        type: "success",
        text1: "Driver Resgistered successfully",
      });

      // params?.navigate()// call navigate function
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        DriverDetails: driverUpdatedDataRes.data,
        navigate: params?.navigate,
      }); // save Driver data;
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

      Toast.show({
        type: "success",
        text1: "Driver Login successfully",
      });
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        DriverDetails: driverDataRes.data,
        navigate: params?.navigate,
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

export const logoutDriver = createAsyncThunk<any, any>(
  "DriverSlice/logoutDriver",
  async (params, thunkApi) => {
    try {
      const data = await AsyncStorage.clear();
      params?.navigate();

      Toast.show({
        type: "success",
        text1: "Driver Logout successfully",
      });
      return thunkApi.fulfillWithValue({});
    } catch (err) {
      const error: any = err;
      Toast.show({
        type: "error",
        text1: error?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);

export const editDriver = createAsyncThunk<any, any>(
  "DriverSlice/editDriver",
  async (params, thunkApi) => {
    try {
      const { data } = await updateDriver(params?.data);
      params?.navigate(RoutesName.PageEdit);

      Toast.show({
        type: "Success ",
        text1: "Driver edit successfully",
      });

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

export const getDrivers = createAsyncThunk("DriverSlice/getDrivers", async (_, thunkApi) => {
  try {
    const { data } = await fetchDrivers({});
    return thunkApi.fulfillWithValue(data.data);
  } catch (err) {
    const error: any = err;
    Toast.show({
      type: "Error ",
      text1: error?.message || "Oop's something went wrong!",
    });
    return thunkApi.rejectWithValue(error.response?.status);
  }
});

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
