import { createAsyncThunk } from "@reduxjs/toolkit";
import { createVehicleDetails, fetchDriver, updateDriver, updateVehicleDetails } from "@/api/axios";
import { RoutesName } from "@/constants/routes-name";
import { Toast } from "@/utils/toast";
import { VehicleActions } from "@/reducers";

export const addVehicleDetails = createAsyncThunk<any, any>(
  "VehicleSlice/addVehicleDetails",
  async (params, thunkApi) => {
    try {
      const { data } = await createVehicleDetails(params?.data);

      Toast.show({
        type: "success",
        text1: "Vehicle Details Saved successfully",
      });
      thunkApi.dispatch(VehicleActions.setIsEditMode({ status: false }));
      return thunkApi.fulfillWithValue(data.data);
    } catch (err) {
      const error: any = err;
      console.log("save vehicle details error:", error);
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
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
      const { data } = await updateVehicleDetails(params?.data);

      Toast.show({
        type: "success",
        text1: "Vehicle Details Edit successfully",
      });

      thunkApi.dispatch(VehicleActions.setIsEditMode({ status: false }));
      thunkApi.dispatch(getVehicleDetails({}));
      return thunkApi.fulfillWithValue({});
    } catch (err) {
      const error: any = err;
      console.log("72>>>>>>>>>.", err);
      Toast.show({
        type: "error",
        text1: error?.data?.message || "Oop's something went wrong!",
      });
      return thunkApi.rejectWithValue(error.response?.status);
    }
  }
);
