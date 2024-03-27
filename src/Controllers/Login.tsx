import { FC, useCallback, useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { DefaultTheme } from "@mui/system";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAppDispatch, useAppSelector } from "../Store";
import { useNavigate } from "react-router-dom";
import {
  selectUserInfoStatus,
  authenticateUser,
  clearUserStatus,
} from "../Store/user";
import {
  clearThreadState,
  getThreadList,
  selectThreadsInfoStatus,
} from "../Store/threads";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import BgImage from "../Components/BgImage";
import LoginForm from "../Components/Login";
import ErrorComponent from "../Components/Error";
import Loader from "../Components/Loader";
import * as yup from "yup";

type LoginProps = {
  theme: Partial<DefaultTheme> | ((outerTheme: DefaultTheme) => DefaultTheme);
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Insert a valid email")
    .required("Email is required"),
  displayName: yup
    .string()
    .trim()
    .max(12, "Display Name is max 12 charachters")
    .required("Display Name is required"),
});

const Login: FC<LoginProps> = ({ theme }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userInfoStatus = useAppSelector(selectUserInfoStatus);
  const threadsInfoStatus = useAppSelector(selectThreadsInfoStatus);

  const [error, setError] = useState<string>(""); // We can move this to redux store if you prefer

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      const res = await dispatch(
        authenticateUser({ email: data.email, displayName: data.displayName })
      );

      return await dispatch(
        getThreadList((res.payload as AuthenticatePayload).user.id)
      );
    } catch (e) {
      const error = `Error: ${e}`;
      return setError(error);
    }
  };

  const clearError = useCallback(() => {
    setError("");
    dispatch(clearUserStatus());
    dispatch(clearThreadState());

    return navigate("/login");
  }, [dispatch]);

  if (error) return <ErrorComponent msg={error} clearError={clearError} />;

  if (userInfoStatus === "error")
    return (
      <ErrorComponent msg={"Authentication error"} clearError={clearError} />
    );

  if (threadsInfoStatus === "error")
    return (
      <ErrorComponent
        msg={"Error while fetching the threads"}
        clearError={clearError}
      />
    );

  if (userInfoStatus === "loading" || threadsInfoStatus === "loading")
    return <Loader />;

  return (
    <ThemeProvider theme={theme}>
      <Stack display="flex" flexDirection="row" height="100%" width="100%">
        <CssBaseline />
        <BgImage width="70%" />
        <LoginForm
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          control={control}
          errors={errors}
        />
      </Stack>
    </ThemeProvider>
  );
};

export default Login;
