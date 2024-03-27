import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userInitialState } from "../Utils/store";
import { authenticateEmail } from "../Api";
import { AxiosError } from "axios";

type AuthenticateUserProps = {
  email: string;
  displayName: string;
};

export const authenticateUser = createAsyncThunk(
  "user/authenticate",
  async ({ email, displayName }: AuthenticateUserProps, thunkApi) => {
    try {
      const [response, fakeUserResponse] = await Promise.all([
        authenticateEmail(email),
        authenticateEmail("blink@4chan.org"),
      ]);

      return {
        user: response.data,
        fakeUser: fakeUserResponse.data,
        displayName,
      };
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "authenticateUser error"
      );
    }
  }
);

export const user = createSlice({
  name: "user",
  initialState: userInitialState,
  reducers: {
    clearUserState: () => userInitialState,
    clearUserStatus: (state) => {
      state.status = "idle";
    },
    setFakeUserDisplayName: (
      state,
      action: {
        payload: UserStore["fakeUser"]["displayName"];
      }
    ) => {
      state.fakeUser.displayName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(authenticateUser.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(authenticateUser.rejected, (state) => {
      state.status = "error";
      state.isUserLogged = false;
      state.user = userInitialState.user;
    });
    builder.addCase(authenticateUser.fulfilled, (state, action) => {
      state.status = "success";
      state.isUserLogged = true;
      const {
        user: { email, firstName, lastName, id },
        fakeUser,
        displayName,
      } = action.payload;
      state.user = { email, firstName, lastName, id, displayName };
      state.fakeUser = {
        ...state.fakeUser,
        email: fakeUser.email,
        firstName: fakeUser.firstName,
        id: fakeUser.id,
        lastName: fakeUser.lastName,
      };
    });
  },
});

export const { clearUserState, clearUserStatus, setFakeUserDisplayName } =
  user.actions;

export const selectIsUserLogged = (state: State) => state.userInfo.isUserLogged;
export const selectUser = (state: State) => state.userInfo.user;
export const selectFakeUser = (state: State) => state.userInfo.fakeUser;
export const selectUserInfoStatus = (state: State) => state.userInfo.status;
