import { changeRideStatus } from '@/services';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
import { RideModal } from '@/utils/modals/ride';
import { createSlice } from '@reduxjs/toolkit';

interface RideInitialStateType {
  activeRide: RideModal | null;
  rideRequests: firebaseDriverRidesModal[];
  rides: any[];
  ridesLoading: boolean;
  error: boolean;
}

const initialState: RideInitialStateType = {
  activeRide: null,
  rideRequests: [],
  rides: [],
  ridesLoading: false,
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
    //TODO: currently this is synchrnous later on we call api to accept ride
    acceptRideRequest: (state, action) => {
      state.activeRide = action.payload.rideRequest;
      state.rideRequests = [];
      action.payload?.navigate();
    },
  }, // action methods
  extraReducers: (builder) => {
    builder.addCase(changeRideStatus.pending, (state) => {
      state.ridesLoading = true;
      state.error = false;
    });
    builder.addCase(changeRideStatus.fulfilled, (state, action) => {
      state.ridesLoading = false;
      state.rideRequests = [];
      state.activeRide = action.payload?.activeRide || null;
      if (action.payload?.navigate) {
        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(changeRideStatus.rejected, (state, action) => {
      state.error = true;
      state.ridesLoading = false;
    });
  },
});

export const RideActions = {
  ...RideSlice.actions, //This includes all the action methods written above
};

export const RideReducer = RideSlice.reducer; //This is stored in the main store
