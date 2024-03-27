import { setMessageStatuses } from "./threads";
import store from "../Store";

export const createWebSocketConnection = (userId: string, threadId: string) => {
  const socket = new WebSocket(
    "ws://confi-codin-1xbkniq7crrwz-645813469.us-west-2.elb.amazonaws.com/ws"
  );

  const subscriptionRequest = {
    type: "THREAD_SUBSCRIPTION",
    payload: {
      authorization: userId,
      threadId: threadId,
    },
  };

  socket.addEventListener("open", (event) => {
    console.info("WebSocket connection opened:", event);
    socket.send(JSON.stringify(subscriptionRequest));
  });

  socket.addEventListener("message", (event) => {
    const messageFromServer = JSON.parse(event.data) as SocketSend<
      keyof SocketSendPayloads
    >;

    switch (messageFromServer.type) {
      case "THREAD_SUBSCRIPTION":
        const { threadId } =
          messageFromServer.payload as SocketSendPayloads["THREAD_SUBSCRIPTION"];
        console.info(`subscribed on ${threadId}`);
        break;

      case "MESSAGE_CREATED":
        const { message } =
          messageFromServer.payload as SocketSendPayloads["MESSAGE_CREATED"];
        const body = { id: message.id, status: message.checkSum };
        console.info(`message sent ${message.text}`);
        store.dispatch(setMessageStatuses(body));
        break;

      default:
        console.warn("Tipo di messaggio non gestito:", messageFromServer.type);
    }
  });

  socket.addEventListener("close", (event) => {
    console.info("WebSocket connection closed:", event);
  });

  return socket;
};

export const closeWebSocketConnection = (socket: WebSocket) => socket.close();
