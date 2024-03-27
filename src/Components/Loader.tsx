import { FC } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import logo from "../Images/logo.png";

const Loader: FC = () => (
  <Stack
    display="flex"
    justifyContent="center"
    alignItems="center"
    height="100vh"
  >
    <Typography>Simple Chat</Typography>
    <img src={logo} />
    <CircularProgress />
    <Typography marginTop={2}>...Loading</Typography>
  </Stack>
);

export default Loader;
