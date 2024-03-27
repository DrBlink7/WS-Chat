import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { threadsInitialState } from "../Utils/store";
import {
  createThread,
  deleteMessage,
  deleteThread,
  editMessage,
  editThread,
  getThread,
  getThreads,
  sendMessage,
} from "../Api";
import { AxiosError } from "axios";
import {
  deleteIdFromList,
  messagesToRecord,
  sortThreadsByUpdatedAt,
  threadsToRecord,
} from "../Utils/f";

export const getThreadList = createAsyncThunk(
  "threads",
  async (userId: string, thunkApi) => {
    try {
      const response = await getThreads(userId);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "getThreadList error"
      );
    }
  }
);

type ActiveThreadInfoProps = {
  id: string;
  userId: string;
};

export const getActiveThreadInfo = createAsyncThunk(
  "threads/:id(get)",
  async ({ id, userId }: ActiveThreadInfoProps, thunkApi) => {
    try {
      const response = await getThread(id, userId);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "getThreadList error"
      );
    }
  }
);

type CreateNewThreadProps = {
  title: string;
  userId: string;
};

export const createNewThread = createAsyncThunk(
  "threads/new",
  async ({ title, userId }: CreateNewThreadProps, thunkApi) => {
    try {
      const response = await createThread(userId, title);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "createNewThread error"
      );
    }
  }
);

type EditAThreadProps = {
  title: string;
  userId: string;
  id: string;
};

export const editAThread = createAsyncThunk(
  "threads/:id(patch)",
  async ({ title, userId, id }: EditAThreadProps, thunkApi) => {
    try {
      const response = await editThread(id, title, userId);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "editAThread error"
      );
    }
  }
);

type DeleteAThreadProps = {
  userId: string;
  id: string;
};

export const deleteAThread = createAsyncThunk(
  "threads/:id(delete)",
  async ({ userId, id }: DeleteAThreadProps, thunkApi) => {
    try {
      const response = await deleteThread(id, userId);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "deleteAThread error"
      );
    }
  }
);

type SendAMessageProps = {
  userId: string;
  text: string;
  threadId: string;
  displayName: string;
  checkSum: MessageStatus;
};

export const sendAMessage = createAsyncThunk(
  "/messages/new",
  async (
    { userId, text, threadId, displayName, checkSum }: SendAMessageProps,
    thunkApi
  ) => {
    try {
      const response = await sendMessage(
        userId,
        text,
        threadId,
        displayName,
        checkSum
      );

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "sendAMessage error"
      );
    }
  }
);

type DeleteAMessageProps = {
  userId: string;
  id: string;
};

export const deleteAMessage = createAsyncThunk(
  "/messages/:id(delete)",
  async ({ userId, id }: DeleteAMessageProps, thunkApi) => {
    try {
      const response = await deleteMessage(userId, id);

      return { valueOf: response.data, id };
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "deleteAMessage error"
      );
    }
  }
);

type EditAMessageProps = {
  userId: string;
  text: string;
  id: string;
};

export const editAMessage = createAsyncThunk(
  "/messages/:id(patch)",
  async ({ userId, text, id }: EditAMessageProps, thunkApi) => {
    try {
      const response = await editMessage(userId, id, text);

      return response.data;
    } catch (e) {
      const error = e as AxiosError;

      return thunkApi.rejectWithValue(
        error.response?.data || "editAMessage error"
      );
    }
  }
);

export const thread = createSlice({
  name: "threads",
  initialState: threadsInitialState,
  reducers: {
    clearThreadState: () => threadsInitialState,
    clearThreadStatus: (state) => {
      state.status = "idle";
    },
    setActiveThread: (
      state,
      action: {
        payload: ThreadStore["activeThread"];
      }
    ) => {
      state.activeThread = action.payload;
    },
    setMessageStatuses: (
      state,
      action: {
        payload: {
          id: keyof ThreadStore["messageStatuses"];
          status: ThreadStore["messageStatuses"][keyof ThreadStore["messageStatuses"]];
        };
      }
    ) => {
      const { id, status } = action.payload;
      const messageStatuses = { ...state.messageStatuses };
      messageStatuses[id] = status;
      state.messageStatuses = messageStatuses;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getThreadList.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getThreadList.rejected, (state) => {
      state.status = "error";
      state.threads = threadsInitialState.threads;
    });
    builder.addCase(getThreadList.fulfilled, (state, action) => {
      state.status = "success";
      state.threads = threadsToRecord(sortThreadsByUpdatedAt(action.payload));
    });
    builder.addCase(getActiveThreadInfo.pending, (state) => {
      // state.status = "loading";
    });
    builder.addCase(getActiveThreadInfo.rejected, (state) => {
      state.status = "error";
      state.messages = threadsInitialState.messages;
    });
    builder.addCase(getActiveThreadInfo.fulfilled, (state, action) => {
      state.status = "success";
      state.messages = messagesToRecord(
        action.payload.messages,
        state.messageStatuses
      );
    });
    builder.addCase(createNewThread.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(createNewThread.rejected, (state) => {
      state.status = "error";
      state.activeThread = threadsInitialState.activeThread;
    });
    builder.addCase(createNewThread.fulfilled, (state, action) => {
      state.status = "success";
      state.activeThread = action.payload.id;
    });
    builder.addCase(editAThread.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(editAThread.rejected, (state) => {
      state.status = "error";
      state.activeThread = threadsInitialState.activeThread;
    });
    builder.addCase(editAThread.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(deleteAThread.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(deleteAThread.rejected, (state) => {
      state.status = "error";
      state.activeThread = threadsInitialState.activeThread;
    });
    builder.addCase(deleteAThread.fulfilled, (state) => {
      state.status = "success";
    });
    builder.addCase(sendAMessage.pending, (state) => {
      // state.status = "loading";
    });
    builder.addCase(sendAMessage.rejected, (state) => {
      // state.status = "error";
    });
    builder.addCase(sendAMessage.fulfilled, (state) => {
      // state.status = "success";
    });
    builder.addCase(editAMessage.pending, (state) => {
      // state.status = "loading";
    });
    builder.addCase(editAMessage.rejected, (state) => {
      // state.status = "error";
    });
    builder.addCase(editAMessage.fulfilled, (state) => {
      // state.status = "success";
    });
    builder.addCase(deleteAMessage.pending, (state) => {
      // state.status = "loading";
    });
    builder.addCase(deleteAMessage.rejected, (state) => {
      // state.status = "error";
    });
    builder.addCase(deleteAMessage.fulfilled, (state, action) => {
      // state.status = "success";
      state.messageStatuses = deleteIdFromList(
        state.messageStatuses,
        action.payload.id
      );
    });
  },
});

export const {
  clearThreadState,
  clearThreadStatus,
  setActiveThread,
  setMessageStatuses,
} = thread.actions;

export const selectThreads = (state: State) => state.threadsInfo.threads;
export const selectMessages = (state: State) => state.threadsInfo.messages;
export const selectMessageStatuses = (state: State) =>
  state.threadsInfo.messageStatuses;
export const selectActiveThread = (state: State) =>
  state.threadsInfo.activeThread;
export const selectThreadsInfoStatus = (state: State) =>
  state.threadsInfo.status;
