import { createAsyncThunk } from "@reduxjs/toolkit";
import { createVehicleDetails, fetchDriver, updateDriver, updateVehicleDetails } from "@/api/axios";
import { RoutesName } from "@/constants/routes-name";
import { Toast } from "@/utils/toast";
import { VehicleActions } from "@/reducers";

export const addVehicleDetails = createAsyncThunk<any, any>(
  "VehicleSlice/addVehicleDetails",
  async (params, thunkApi) => {
    try {
      await createVehicleDetails(params?.data);
      const { data } = await fetchDriver();
      const vehicleDetails = data.data.car_model
        ? {
            car_model: data.data.car_model,
            license_plate: data.data.license_plate,
            car_color: data.data.car_color,
            car_year: data.data.car_year,
            car_type: data.data.car_type,
          }
        : null;
      return thunkApi.fulfillWithValue({ vehicleDetails });
    } catch (err) {
      const error: any = err;
      console.log("save vehicle details error:", error);
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Vehicle Details Saved successfully",
      });
    }
  }
);

export const getVehicleDetails = createAsyncThunk<any, any>(
  "VehicleSlice/getVehicleDetails",
  async (params, thunkApi) => {
    try {
      const { data } = await fetchDriver();
      const vehicleDetails = data.data.car_model
        ? {
            car_model: data.data.car_model,
            license_plate: data.data.license_plate,
            car_color: data.data.car_color,
            car_year: data.data.car_year,
            car_type: data.data.car_type,
          }
        : null;

      return thunkApi.fulfillWithValue({ vehicleDetails });
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

export const editVehicleDetails = createAsyncThunk<any, any>(
  "VehicleSlice/editVehicleDetails",
  async (params, thunkApi) => {
    try {
      await updateVehicleDetails(params?.data);
      const { data } = await fetchDriver();
      const vehicleDetails = data.data.car_model
        ? {
            car_model: data.data.car_model,
            license_plate: data.data.license_plate,
            car_color: data.data.car_color,
            car_year: data.data.car_year,
            car_type: data.data.car_type,
          }
        : null;

      return thunkApi.fulfillWithValue({ vehicleDetails });
    } catch (err) {
      const error: any = err;
      console.log("72>>>>>>>>>.", err);
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    } finally {
      Toast.show({
        type: "success",
        text1: "Vehicle Details Edit successfully",
      });
    }
  }
);
