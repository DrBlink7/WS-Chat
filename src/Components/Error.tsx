import { FC } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import BlankLayout from "./BlankLayout";

type ErrorComponentProps = { msg?: string; clearError: () => void };

const ErrorComponent: FC<ErrorComponentProps> = ({
  msg = "Houston!",
  clearError,
}) => (
  <BlankLayout>
    <Box className="content-center">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            width: "90vw",
            "@media (min-width: 600px)": {
              width: "auto",
            },
          }}
        >
          <Typography variant="h1" sx={{ mb: 2.5 }}>
            {"Error:("}
          </Typography>
          <Typography
            variant="h5"
            sx={{ mb: 2.5, fontSize: "1.5rem !important" }}
          >
            {msg} 👨🏻‍💻
          </Typography>
          <Typography variant="body2">Oops, something went wrong!</Typography>
        </Box>
        <Button
          component="a"
          variant="contained"
          sx={{ px: 5.5 }}
          onClick={clearError}
        >
          Back to Home
        </Button>
      </Box>
    </Box>
  </BlankLayout>
);

export default ErrorComponent;
