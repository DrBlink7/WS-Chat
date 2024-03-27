import {
  apply,
  deleteIdFromList,
  formatDate,
  generateAvatarInitials,
  getLatestMessageId,
  getMessageStatus,
  messagesToRecord,
  sortThreadsByUpdatedAt,
  threadsToRecord,
} from "./f";

describe("apply", () => {
  it("applies a function to a value", () => {
    const result = apply(5, (x) => x * 2);
    expect(result).toBe(10);
  });
});

describe("generateAvatarInitials", () => {
  it("returns the correct initials for valid input", () => {
    const firstName = "John";
    const lastName = "Doe";
    const result = generateAvatarInitials(firstName, lastName);
    expect(result).toBe("JD");
  });

  it("returns only 1 letter if first name or last name is empty", () => {
    const firstName = "John";
    const lastName = "";
    const result = generateAvatarInitials(firstName, lastName);
    expect(result).toBe("J");

    const emptyFirstName = "";
    const nonEmptyLastName = "Doe";
    const result2 = generateAvatarInitials(emptyFirstName, nonEmptyLastName);
    expect(result2).toBe("D");
  });

  it("returns empty if first name and last name is empty", () => {
    const firstName = "";
    const lastName = "";
    const result = generateAvatarInitials(firstName, lastName);
    expect(result).toBe("");
  });

  it("handles special characters and spaces correctly", () => {
    const firstName = "Jöhn";
    const lastName = "Doe-Smith";
    const result = generateAvatarInitials(firstName, lastName);
    expect(result).toBe("JD");
  });
});

describe("sortThreadsByUpdatedAt", () => {
  it("correctly sorts threads by updatedAt in descending order", () => {
    const threads: ThreadDTO[] = [
      {
        id: "1",
        title: "Thread 1",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-03T08:00:00Z",
        deletedAt: "",

        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-02T10:00:00Z",
          createdAt: "2023-01-01T12:00:00Z",
          deletedAt: "",
        },
      },
      {
        id: "2",
        title: "Thread 2",
        createdAt: "2023-01-02T12:00:00Z",
        updatedAt: "2023-01-04T08:00:00Z",
        deletedAt: "",

        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-02T10:00:00Z",
          createdAt: "2023-01-01T12:00:00Z",
          deletedAt: "",
        },
      },
    ];

    const sortedThreads = sortThreadsByUpdatedAt(threads);
    const currentThread = sortedThreads[0];
    const nextThread = sortedThreads[1];
    const dateCurrent = new Date(currentThread.updatedAt);
    const dateNext = new Date(nextThread.updatedAt);

    expect(dateCurrent.getTime()).toBeGreaterThanOrEqual(dateNext.getTime());
  });

  it("returns an empty array if input threads array is empty", () => {
    const threads: ThreadDTO[] = [];
    const sortedThreads = sortThreadsByUpdatedAt(threads);
    expect(sortedThreads).toEqual([]);
  });
});

describe("formatDate", () => {
  it("formats the date string correctly", () => {
    const inputString = "2023-01-01T12:00:00Z";
    const formattedDate = formatDate(inputString);
    expect(formattedDate).toBe("2023/01/01 12:00:00");
  });

  it("handles a different date string", () => {
    const inputString = "2023-02-15T18:30:45Z";
    const formattedDate = formatDate(inputString);
    expect(formattedDate).toBe("2023/02/15 18:30:45");
  });

  it("handles midnight correctly", () => {
    const inputString = "2023-03-20T00:00:00Z";
    const formattedDate = formatDate(inputString);
    expect(formattedDate).toBe("2023/03/20 00:00:00");
  });

  it("handles different time zones", () => {
    const inputString = "2023-04-10T10:45:30+02:00";
    const formattedDate = formatDate(inputString);
    expect(formattedDate).toBe("2023/04/10 08:45:30");
  });

  it("handles invalid input gracefully", () => {
    const inputString = "invalid-date-format";
    const formattedDate = formatDate(inputString);
    expect(formattedDate).toBe("Invalid DateTime");
  });
});

