"use client";

import { useRouter, usePathname } from "next/navigation";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { logout } from "@/lib/api/auth";

interface NavbarProps {
  isLoggedIn: boolean;
}

export default function Navbar({ isLoggedIn }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
    router.refresh();
  };
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Notes App</Typography>
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
      </Toolbar>
    </AppBar>
  );
}
