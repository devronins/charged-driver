import {
  cancelRideRequest,
  changeRideStatus,
  getRideMapDirectionCoordinates,
  getRides,
  getRideTypes,
} from '@/services';
import { firebaseDriverRidesModal } from '@/utils/modals/firebase';
import { RideModal, RideStatus, RideTypeModal } from '@/utils/modals/ride';
import { createSlice } from '@reduxjs/toolkit';

export interface RideInitialStateType {
  activeRide: RideModal | null;
  rideDetails: RideModal | null;
  activeRideMapDirectionCoordinates: { latitude: number; longitude: number }[];
  rideRequests: firebaseDriverRidesModal[];
  rides: RideModal[];
  rideTypes: RideTypeModal[];
  loading: boolean;
  error: boolean;
}

const initialState: RideInitialStateType = {
  rideDetails: null,
  activeRide: null,
  activeRideMapDirectionCoordinates: [],
  rideRequests: [],
  rides: [],
  rideTypes: [],
  loading: false,
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
    setActiveRide: (state, action) => {
      state.activeRide = action.payload.activeRide;
    },
    setRideDetails: (
      state,
      action: {
        payload: {
          rideDetails: RideModal;
          navigate: Function;
        };
      }
    ) => {
      state.rideDetails = action.payload.rideDetails;
      action.payload.navigate();
    },
    setActiveRideMapDirection: (state, action) => {
      state.activeRideMapDirectionCoordinates = action.payload.activeRideMapDirectionCoordinates;
    },
  }, // action methods
  extraReducers: (builder) => {
    builder.addCase(changeRideStatus.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(changeRideStatus.fulfilled, (state, action) => {
      state.loading = false;
      state.rideRequests = [];
      state.activeRide =
        action.payload?.activeRide?.status === RideStatus.Accepted ||
        action.payload?.activeRide?.status === RideStatus.Started
          ? action.payload?.activeRide
          : null;
      if (action.payload?.navigate) {
        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(changeRideStatus.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(cancelRideRequest.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(cancelRideRequest.fulfilled, (state, action) => {
      state.loading = false;
    });
    builder.addCase(cancelRideRequest.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(getRides.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(getRides.fulfilled, (state, action: { payload: { rides: RideModal[] } }) => {
      state.loading = false;
      state.rides = action.payload.rides;
      state.activeRide =
        action.payload?.rides?.find(
          (item) => item.status === RideStatus.Accepted || item.status === RideStatus.Started
        ) || null;
    });
    builder.addCase(getRides.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(getRideTypes.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(
      getRideTypes.fulfilled,
      (state, action: { payload: { rideTypes: RideTypeModal[] } }) => {
        state.loading = false;
        state.rideTypes = action.payload.rideTypes;
      }
    );
    builder.addCase(getRideTypes.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(getRideMapDirectionCoordinates.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(
      getRideMapDirectionCoordinates.fulfilled,
      (
        state,
        action: {
          payload: { activeRideMapDirectionCoordinates: { latitude: number; longitude: number }[] };
        }
      ) => {
        state.loading = false;
        state.activeRideMapDirectionCoordinates = action.payload.activeRideMapDirectionCoordinates;
      }
    );
    builder.addCase(getRideMapDirectionCoordinates.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export const RideActions = {
  ...RideSlice.actions, //This includes all the action methods written above
};

export const RideReducer = RideSlice.reducer; //This is stored in the main store
