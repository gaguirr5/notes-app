import { createTheme } from "@mui/material";
import baseThemeOptions from "./baseThemeOptions";

export default function LightTheme() {
  return createTheme({
    ...baseThemeOptions,
    palette: {
      ...baseThemeOptions.palette,
      mode: "light",
    },
    custom: {
      navBackground: "#ba8e22",
      navTextColor: "#ede9cc",
    },
  });
}
