import { createSlice } from "@reduxjs/toolkit";
import { requestBackgroundLocationAccess } from "@/services/permission";

export enum PermissionTypeEnum {
  GRANTED = "granted",
  UNDETERMINED = "undetermined",
  DENIED = "denied",
}

interface PermissionInitialStateType {
  location: {
    grantedForeground: PermissionTypeEnum;
    grantedBackground: PermissionTypeEnum;
    error: boolean;
    loading: boolean;
  };
  memory: {
    camera: PermissionTypeEnum;
    error: boolean;
    loading: boolean;
  };
}

const initialState: PermissionInitialStateType = {
  location: {
    grantedForeground: PermissionTypeEnum.UNDETERMINED,
    grantedBackground: PermissionTypeEnum.UNDETERMINED,
    error: false,
    loading: false,
  },
  memory: {
    camera: PermissionTypeEnum.UNDETERMINED,
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

    // builder.addCase(requestForegroundLocationAccess.pending, (state, action) => {
    //   state.location.loading = true;
    // });
    // builder.addCase(requestForegroundLocationAccess.fulfilled, (state, action) => {
    //   //@ts-ignore
    //   state.location.grantedForeground = action.payload.grantedForeground;
    // });
    // builder.addCase(requestForegroundLocationAccess.rejected, (state, action) => {
    //   state.location.error = true;
    // });

    builder.addCase(requestBackgroundLocationAccess.pending, (state, action) => {
      state.location.loading = true;
    });
    builder.addCase(requestBackgroundLocationAccess.fulfilled, (state, action) => {
      //@ts-ignore
      state.location.grantedBackground = action.payload.grantedBackground;
    });
    builder.addCase(requestBackgroundLocationAccess.rejected, (state, action) => {
      state.location.error = true;
    });
  },
});

export const PermissionActions = {
  ...PermissionSlice.actions, //This includes all the action methods written above
};

export const PermissionReducer = PermissionSlice.reducer; //This is stored in the main store
