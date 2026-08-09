import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    custom: {
      navBackground: string;
      navTextColor: string;
    };
  }
  interface ThemeOptions {
    custom?: {
      navBackground: string;
      navTextColor: string;
    };
  }
}
