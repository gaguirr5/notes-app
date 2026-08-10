"use client";

import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import DarkTheme from "@/styles/themes/darkTheme";
import LightTheme from "@/styles/themes/lightTheme";

interface ColorModeContextValue {
  toggleColorMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  toggleColorMode: () => {},
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("colorMode");
    if (stored === "light" || stored === "dark") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing initial mode from localStorage on mount, not a derived-state anti-pattern
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

  const theme = useMemo(() => {
    if (mode === "dark") return DarkTheme();
    return LightTheme();
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
