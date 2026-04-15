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
import { useLoginMutation, useRegisterMutation, api } from "state/api";
import { setCredentials } from "state";
import FlexBetween from "components/FlexBetween";
import { getApiErrorMessage } from "utils/apiError";
import { BRAND } from "config/branding";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading: loginLoading }] = useLoginMutation();
  const [register, { isLoading: registerLoading }] = useRegisterMutation();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isLoading = loginLoading || registerLoading;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res =
        mode === "register"
          ? await register({ name, email, password }).unwrap()
          : await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      dispatch(api.util.resetApiState());
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const fallback =
        mode === "register" ? "Registration failed." : "Sign in failed.";
      setError(getApiErrorMessage(err, fallback));
    }
  };

  const isDark = theme.palette.mode === "dark";

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={2}
      sx={{
        background: isDark
          ? "radial-gradient(ellipse 90% 60% at 70% -15%, rgba(34, 211, 238, 0.14), transparent), radial-gradient(ellipse 70% 50% at -10% 50%, rgba(139, 92, 246, 0.12), transparent), linear-gradient(180deg, #020203 0%, #06060a 100%)"
          : theme.palette.background.default,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 4,
          maxWidth: 420,
          width: "100%",
          borderRadius: "20px",
          border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(0,0,0,0.08)"}`,
          background: isDark
            ? "linear-gradient(165deg, rgba(34,211,238,0.07) 0%, rgba(14,14,20,0.96) 55%)"
            : theme.palette.background.paper,
          boxShadow: isDark ? "0 24px 64px rgba(0,0,0,0.55), 0 0 80px rgba(34,211,238,0.06)" : "0 16px 48px rgba(0,0,0,0.08)",
        }}
      >
        <FlexBetween sx={{ mb: 1 }}>
          <Typography
            variant="overline"
            sx={{
              letterSpacing: "0.25em",
              fontWeight: 700,
              color: "primary.main",
              fontFamily: '"JetBrains Mono", monospace',
            }}
          >
            {BRAND.eyebrow}
          </Typography>
        </FlexBetween>
        <FlexBetween sx={{ mb: 2 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "text.primary",
            }}
          >
            {mode === "login" ? "Sign in" : "Create account"}
          </Typography>
        </FlexBetween>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {mode === "login"
            ? "Sign in with the email and password you used at registration."
            : "Choose a display name, email, and password (at least 6 characters)."}
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          {mode === "register" && (
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              margin="normal"
              required
              autoComplete="name"
            />
          )}
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
            {isLoading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Sign in"
                : "Create account"}
          </Button>
        </Box>
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          {mode === "login" ? (
            <>
              No account?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setMode("register");
                  setError("");
                }}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => {
                  setMode("login");
                  setError("");
                }}
              >
                Sign in
              </Link>
            </>
          )}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 2, color: "text.secondary" }}>
          Tip: set <code>AUTH_ENABLED=false</code> on the server and{" "}
          <code>VITE_REQUIRE_AUTH=false</code> on the client for local dev without login.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
