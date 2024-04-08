import { FC } from "react";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";

const Copyright: FC = () => (
  <Stack display="flex" flexDirection="row" justifyContent="center">
    <Typography variant="body2" color="text.secondary">
      Copyright ©
    </Typography>
    <Link
      variant="body2"
      color="text.secondary"
      href="Chat Example"
      margin="0 1.3vh 0 1.3vh"
    >
      Simple Chat
    </Link>
    <Typography variant="body2" color="text.secondary">
      {new Date().getFullYear()}.
    </Typography>
  </Stack>
);

export default Copyright;
