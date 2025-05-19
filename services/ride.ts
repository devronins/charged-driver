import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createRideRating,
  fetchRide,
  fetchRideMapDirection,
  fetchRides,
  fetchRideTypes,
  updateRideStatus,
} from '@/api/axios';
import { Toast } from '@/utils/toast';
import { handleUnauthorizedError, requestLocationPermission } from './common';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
import { firebaseApi } from '@/api/firebase';
import { RideModal, RideStatus } from '@/utils/modals/ride';
import * as Location from 'expo-location';
import { RideActions } from '@/reducers';
const FormData = global.FormData; // sometime default formdata not loaded in react native, so we manually loaded this to prevent issues

export const getRideDetails = createAsyncThunk<any, { rideId: number; navigate?: Function }>(
  'RideSlice/getRideDetails',
  async (params, thunkApi) => {
    try {
      const { data } = await fetchRide(params?.rideId);
      return thunkApi.fulfillWithValue({ rideDetails: data.data, navigate: params?.navigate });
    } catch (err) {
      return handleUnauthorizedError(err, thunkApi);
    }
  }
);

export const changeRideStatus = createAsyncThunk<
  any,
  { ride: { ride_id: number; status: string; cancellation_reason?: string }; navigate?: Function }
>('RideSlice/changeRideStatus', async (params, thunkApi) => {
  try {
    await updateRideStatus(params?.ride?.ride_id, {
      status: params?.ride?.status,
      cancellation_reason: params?.ride?.cancellation_reason || null,
    });
    const { data } = await fetchRide(params?.ride?.ride_id);

    Toast.show({
      type: 'success',
      text1: `You have successfully ${params?.ride?.status?.toLowerCase()} your ride.`,
    });

    if (params.ride.status === RideStatus.Completed) {
      thunkApi.dispatch(
        RideActions.setReviewModelData({
          isRattingModelVisible: {
            ride_id: params.ride.ride_id,
            isVisible: true,
          },
        })
      );
    }

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
    activeRide: RideModal;
  }
>('RideSlice/getRideMapDirectionCoordinates', async ({ activeRide }, thunkApi) => {
  try {
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });

    const coordsObj =
      activeRide.status === RideStatus.Started
        ? {
            origin: { lat: latitude, lng: longitude },
            destination: {
              lat: Number(activeRide.dropoff_lat),
              lng: Number(activeRide.dropoff_lng),
            },
          }
        : {
            origin: { lat: latitude, lng: longitude },
            destination: {
              lat: Number(activeRide.pickup_lat),
              lng: Number(activeRide.pickup_lng),
            },
          };

    const coords = await fetchRideMapDirection(coordsObj);
    return thunkApi.fulfillWithValue({
      activeRideMapDirectionCoordinates: coords,
    });
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});

export const addRideRating = createAsyncThunk<
  any,
  { rideId: number; ratingData: { rating: number } }
>('RideSlice/addRideRating', async (params, thunkApi) => {
  try {
    const { data } = await createRideRating(params.rideId, params.ratingData);
    return thunkApi.fulfillWithValue({});
  } catch (err) {
    return handleUnauthorizedError(err, thunkApi);
  }
});
