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
      // navBackground: "#ba8e22",
      navBackground: "#f7f6ee",
      // navTextColor: "#ede9cc",
      navTextColor: "#513a28",
      delete: "#d40032",
    },
  });
}
