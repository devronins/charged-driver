import { VehicleModal } from '@/utils/modals/vehicle';
import { addVehicleDetails, editVehicleDetails, getVehicleDetails } from '@/services/vehicle';
import { createSlice } from '@reduxjs/toolkit';

interface VehicleInitialStateType {
  vehicleDetails: null | VehicleModal;
  vehicleDetailsLoading: boolean;
  error: boolean;
  isEditMode: boolean;
}

const initialState: VehicleInitialStateType = {
  vehicleDetails: null,
  vehicleDetailsLoading: false,
  error: false,
  isEditMode: true,
};

const VehicleSlice = createSlice({
  name: 'VehicleSlice', //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {
    setIsEditMode: (state, action) => {
      state.isEditMode = action.payload.status;
    },
    setIntialState: (state, action) => initialState,
  }, // action methods
  extraReducers: (builder) => {
    builder.addCase(addVehicleDetails.pending, (state) => {
      state.vehicleDetailsLoading = true;
      state.error = false;
    });
    builder.addCase(addVehicleDetails.fulfilled, (state, action) => {
      state.vehicleDetails = action.payload?.vehicleDetails || null;
      state.isEditMode = false;
      state.vehicleDetailsLoading = false;
    });
    builder.addCase(addVehicleDetails.rejected, (state, action) => {
      state.error = true;
      state.vehicleDetailsLoading = false;
    });

    builder.addCase(editVehicleDetails.pending, (state) => {
      state.vehicleDetailsLoading = true;
      state.error = false;
    });
    builder.addCase(editVehicleDetails.fulfilled, (state, action) => {
      state.vehicleDetails = action.payload?.vehicleDetails || null;
      state.isEditMode = false;
      state.vehicleDetailsLoading = false;
    });
    builder.addCase(editVehicleDetails.rejected, (state, action) => {
      state.error = true;
      state.vehicleDetailsLoading = false;
    });

    builder.addCase(getVehicleDetails.pending, (state) => {
      state.vehicleDetailsLoading = true;
      state.error = false;
    });
    builder.addCase(getVehicleDetails.fulfilled, (state, action) => {
      state.vehicleDetails = action.payload?.vehicleDetails || null;
      state.isEditMode = action.payload?.vehicleDetails ? false : true;
      state.vehicleDetailsLoading = false;
    });
    builder.addCase(getVehicleDetails.rejected, (state, action) => {
      state.error = true;
      state.vehicleDetailsLoading = false;
    });
  },
});

export const VehicleActions = {
  ...VehicleSlice.actions, //This includes all the action methods written above
};

export const VehicleReducer = VehicleSlice.reducer; //This is stored in the main store
