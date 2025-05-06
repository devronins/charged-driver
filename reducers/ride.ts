import { firebaseRidesModal } from '@/utils/modals/firebase';
import { createSlice } from '@reduxjs/toolkit';

interface RideInitialStateType {
  rideRequests: firebaseRidesModal[];
  error: boolean;
}

const initialState: RideInitialStateType = {
  rideRequests: [],
  error: false,
};

const RideSlice = createSlice({
  name: 'RideSlice', //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {
    setIntialState: (state, action) => initialState,
    setRideRequests: (state, action) => {
      state.rideRequests = [...action.payload.rideRequests];
    },
    removeRideRequest: (state, action) => {
      state.rideRequests = state.rideRequests.filter(
        (item) => item.ride_id !== action.payload.rideRequest.ride_id
      );
    },
    removeAllRideRequest: (state, action) => {
      state.rideRequests = [];
    },
  }, // action methods
  extraReducers: (builder) => {},
});

export const RideActions = {
  ...RideSlice.actions, //This includes all the action methods written above
};

export const RideReducer = RideSlice.reducer; //This is stored in the main store
