import * as ls from "./ls";

export const loadState = (): State => {
  try {
    const serializedStore = ls.get("store");

    if (!serializedStore)
      return { userInfo: userInitialState, threadsInfo: threadsInitialState };

    return {
      ...serializedStore,
      threadsInfo: {
        ...serializedStore.threadsInfo,
        messageStatuses: ls.get("archived") || {},
      },
    };
  } catch (e) {
    return { userInfo: userInitialState, threadsInfo: threadsInitialState };
  }
};

export const saveState = (state: State): boolean => {
  const { ...stateToSave } = state;
  try {
    ls.set("store", stateToSave);

    return ls.has("store");
  } catch (e) {
    return false;
  }
};

export const userInitialState: UserStore = {
  user: {
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    displayName: "",
  },
  fakeUser: {
    email: "",
    firstName: "",
    id: "",
    lastName: "",
    displayName: "",
  },
  isUserLogged: false,
  status: "idle",
};

export const threadsInitialState: ThreadStore = {
  threads: {},
  messages: {},
  messageStatuses: ls.get("archived") || {},
  activeThread: "",
  status: "idle",
};
