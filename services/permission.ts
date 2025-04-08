import { createAsyncThunk } from "@reduxjs/toolkit";
import * as Location from "expo-location";

export const requestFullLocationAccess = createAsyncThunk(
  "PermissionSlice/requestFullLocationAccess",
  async (_, thunkAPI) => {
    try {
      // 1. Foreground Permission
      let { status: fgStatus } = await Location.getForegroundPermissionsAsync();
      if (fgStatus !== "granted") {
        const fgRequest = await Location.requestForegroundPermissionsAsync();
        fgStatus = fgRequest.status;
      }

      // 2. Background Permission (only ask if foreground is granted)
      let bgStatus = "undetermined";
      if (fgStatus === "granted") {
        const bgCheck = await Location.getBackgroundPermissionsAsync();
        bgStatus = bgCheck.status;

        if (bgStatus !== "granted") {
          const bgRequest = await Location.requestBackgroundPermissionsAsync();
          bgStatus = bgRequest.status;
        }
      }

      return {
        grantedForeground: fgStatus === "granted",
        grantedBackground: bgStatus === "granted",
        error: false,
        loading: false,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue("Location permission error");
    }
  }
);
