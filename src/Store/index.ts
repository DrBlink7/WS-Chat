import { PreloadedState, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { TypedUseSelectorHook } from "react-redux/es/types";
import { loadState, saveState } from "../Utils/store";
import { user } from "./user";
import { thread } from "./threads";

const setupStore = (preloadedState: PreloadedState<State>) =>
  configureStore({
    reducer: {
      userInfo: user.reducer,
      threadsInfo: thread.reducer,
    },
    preloadedState,
  });

export const store = setupStore(loadState());

store.subscribe(() => saveState(store.getState()));

export const useAppSelector: TypedUseSelectorHook<State> = useSelector;
export const useAppDispatch = () => useDispatch<typeof store.dispatch>();

export default store;
