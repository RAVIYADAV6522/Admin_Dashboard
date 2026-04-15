import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  useTheme,
  Paper,
  Alert,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useLoginMutation, api } from "state/api";
import { setCredentials } from "state";
import FlexBetween from "components/FlexBetween";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      dispatch(api.util.resetApiState());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const msg =
        err?.data?.message ||
        err?.error ||
        (typeof err === "string" ? err : "Login failed");
      setError(msg);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ backgroundColor: theme.palette.background.default }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          backgroundColor: theme.palette.background.alt,
        }}
      >
        <FlexBetween sx={{ mb: 3 }}>
          <Typography variant="h4" fontWeight="bold" color={theme.palette.secondary[100]}>
            Sign in
          </Typography>
        </FlexBetween>
        <Typography variant="body2" sx={{ mb: 2, color: theme.palette.secondary[300] }}>
          Use your admin dashboard credentials. Register a new account if you do not have one.
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            autoComplete="current-password"
          />
          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{ mt: 3, py: 1.5 }}
            disabled={isLoading}
          >
            {isLoading ? "Signing in…" : "Sign in"}
          </Button>
        </Box>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: theme.palette.secondary[400] }}>
          Tip: set <code>AUTH_ENABLED=false</code> on the server and{" "}
          <code>VITE_REQUIRE_AUTH=false</code> on the client for local dev without login.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
