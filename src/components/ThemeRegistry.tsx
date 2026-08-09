"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ColorModeContextValue {
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

const baseThemeOptions = {
  primary: {
    main: "#cd9357",
  },
};

const navBackgroundByMode = {
  light: "#cd9357",
  dark: "#1976d2",
};

const navTextColorByMode = {
  light: "#ede9cc",
  dark: "#f5f5f5",
};

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("colorMode");
    if (stored === "light" || stored === "dark") {
      setMode(stored);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setMode(prefersDark ? "dark" : "light");
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          localStorage.setItem("colorMode", next);
          return next;
        });
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: "#cd9357",
          },
        },
        custom: {
          navBackground: navBackgroundByMode[mode],
          navTextColor: navTextColorByMode[mode],
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
