import { DateTime } from "luxon";
import * as obj from "./obj";

export const apply = <T>(x: T, f: (x: T) => T): T => f(x);

export const effect =
  <T>(action: (x: T) => void) =>
  (x: T): T | PromiseLike<T> => {
    const val = x as T;
    action(val);

    return val;
  };

export const generateAvatarInitials = (firstName: string, lastName: string) =>
  `${firstName.charAt(0).toLocaleUpperCase()}${lastName
    .charAt(0)
    .toLocaleUpperCase()}`;

export const sortThreadsByUpdatedAt = (threads: GetThreadsDTO): ThreadDTO[] => {
  const sortedThreads = [...threads];

  sortedThreads.sort((a, b) => {
    const dateA = DateTime.fromISO(a.updatedAt).toMillis();
    const dateB = DateTime.fromISO(b.updatedAt).toMillis();

    return dateB - dateA;
  });

  return sortedThreads;
};

export const formatDate = (inputString: string) => {
  const dateTime = DateTime.fromISO(inputString, { zone: "UTC" });

  return dateTime.toFormat("yyyy/MM/dd HH:mm:ss");
};

export const threadsToRecord = (
  threads: ThreadDTO[]
): Record<ThreadDTO["id"], Thread> =>
  threads.reduce(
    (acc, thread) => {
      acc[thread.id] = {
        ...thread,
        deletedAt: thread.deletedAt || "",
        createdBy: {
          ...thread.createdBy,
          deletedAt: thread.createdBy.deletedAt || "",
        },
      };

      return acc;
    },
    {} as Record<ThreadDTO["id"], Thread>
  );

export const messagesToRecord = (
  messages: MessageDTO[],
  list: Record<string, MessageStatus>
): Record<MessageDTO["id"], Message> =>
  messages && messages.length > 0
    ? messages.reduce(
        (acc, message) => {
          acc[message.id] = {
            ...message,
            deletedAt: message.deletedAt || "",
            status: getMessageStatus(message.id, list),
          };

          return acc;
        },
        {} as Record<MessageDTO["id"], Message>
      )
    : {};

export const getLatestMessageId = (
  userId: string,
  messages: Record<MessageDTO["id"], Message>
): string | null => {
  const filteredMessages = Object.values(messages)
    .filter((message) => message.deletedAt === "")
    .filter((message) => message.userId === userId);

  return filteredMessages.reduce(
    (latestId, message) => {
      const messageTimestamp = DateTime.fromISO(message.createdAt).toMillis();

      if (
        latestId === null ||
        messageTimestamp >
          DateTime.fromISO(messages[latestId].createdAt).toMillis()
      )
        return message.id;

      return latestId;
    },
    null as string | null
  );
};

export const getMessageStatus = (
  id: string,
  list: Record<string, MessageStatus>
): MessageStatus => {
  if (!obj.has<MessageStatus>(list, id)) return "failed";

  return list[id];
};

export const deleteIdFromList = (
  list: Record<MessageDTO["id"], MessageStatus>,
  idToDelete: string
): Record<string, MessageStatus> => {
  const newList = { ...list };
  delete newList[idToDelete];

  return newList;
};
