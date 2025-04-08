import { createSlice } from "@reduxjs/toolkit";
import { requestFullLocationAccess } from "@/services/permission";

interface PermissionInitialStateType {
  location: {
    grantedForeground: boolean;
    grantedBackground: boolean;
    error: boolean;
    loading: boolean;
  };
}

const initialState: PermissionInitialStateType = {
  location: {
    grantedForeground: false,
    grantedBackground: false,
    error: false,
    loading: false,
  },
};

const PermissionSlice = createSlice({
  name: "PermissionSlice", //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {}, // action methods
  extraReducers: builder => {
    builder.addCase("RESET_STATE", () => initialState);

    builder.addCase(requestFullLocationAccess.pending, (state, action) => {
      state.location.loading = true;
    });
    builder.addCase(requestFullLocationAccess.fulfilled, (state, action) => {
      state.location = action.payload;
    });
    builder.addCase(requestFullLocationAccess.rejected, (state, action) => {
      state.location.error = true;
    });
  },
});

export const PermissionActions = {
  ...PermissionSlice.actions, //This includes all the action methods written above
};

export const PermissionReducer = PermissionSlice.reducer; //This is stored in the main store
