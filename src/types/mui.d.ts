import "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    base: {
      corkBoard: string;
    };
    custom: {
      navBackground: string;
      navTextColor: string;
    };
  }
  interface ThemeOptions {
    base?: {
      corkBoard: string;
    };
    custom?: {
      navBackground: string;
      navTextColor: string;
    };
  }
}
