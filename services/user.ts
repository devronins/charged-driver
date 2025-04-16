import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser, fetchUsers, updateUser } from "@/api/axios";
import { RoutesName } from "@/constants/routes-name";
import { Toast } from "@/utils/toast";
import { firebaseApi, formatFirebaseError } from "@/api/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = createAsyncThunk<any, any>(
  "UserSlice/registerUser",
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.registerUserWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem("accessToken", data.accessToken);

      //call this api neccessary to register the user in our system database
      await fetchUser();

      // update user details in our system database
      await updateUser(params?.data);

      const { data: userUpdatedDataRes } = await fetchUser();

      Toast.show({
        type: "success",
        text1: "User Resgistered successfully",
      });

      // params?.navigate()// call navigate function
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        userDetails: userUpdatedDataRes.data,
        navigate: params?.navigate,
      }); // save user data;
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

export const loginUser = createAsyncThunk<any, any>(
  "UserSlice/loginUser",
  async (params, thunkApi) => {
    try {
      const data = await firebaseApi.loginWithEmailAndPassword({
        email: params?.data?.email,
        password: params?.data?.password,
      });

      //set accesstoken to localStorage
      await AsyncStorage.setItem("accessToken", data.accessToken);

      //call this api to register this user if somehow this user entry not exist in our system database
      const { data: userDataRes } = await fetchUser();
      if (userDataRes.data.user_type != "driver") {
        throw formatFirebaseError('"auth/invalid-credential"');
      }

      Toast.show({
        type: "success",
        text1: "User Login successfully",
      });
      return thunkApi.fulfillWithValue({
        accessToken: data.accessToken,
        userDetails: userDataRes.data,
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

export const logoutUser = createAsyncThunk<any, any>(
  "UserSlice/logoutUser",
  async (params, thunkApi) => {
    try {
      const data = await AsyncStorage.clear();
      params?.navigate();

      Toast.show({
        type: "success",
        text1: "User Logout successfully",
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

export const editUser = createAsyncThunk<any, any>(
  "UserSlice/editUser",
  async (params, thunkApi) => {
    try {
      const { data } = await updateUser(params?.data);
      params?.navigate(RoutesName.Users);

      Toast.show({
        type: "Success ",
        text1: "User edit successfully",
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

export const getUsers = createAsyncThunk("UserSlice/getUsers", async (_, thunkApi) => {
  try {
    const { data } = await fetchUsers({});
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

export const getUser = createAsyncThunk<any, any>("UserSlice/getUser", async (params, thunkApi) => {
  try {
    const { data } = await fetchUser();
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