describe("threadsToRecord", () => {
  it("converts an array of threads to a record", () => {
    const threads = [
      {
        id: "1",
        title: "Thread 1",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-03T08:00:00Z",
        deletedAt: null,
        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-02T10:00:00Z",
          createdAt: "2023-01-01T12:00:00Z",
          deletedAt: null,
        },
      },
      {
        id: "2",
        title: "Thread 2",
        createdAt: "2023-01-02T12:00:00Z",
        updatedAt: "2023-01-05T08:00:00Z",
        deletedAt: null,
        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-03T10:00:00Z",
          createdAt: "2023-01-02T12:00:00Z",
          deletedAt: null,
        },
      },
    ];

    const result = threadsToRecord(threads);

    expect(result).toEqual({
      "1": {
        id: "1",
        title: "Thread 1",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-03T08:00:00Z",
        deletedAt: "",
        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-02T10:00:00Z",
          createdAt: "2023-01-01T12:00:00Z",
          deletedAt: "",
        },
      },
      "2": {
        id: "2",
        title: "Thread 2",
        createdAt: "2023-01-02T12:00:00Z",
        updatedAt: "2023-01-05T08:00:00Z",
        deletedAt: "",
        createdBy: {
          id: "user1",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          updatedAt: "2023-01-03T10:00:00Z",
          createdAt: "2023-01-02T12:00:00Z",
          deletedAt: "",
        },
      },
    });
  });

  it("handles an empty array gracefully", () => {
    const threads: Thread[] = [];
    const result = threadsToRecord(threads);
    expect(result).toEqual({});
  });

  it("handles threads with deletedAt values correctly", () => {
    const threads = [
      {
        id: "2",
        title: "Thread 2",
        createdAt: "2023-02-01T08:00:00Z",
        updatedAt: "2023-02-05T15:30:00Z",
        deletedAt: "2023-02-10T10:00:00Z",
        createdBy: {
          id: "user2",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          updatedAt: "2023-02-03T12:00:00Z",
          createdAt: "2023-02-01T08:00:00Z",
          deletedAt: "2023-02-10T10:00:00Z",
        },
      },
    ];

    const result = threadsToRecord(threads);

    expect(result["2"].deletedAt).toBe("2023-02-10T10:00:00Z");
    expect(result["2"].createdBy.deletedAt).toBe("2023-02-10T10:00:00Z");
  });
});

describe("messagesToRecord", () => {
  it("converts an array of messages to a record", () => {
    const messages = [
      {
        id: "1",
        text: "Hello!",
        userId: "user1",
        displayName: "John Doe",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-03T08:00:00Z",
        deletedAt: null,
      },
      {
        id: "2",
        text: "Hi!",
        userId: "user2",
        displayName: "Jane Doe",
        createdAt: "2023-01-01T12:01:00Z",
        updatedAt: "2023-01-03T08:01:00Z",
        deletedAt: null,
      },
      {
        id: "3",
        text: "I love you!",
        userId: "user1",
        displayName: "John Doe",
        createdAt: "2023-01-03T08:02:00Z",
        updatedAt: "2023-01-03T08:02:00Z",
        deletedAt: null,
      },
    ];

    const messageStatusList: Record<string, MessageStatus> = {
      "1": "sent",
      "2": "sent",
      "3": "failed",
    };

    const result = messagesToRecord(messages, messageStatusList);

    expect(result).toEqual({
      "1": {
        id: "1",
        text: "Hello!",
        userId: "user1",
        displayName: "John Doe",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-03T08:00:00Z",
        deletedAt: "",
        status: "sent",
      },
      "2": {
        id: "2",
        text: "Hi!",
        userId: "user2",
        displayName: "Jane Doe",
        createdAt: "2023-01-01T12:01:00Z",
        updatedAt: "2023-01-03T08:01:00Z",
        deletedAt: "",
        status: "sent",
      },
      "3": {
        id: "3",
        text: "I love you!",
        userId: "user1",
        displayName: "John Doe",
        createdAt: "2023-01-03T08:02:00Z",
        updatedAt: "2023-01-03T08:02:00Z",
        deletedAt: "",
        status: "failed",
      },
    });
  });

  it("handles an empty array gracefully", () => {
    const messages: Message[] = [];
    const messageStatusList: Record<string, MessageStatus> = {};
    const result = messagesToRecord(messages, messageStatusList);
    expect(result).toEqual({});
  });

  it("handles messages with deletedAt values correctly", () => {
    const messages = [
      {
        id: "2",
        text: "Hi there!",
        userId: "user2",
        displayName: "Jane Smith",
        createdAt: "2023-02-01T08:00:00Z",
        updatedAt: "2023-02-05T15:30:00Z",
        deletedAt: "2023-02-10T10:00:00Z",
      },
    ];

    const messageStatusList: Record<string, MessageStatus> = {
      "2": "sent",
    };

    const result = messagesToRecord(messages, messageStatusList);

    expect(result["2"].deletedAt).toBe("2023-02-10T10:00:00Z");
  });
});

