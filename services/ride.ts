import { createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRide, fetchRides, updateRideStatus } from '@/api/axios';
import { Toast } from '@/utils/toast';
import { handleUnauthorizedError } from './common';
import { RideModal } from '@/utils/modals/ride';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
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
  { driverRide: firebaseDriverRidesModal & { status: string }; navigate?: Function }
>('RideSlice/changeRideStatus', async (params, thunkApi) => {
  try {
    console.log('26>>>>>>>', params?.driverRide);
    await updateRideStatus(params?.driverRide?.ride_id, { status: params?.driverRide?.status });
    const { data } = await fetchRide(params?.driverRide?.ride_id);

    return thunkApi.fulfillWithValue({
      activeRide: data.data,
      navigate: params?.driverRide?.status ? params.driverRide.status : null,
    });
  } catch (err) {
    console.log('44>>>>>>>>>>>>>', err);
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
