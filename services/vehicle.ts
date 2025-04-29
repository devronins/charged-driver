import { createAsyncThunk } from '@reduxjs/toolkit';
import { createVehicleDetails, fetchDriver, updateDriver, updateVehicleDetails } from '@/api/axios';
import { Toast } from '@/utils/toast';
import { handleUnauthorizedError } from './common';

export const addVehicleDetails = createAsyncThunk<any, any>(
  'VehicleSlice/addVehicleDetails',
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

      Toast.show({
        type: 'success',
        text1: 'Vehicle Details Saved successfully',
      });
      return thunkApi.fulfillWithValue({ vehicleDetails });
    } catch (err) {
      handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const getVehicleDetails = createAsyncThunk<any, any>(
  'VehicleSlice/getVehicleDetails',
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
      handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const editVehicleDetails = createAsyncThunk<any, any>(
  'VehicleSlice/editVehicleDetails',
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

      Toast.show({
        type: 'success',
        text1: 'Vehicle Details Edit successfully',
      });

      return thunkApi.fulfillWithValue({ vehicleDetails });
    } catch (err) {
      handleUnauthorizedError(err, thunkApi);
    }
  }
);
