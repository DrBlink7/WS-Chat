/**
 * DTO e BODY
 * DTO suffix types will represent responses coming from BE.
 * BODY suffix types will represent request body (and parameters) that BE needs.
 */

type AuthenticateBody = {
  email: string;
};

type AuthenticateDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
};

type AuthenticatePayload = {
  user: AuthenticateDTO;
  fakeUser: AuthenticateDTO;
  displayName: string;
};

type Message = {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  status: MessageStatus;
};

type MessageDTO = {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

type SendMessageBody = {
  text: string;
  threadId: string;
  displayName: string;
  checkSum: MessageStatus;
};

type SendMessageDTO = MessageDTO & {
  checkSum: MessageStatus;
};

type EditMessageBody = {
  text: string;
};

type EditMessageDTO = MessageDTO;

type DeleteMessageDTO = boolean;

type CreateThreadBody = {
  title: string;
};

type CreatedByDTO = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string | null;
};

type ThreadDTO = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  createdBy: CreatedByDTO;
};

type CreatedBy = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  updatedAt: string;
  createdAt: string;
  deletedAt: string;
};

type Thread = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  createdBy: CreatedBy;
};

type CreateThreadDTO = ThreadDTO;

type GetThreadsDTO = ThreadDTO[];

type GetThreadDTO = ThreadDTO & { messages: MessageDTO[] };

type EditThreadBody = {
  title: string;
};

type EditThreadDTO = ThreadDTO;

type DeleteThreadDTO = boolean;

type SocketSend<T extends keyof SocketSendPayloads> = {
  type: T;
  payload: SocketSendPayloads[T];
};

type SocketSendPayloads = {
  THREAD_SUBSCRIPTION: {
    authorization: string;
    threadId: string;
  };
  MESSAGE_CREATED: {
    message: SendMessageDTO;
    threadId: string;
  };
};

/**
 * Redux State Store
 * 2 main slices: userInfo and threadsInfo
 */

type User = Pick<AuthenticateDTO, "id" | "firstName" | "lastName" | "email"> & {
  displayName: string;
};
type Status = "success" | "idle" | "error" | "loading";
type MessageStatus = "failed" | "sent";

type UserStore = {
  user: User;
  fakeUser: User;
  isUserLogged: boolean;
  status: Status;
};

type ThreadStore = {
  threads: Record<ThreadDTO["id"], Thread>;
  activeThread: ThreadDTO["id"];
  messages: Record<MessageDTO["id"], Message>;
  messageStatuses: Record<string, MessageStatus>;
  status: Status;
};

type State = {
  userInfo: UserStore;
  threadsInfo: ThreadStore;
};

/**
 * React-Hook-Forms form interfaces
 */

interface ChatFormInputs {
  message: string;
}

interface LoginFormInputs {
  email: string;
  displayName: string;
}

interface ThreadFormInputs {
  title: string;
}

/**
 * Utils
 * Types for React FunctionalComponents
 */

type WithChildren = {
  children?: React.ReactNode;
};
