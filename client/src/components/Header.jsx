import { Typography, Box, useTheme } from "@mui/material";
import React from "react";
import { BRAND } from "config/branding";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const cyan = theme.palette.primary.main;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        component="div"
        sx={{
          display: "inline-block",
          fontFamily: '"JetBrains Mono", ui-monospace, monospace',
          fontSize: "0.65rem",
          fontWeight: 600,
          letterSpacing: "0.35em",
          color: cyan,
          mb: 1.5,
          px: 1.25,
          py: 0.35,
          borderRadius: "6px",
          border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.4)" : "rgba(6, 182, 212, 0.4)"}`,
          background: isDark ? "rgba(34, 211, 238, 0.07)" : "rgba(6, 182, 212, 0.08)",
        }}
      >
        {BRAND.eyebrow}
      </Typography>
      <Typography
        variant="h2"
        sx={{
          fontFamily: '"Space Grotesk", sans-serif',
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: theme.palette.text.primary,
          mb: 1,
          lineHeight: 1.05,
          background: isDark
            ? "linear-gradient(92deg, #e0f2fe 0%, #22d3ee 35%, #a78bfa 90%)"
            : "none",
          WebkitBackgroundClip: isDark ? "text" : "unset",
          WebkitTextFillColor: isDark ? "transparent" : "unset",
          backgroundClip: isDark ? "text" : "unset",
        }}
      >
        {title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          fontWeight: 400,
          maxWidth: "40rem",
          lineHeight: 1.65,
          fontSize: "0.95rem",
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
