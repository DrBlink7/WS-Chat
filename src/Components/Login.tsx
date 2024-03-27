import { FC } from "react";
import {
  UseFormHandleSubmit,
  Control,
  FieldErrors,
  SubmitHandler,
  Controller,
} from "react-hook-form";
import Copyright from "./Copyright";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Login: FC<{
  handleSubmit: UseFormHandleSubmit<LoginFormInputs>;
  control: Control<LoginFormInputs>;
  errors: FieldErrors<LoginFormInputs>;
  onSubmit: SubmitHandler<LoginFormInputs>;
}> = ({ handleSubmit, control, errors, onSubmit }) => (
  <Stack component={Paper} width="30%">
    <Stack
      display="flex"
      flexDirection="column"
      alignItems="center"
      height="100%"
      justifyContent="center"
      padding="0 2vh"
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign in
      </Typography>
      <Box marginTop={1}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="outlined"
                margin="normal"
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                autoComplete="email"
                autoFocus
              />
            )}
          />
          <Controller
            name="displayName"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                label="Display Name"
                variant="outlined"
                margin="normal"
                fullWidth
                error={Boolean(errors.displayName)}
                helperText={errors.displayName?.message}
                autoFocus
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Copyright />
        </form>
      </Box>
    </Stack>
  </Stack>
);

export default Login;
