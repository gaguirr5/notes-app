import { createTheme } from "@mui/material";
import baseThemeOptions from "./baseThemeOptions";

export default function DarkTheme() {
  return createTheme({
    ...baseThemeOptions,

    palette: {
      ...baseThemeOptions.palette,
      mode: "dark",
    },

    custom: {
      navBackground: "#1976d2",
      navTextColor: "#f5f5f5",
      delete: "#8b0101",
    },
  });
}
