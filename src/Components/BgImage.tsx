import { FC } from "react";
import Stack from "@mui/material/Stack";

type BgImageProps = WithChildren & {
  width: string;
};

const BgImage: FC<BgImageProps> = ({ width, children }) => (
  <Stack
    width={width}
    sx={{
      backgroundImage: "url(https://source.unsplash.com/random?wallpapers)",
      backgroundRepeat: "no-repeat",
      backgroundColor: (t) =>
        t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100%",
    }}
  >
    {children}
  </Stack>
);

export default BgImage;
