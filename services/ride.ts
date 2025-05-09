import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchRide,
  fetchRideMapDirection,
  fetchRides,
  fetchRideTypes,
  updateRideStatus,
} from '@/api/axios';
import { Toast } from '@/utils/toast';
import { handleUnauthorizedError } from './common';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
import { firebaseApi } from '@/api/firebase';
const FormData = global.FormData; // sometime default formdata not loaded in react native, so we manually loaded this to prevent issues

export const getRideDetails = createAsyncThunk<any, any>(
  'RideSlice/getRideDetails',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchRide(params?.data?.rideId);
      return thunkApi.fulfillWithValue(data.data);
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const changeRideStatus = createAsyncThunk<
  any,
  { ride: { ride_id: number; status: string }; navigate?: Function }
>('RideSlice/changeRideStatus', async (params, thunkApi) => {
  try {
    await updateRideStatus(params?.ride?.ride_id, { status: params?.ride?.status });
    const { data } = await fetchRide(params?.ride?.ride_id);

    Toast.show({
      type: 'success',
      text1: `You have successfully ${params?.ride?.status?.toLowerCase()} your ride.`,
    });

    return thunkApi.fulfillWithValue({
      activeRide: data.data,
      navigate: params?.navigate,
    });
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});

export const cancelRideRequest = createAsyncThunk<
  any,
  { driverRide: firebaseDriverRidesModal & { status: string } }
>('RideSlice/cancelRideRequest', async (params, thunkApi) => {
  try {
    await firebaseApi.cancelDriverRideByRideId(
      params?.driverRide?.ride_id,
      params?.driverRide?.driver_id,
      params.driverRide
    );
    return thunkApi.fulfillWithValue({});
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});

export const getRides = createAsyncThunk<any, any>(
  'RideSlice/getRides',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchRides();

      return thunkApi.fulfillWithValue({
        rides: data.data,
      });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const getRideTypes = createAsyncThunk<any, any>(
  'RideSlice/getRideTypes',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchRideTypes();

      return thunkApi.fulfillWithValue({
        rideTypes: data.data,
      });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const getRideMapDirectionCoordinates = createAsyncThunk<
  any,
  {
    coordinates: {
      origin: { lat: number; lng: number };
      destination: { lat: number; lng: number };
      waypoints?: string;
    };
  }
>('RideSlice/getRideMapDirectionCoordinates', async (params, thunkApi) => {
  try {
    const coords = await fetchRideMapDirection(params.coordinates);
    return thunkApi.fulfillWithValue({
      activeRideMapDirectionCoordinates: coords,
    });
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});
