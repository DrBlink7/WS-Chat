import { FC, useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../Store";
import { selectUser, clearUserState, selectFakeUser } from "../Store/user";
import {
  clearThreadState,
  deleteAMessage,
  editAMessage,
  getActiveThreadInfo,
  selectActiveThread,
  selectMessageStatuses,
  selectMessages,
  selectThreads,
  sendAMessage,
} from "../Store/threads";
import {
  closeWebSocketConnection,
  createWebSocketConnection,
} from "../Store/ws";
import { getLatestMessageId } from "../Utils/f";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import LeftHeader from "../Components/LeftHeader";
import RightHeader from "../Components/RightHeader";
import * as ls from "../Utils/ls";
import * as obj from "../Utils/obj";

const Header: FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const fakeUser = useAppSelector(selectFakeUser);
  const threads = useAppSelector(selectThreads);
  const messages = useAppSelector(selectMessages);
  const activeThread = useAppSelector(selectActiveThread);
  const messageStatuses = useAppSelector(selectMessageStatuses);

  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const webSocketRef = useRef<WebSocket | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpenDrawer = useCallback(() => setOpenDrawer(true), []);

  const toggleDrawer = useCallback(
    (open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      return setOpenDrawer(open);
    },
    []
  );

  const closeDrawer = useCallback(() => {
    ls.set("archived", messageStatuses);
    setOpenDrawer(false);
    dispatch(clearUserState());
    dispatch(clearThreadState());
    ls.del("store");

    return window.location.reload();
  }, [dispatch, messageStatuses]);

  const fakeSend = useCallback(async () => {
    await dispatch(
      sendAMessage({
        ...fakeUser,
        userId: fakeUser.id,
        threadId: activeThread,
        checkSum: "sent",
        displayName: obj.get<Thread>(threads, activeThread).title,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      })
    );
    await dispatch(getActiveThreadInfo({ id: activeThread, userId: user.id }));

    return setAnchorEl(null);
  }, [dispatch, activeThread, user.id, fakeUser.id, fakeUser, threads]);

  const fakeDelete = useCallback(async () => {
    if (obj.size(messages) === 0) return;

    const messageToDelete = getLatestMessageId(fakeUser.id, messages);
    if (!messageToDelete) {
      console.warn("no message to delete");

      return;
    }

    await dispatch(
      deleteAMessage({ userId: fakeUser.id, id: messageToDelete })
    );

    await dispatch(getActiveThreadInfo({ id: activeThread, userId: user.id }));

    return setAnchorEl(null);
  }, [dispatch, activeThread, user.id, fakeUser.id, messages]);

  const fakeEdit = useCallback(async () => {
    if (obj.size(messages) === 0) return;

    const messageToEdit = getLatestMessageId(fakeUser.id, messages);
    if (!messageToEdit) {
      console.warn("no message to edit");

      return;
    }

    await dispatch(
      editAMessage({
        text: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae.",
        userId: fakeUser.id,
        id: messageToEdit,
      })
    );
    await dispatch(getActiveThreadInfo({ id: activeThread, userId: user.id }));

    return setAnchorEl(null);
  }, [dispatch, activeThread, user.id, fakeUser.id, messages]);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget);
    },
    [activeThread]
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, [activeThread]);

  useEffect(() => {
    const connectToWebSocket = async () => {
      if (fakeUser.id && activeThread) {
        if (webSocketRef.current) {
          closeWebSocketConnection(webSocketRef.current);
        }

        const newWebSocket = createWebSocketConnection(
          fakeUser.id,
          activeThread
        );
        webSocketRef.current = newWebSocket;
      }
    };

    connectToWebSocket();

    return () => {
      if (webSocketRef.current) {
        closeWebSocketConnection(webSocketRef.current);
      }
    };
  }, [fakeUser.id, activeThread]);

  return (
    <Stack
      component={Paper}
      display="flex"
      height="8%"
      width="100%"
      flexDirection="row"
    >
      <LeftHeader
        user={user}
        openDrawer={openDrawer}
        handleOpenDrawer={handleOpenDrawer}
        toggleDrawer={toggleDrawer}
        closeDrawer={closeDrawer}
      />
      <RightHeader
        isThreadSelected={
          Boolean(activeThread) && obj.has<Thread>(threads, activeThread)
        }
        threads={threads}
        activeThread={activeThread}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        fakeUser={fakeUser}
        handleClick={handleClick}
        handleClose={handleClose}
        fakeSend={fakeSend}
        fakeEdit={fakeEdit}
        fakeDelete={fakeDelete}
      />
    </Stack>
  );
};

export default Header;
