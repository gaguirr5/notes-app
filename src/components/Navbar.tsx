"use client";

import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import { logout } from "@/lib/api/auth";
import { useColorMode } from "@/components/ThemeRegistry";
import { Box } from "@mui/material";
import Image from "next/image";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { toggleColorMode } = useColorMode();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: theme.custom.navBackground }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Image src="/logo.png" alt="Wall Notes logo" width={32} height={32} />
          <Typography variant="h6" sx={{ color: theme.custom.navTextColor }}>
            My Wall
          </Typography>
        </Box>
        <div>
          <IconButton onClick={toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Log Out
            </Button>
          ) : (
            <Button
              color="inherit"
              onClick={() =>
                router.push(pathname === "/login" ? "/signup" : "/login")
              }
            >
              {pathname === "/login" ? "Sign Up" : "Log In"}
            </Button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}
