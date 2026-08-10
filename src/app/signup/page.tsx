"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { signup } from "@/lib/api/auth";
import { SignUpFormValues } from "@/types/AuthFormValues";
import { isValidEmail } from "@/lib/strings";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>();

  const onSubmit = async (newUser: SignUpFormValues) => {
    setError("");
    try {
      await signup(newUser);
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: { xs: 4, sm: 8 },
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4">Sign Up</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Display Name"
        {...register("displayName")}
        error={!!errors.displayName}
        helperText={errors.displayName?.message}
      />
      <TextField
        label="*Email"
        type="email"
        {...register("email", {
          required: "Email is required",
          validate: (value) =>
            isValidEmail(value) || "Enter a valid email address",
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />
      <TextField
        label="*Password"
        type="password"
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button type="submit" variant="contained" disabled={isSubmitting}>
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
    </Box>
  );
}
