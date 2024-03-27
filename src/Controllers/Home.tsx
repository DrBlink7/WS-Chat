import { FC, useCallback, useEffect, useState } from "react";
import { DefaultTheme } from "@mui/system";
import { ThemeProvider } from "@mui/material/styles";
import { useAppDispatch, useAppSelector } from "../Store";
import { selectUserInfoStatus, clearUserStatus } from "../Store/user";
import {
  clearThreadStatus,
  selectMessageStatuses,
  selectThreadsInfoStatus,
} from "../Store/threads";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Paper from "@mui/material/Paper";
import Header from "./Header";
import Chat from "./Chat";
import Threads from "./Threads";
import Loader from "../Components/Loader";
import ErrorComponent from "../Components/Error";
import * as ls from "../Utils/ls";
import * as obj from "../Utils/obj";
import "react-perfect-scrollbar/dist/css/styles.css";

type HomeProps = {
  theme: Partial<DefaultTheme> | ((outerTheme: DefaultTheme) => DefaultTheme);
};

const Home: FC<HomeProps> = ({ theme }) => {
  const dispatch = useAppDispatch();
  const userInfoStatus = useAppSelector(selectUserInfoStatus);
  const threadsInfoStatus = useAppSelector(selectThreadsInfoStatus);
  const messageStatuses = useAppSelector(selectMessageStatuses);

  const [error, setError] = useState<string>(""); // We can move this to redux store if you prefer

  const clearError = useCallback(() => {
    setError("");
    dispatch(clearUserStatus());

    return dispatch(clearThreadStatus());
  }, [dispatch]);

  const setErrorMessage = useCallback((error: string) => setError(error), []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (obj.size(messageStatuses) > 0) ls.set("archived", messageStatuses);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [messageStatuses]);

  if (error) return <ErrorComponent msg={error} clearError={clearError} />;

  if (userInfoStatus === "error")
    return (
      <ErrorComponent msg={"Authentication error"} clearError={clearError} />
    );

  if (threadsInfoStatus === "error")
    return (
      <ErrorComponent
        msg={"Error while fetching the thread"}
        clearError={clearError}
      />
    );

  if (userInfoStatus === "loading" || threadsInfoStatus === "loading")
    return <Loader />;

  return (
    <ThemeProvider theme={theme}>
      <Stack display="flex" flexDirection="column" height="100%" width="100%">
        <CssBaseline />
        <Header />
        <Stack
          component={Paper}
          display="flex"
          height="92%"
          width="100%"
          maxHeight="92vh"
          flexDirection="row"
        >
          <Threads />
          <Chat setErrorMessage={setErrorMessage} />
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
