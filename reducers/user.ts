import { UserModal } from "@/utils/modals/user";
import { registerUser, editUser, getUser, loginUser, logoutUser } from "@/services/user";
import { createSlice } from "@reduxjs/toolkit";

interface UsersModal {
  count: number;
  rows: UserModal[];
}

interface UserInitialStateType {
  isLogin: boolean;
  accessToken: string | null;
  users: null | UsersModal;
  loading: boolean;
  usersLoading: boolean;
  userDetails: null | UserModal;
  userDetailsLoading: boolean;
  error: boolean;
}

const initialState: UserInitialStateType = {
  isLogin: false,
  accessToken: null,
  users: null,
  loading: false,
  usersLoading: false,
  userDetails: null,
  userDetailsLoading: false,
  error: false,
};

const UserSlice = createSlice({
  name: "UserSlice", //must be unique for every slice. convention is to put the same as file name
  initialState, //the initial state of the slice
  reducers: {}, // action methods
  extraReducers: builder => {
    builder.addCase("RESET_STATE", () => initialState);

    builder.addCase(registerUser.pending, state => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload?.accessToken || null;
      if (state.accessToken) {
        state.isLogin = true;
        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(logoutUser.pending, state => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(logoutUser.fulfilled, () => initialState);
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });

    builder.addCase(editUser.pending, state => {
      state.userDetailsLoading = true;
    });
    builder.addCase(editUser.fulfilled, (state, action) => {
      state.userDetails = action.payload;
      state.userDetailsLoading = false;
    });
    builder.addCase(editUser.rejected, (state, action) => {
      state.error = true;
      state.userDetailsLoading = false;
    });

    builder.addCase(getUser.pending, state => {
      state.userDetailsLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.userDetails = action.payload;
      state.userDetailsLoading = false;
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.error = true;
      state.userDetailsLoading = false;
    });

    builder.addCase(loginUser.pending, state => {
      state.loading = true;
      state.error = false;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.accessToken = action.payload?.accessToken || null;
      if (state.accessToken) {
        state.isLogin = true;

        //call navigate function
        action.payload?.navigate();
      }
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = true;
      state.loading = false;
    });
  },
});

export const UserActions = {
  ...UserSlice.actions, //This includes all the action methods written above
};

export const UserReducer = UserSlice.reducer; //This is stored in the main store
