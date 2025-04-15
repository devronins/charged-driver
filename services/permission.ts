import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";

// export const requestForegroundLocationAccess = createAsyncThunk(
//   "PermissionSlice/requestForegroundLocationAccess",
//   async (_, thunkAPI) => {
//     try {
//       //Foreground Permission
//       let { status } = await Location.getForegroundPermissionsAsync();
//       if (status !== "granted") {
//         const fgRequest = await Location.requestForegroundPermissionsAsync();
//         status = fgRequest.status;
//       }

//       thunkAPI.fulfillWithValue({ grantedForeground: status });
//       thunkAPI.dispatch(requestBackgroundLocationAccess());
//     } catch (error) {
//       return thunkAPI.rejectWithValue("Foreground location permission error");
//     }
//   }
// );

export const requestBackgroundLocationAccess = createAsyncThunk(
  "PermissionSlice/requestBackgroundLocationAccess",
  async (_, thunkAPI) => {
    try {
      //Background Permission
      let { status } = await Location.getBackgroundPermissionsAsync();
      if (status !== "granted") {
        const fgRequest = await Location.requestBackgroundPermissionsAsync();
        status = fgRequest.status;
      }

      return {
        grantedBackground: status,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Background location permission error");
    }
  }
);
