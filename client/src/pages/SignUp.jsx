import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signUp } from "../utills/apiHelper";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  TextField,
  Button,
  Stack,
  Alert,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";

export default function SignUp({ onNavigate }) {
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const signUpMut = useMutation(signUp, {
    onSuccess: (data) => {
      login(data.user, data.token);
      if (onNavigate) onNavigate("products");
    },
  });

  const onSubmit = (data) => {
    signUpMut.mutate(data);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h4" gutterBottom align="center">
            Sign Up
          </Typography>

          {signUpMut.isError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {signUpMut.error?.response?.data?.message || "An error occurred"}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Name"
                fullWidth
                {...register("name", { required: "Name is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={signUpMut.isLoading}
                size="large"
              >
                {signUpMut.isLoading ? "Signing Up..." : "Sign Up"}
              </Button>
              <Box textAlign="center">
                <Link
                  component="button"
                  type="button"
                  onClick={() => onNavigate && onNavigate("signin")}
                  variant="body2"
                >
                  Already have an account? Sign In
                </Link>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

