import { FC } from "react";
import Box from "@mui/material/Box";

const BlankLayout: FC<WithChildren> = ({ children }) => (
  <Box
    className="layout-wrapper"
    sx={{
      height: "100vh",
      "& .content-center": {
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
      },
      "& .content-right": {
        display: "flex",
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
      },
    }}
  >
    <Box
      className="app-content"
      sx={{ minHeight: "100vh", overflowX: "hidden", position: "relative" }}
    >
      {children}
    </Box>
  </Box>
);

export default BlankLayout;
