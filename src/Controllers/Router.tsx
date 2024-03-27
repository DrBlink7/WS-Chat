import { FC } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppSelector } from "../Store";
import { selectIsUserLogged } from "../Store/user";
import { createTheme } from "@mui/material/styles";
import Home from "./Home";
import Login from "./Login";

type AppRouterTypes = {};

const Router: FC<AppRouterTypes> = () => {
  const isUserLoggedIn = useAppSelector(selectIsUserLogged);
  const defaultTheme = createTheme();

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isUserLoggedIn ? <Navigate to="/" /> : <Login theme={defaultTheme} />
        }
      />
      <Route
        path="/"
        element={
          isUserLoggedIn ? (
            <Home theme={defaultTheme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default Router;
