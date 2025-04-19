import {
  DriverDocumentTypesModal,
  DriverModal,
  DriverUploadedDocumentModal,
} from '@/utils/modals/driver';
import {
  registerDriver,
  getDriver,
  loginDriver,
  logoutDriver,
  uploadDriverDocument,
  getDriverUploadedDocuments,
  getDriverDocumentTypes,
} from '@/services/driver';
import { createSlice } from '@reduxjs/toolkit';

interface DriverInitialStateType {
  isLogin: boolean;
  accessToken: string | null;
  loading: boolean;
  driverDetails: null | DriverModal;
  driverDetailsLoading: boolean;
  driverUploadedDocuments: DriverUploadedDocumentModal[];
  driverDocumentTypes: DriverDocumentTypesModal[];
  driverDocumentLoading: boolean;
  error: boolean;
}

const initialState: DriverInitialStateType = {
  isLogin: false,
  accessToken: null,
  loading: false,
  driverDetails: null,
  driverDetailsLoading: false,
  driverUploadedDocuments: [],
  driverDocumentTypes: [],
  driverDocumentLoading: false,
  error: false,
};

const DriverSlice = createSlice({
  name: 'DriverSlice', //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {
    setIntialState: (state, action) => initialState,
  }, // action methods
  extraReducers: (builder) => {
    builder.addCase(registerDriver.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(registerDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload?.accessToken || null;
      if (state.accessToken) {
        state.isLogin = true;
        state.driverDetails = action.payload.driverDetails;
        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(registerDriver.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(logoutDriver.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(logoutDriver.fulfilled, () => initialState);
    builder.addCase(logoutDriver.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(getDriver.pending, (state) => {
      state.driverDetailsLoading = true;
    });
    builder.addCase(getDriver.fulfilled, (state, action) => {
      state.driverDetails = action.payload;
      state.driverDetailsLoading = false;
    });
    builder.addCase(getDriver.rejected, (state, action) => {
      state.error = true;
      state.driverDetailsLoading = false;
    });

    builder.addCase(loginDriver.pending, (state) => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(loginDriver.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload?.accessToken || null;
      if (state.accessToken) {
        state.isLogin = true;
        state.driverDetails = action.payload.driverDetails;

        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(loginDriver.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    //----------------------------------------------------------  driver documets
    builder.addCase(uploadDriverDocument.pending, (state) => {
      state.driverDocumentLoading = true;
      state.error = false;
    });
    builder.addCase(uploadDriverDocument.fulfilled, (state, action) => {
      state.driverDocumentLoading = false;
      if (action.payload.driverUploadedDocuments) {
        state.driverUploadedDocuments = action.payload.driverUploadedDocuments;
      }
    });
    builder.addCase(uploadDriverDocument.rejected, (state, action) => {
      state.error = true;
      state.driverDocumentLoading = false;
    });

    builder.addCase(getDriverUploadedDocuments.pending, (state) => {
      state.driverDocumentLoading = true;
      state.error = false;
    });
    builder.addCase(getDriverUploadedDocuments.fulfilled, (state, action) => {
      state.driverDocumentLoading = false;
      state.driverUploadedDocuments = action.payload.driverUploadedDocuments;
    });
    builder.addCase(getDriverUploadedDocuments.rejected, (state, action) => {
      state.error = true;
      state.driverDocumentLoading = false;
    });

    builder.addCase(getDriverDocumentTypes.pending, (state) => {
      state.driverDocumentLoading = true;
      state.error = false;
    });
    builder.addCase(getDriverDocumentTypes.fulfilled, (state, action) => {
      state.driverDocumentLoading = false;
      if (action.payload.driverDocumentTypes) {
        state.driverDocumentTypes = action.payload.driverDocumentTypes;
      }
    });
    builder.addCase(getDriverDocumentTypes.rejected, (state, action) => {
      state.error = true;
      state.driverDocumentLoading = false;
    });
  },
});

export const DriverActions = {
  ...DriverSlice.actions, //This includes all the action methods written above
};

export const DriverReducer = DriverSlice.reducer; //This is stored in the main store