describe("getLatestMessageId", () => {
  it("returns the latest message id for a user with non-deleted messages", () => {
    const userId = "user1";
    const messages: Record<string, Message> = {
      "1": {
        id: "1",
        userId: "user1",
        createdAt: "2023-01-01T12:00:00Z",
        updatedAt: "2023-01-01T12:00:00Z",
        deletedAt: "",
        displayName: "Jane Doe",
        status: "sent",
        text: "Hi!",
      },
      "2": {
        id: "2",
        userId: "user1",
        createdAt: "2023-01-02T08:00:00Z",
        updatedAt: "2023-01-02T08:00:00Z",
        deletedAt: "",
        displayName: "Jane Doe",
        status: "sent",
        text: "Hello?!?!",
      },
      "3": {
        id: "3",
        userId: "user1",
        createdAt: "2023-01-03T14:30:00Z",
        updatedAt: "2023-01-03T14:30:00Z",
        deletedAt: "",
        displayName: "Jane Doe",
        status: "failed",
        text: "Are you ghosting me?",
      },
    };

    const result = getLatestMessageId(userId, messages);

    expect(result).toBe("3");
  });

  it("returns null for a user with no messages", () => {
    const userId = "user2";
    const messages: Record<string, Message> = {};

    const result = getLatestMessageId(userId, messages);

    expect(result).toBeNull();
  });

  it("returns null for a user with only deleted messages", () => {
    const userId = "user3";
    const messages: Record<string, Message> = {
      "4": {
        id: "4",
        userId: "user3",
        createdAt: "2023-02-01T08:00:00Z",
        updatedAt: "2023-02-01T08:00:00Z",
        deletedAt: "2023-02-10T10:00:00Z",
        text: "Stai a fa sempre",
        displayName: "Pippo Franco",
        status: "sent",
      },
      "5": {
        id: "5",
        userId: "user3",
        createdAt: "2023-02-05T15:30:00Z",
        updatedAt: "2023-02-05T15:30:00Z",
        deletedAt: "2023-02-10T10:00:00Z",
        text: "scherzi stupidi",
        displayName: "Pippo Franco",
        status: "sent",
      },
    };

    const result = getLatestMessageId(userId, messages);

    expect(result).toBeNull();
  });
});

describe("getMessageStatus", () => {
  const messageStatusList: Record<string, MessageStatus> = {
    "1": "sent",
    "2": "failed",
    "3": "sent",
  };

  it('returns "sent" for a message with a "sent" status', () => {
    const messageId = "1";

    const result = getMessageStatus(messageId, messageStatusList);

    expect(result).toBe("sent");
  });

  it('returns "failed" for a message with a "failed" status', () => {
    const messageId = "2";

    const result = getMessageStatus(messageId, messageStatusList);

    expect(result).toBe("failed");
  });

  it('returns "failed" for a message with no status in the list', () => {
    const messageId = "3";
    const messageStatusList: Record<string, MessageStatus> = {};

    const result = getMessageStatus(messageId, messageStatusList);

    expect(result).toBe("failed");
  });

  it('returns "failed" for a message with a null status in the list', () => {
    const messageId = "4";

    const result = getMessageStatus(messageId, messageStatusList);

    expect(result).toBe("failed");
  });
});

describe("deleteIdFromList", () => {
  it("deletes the specified id from the list", () => {
    const idToDelete = "1";
    const messageStatusList: Record<string, MessageStatus> = {
      "1": "sent",
      "2": "failed",
      "3": "sent",
    };

    const result = deleteIdFromList(messageStatusList, idToDelete);

    expect(result).toEqual({
      "2": "failed",
      "3": "sent",
    });
  });

  it("returns the original list if the id to delete is not found", () => {
    const idToDelete = "4";
    const messageStatusList: Record<string, MessageStatus> = {
      "1": "sent",
      "2": "failed",
      "3": "sent",
    };

    const result = deleteIdFromList(messageStatusList, idToDelete);

    expect(result).toEqual(messageStatusList);
  });

  it("returns an empty object if the list becomes empty after deletion", () => {
    const idToDelete = "1";
    const messageStatusList: Record<string, MessageStatus> = {
      "1": "sent",
    };

    const result = deleteIdFromList(messageStatusList, idToDelete);

    expect(result).toEqual({});
  });

  it("does not modify the original list", () => {
    const idToDelete = "2";
    const messageStatusList: Record<string, MessageStatus> = {
      "1": "sent",
      "2": "failed",
      "3": "sent",
    };

    deleteIdFromList(messageStatusList, idToDelete);

    expect(messageStatusList).toEqual({
      "1": "sent",
      "2": "failed",
      "3": "sent",
    });
  });
});
