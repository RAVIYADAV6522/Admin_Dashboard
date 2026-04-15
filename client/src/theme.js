/**
 * Aurora theme — neo-tech: electric cyan + violet on void black.
 * Not a generic “gold admin” template.
 */
export const tokensDark = {
  grey: {
    0: "#f8fafc",
    50: "#f1f5f9",
    100: "#e2e8f0",
    200: "#cbd5e1",
    300: "#94a3b8",
    400: "#64748b",
    500: "#475569",
    600: "#334155",
    700: "#1e293b",
    800: "#0f172a",
    900: "#020617",
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
  },
  violet: {
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
  },
};

const tokensLightGrey = {
  0: "#020617",
  50: "#0f172a",
  100: "#1e293b",
  200: "#334155",
  300: "#475569",
  400: "#64748b",
  500: "#94a3b8",
  600: "#cbd5e1",
  700: "#e2e8f0",
  800: "#f1f5f9",
  900: "#f8fafc",
};

const fontUi = '"Sora", system-ui, sans-serif';
const fontDisplay = '"Space Grotesk", "Sora", system-ui, sans-serif';

export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              ...tokensDark.cyan,
              main: tokensDark.cyan[400],
              light: tokensDark.cyan[300],
              dark: tokensDark.cyan[600],
            },
            secondary: {
              ...tokensDark.violet,
              main: tokensDark.violet[400],
              light: tokensDark.violet[300],
              dark: tokensDark.violet[600],
            },
            neutral: {
              ...tokensDark.grey,
              main: tokensDark.grey[400],
            },
            background: {
              default: "#020203",
              alt: "#0a0a10",
              paper: "#0e0e14",
            },
            text: {
              primary: "#f1f5f9",
              secondary: "#94a3b8",
              disabled: "#64748b",
            },
            divider: "rgba(148, 163, 184, 0.12)",
          }
        : {
            primary: {
              ...tokensDark.cyan,
              main: tokensDark.cyan[600],
              light: tokensDark.cyan[400],
              dark: tokensDark.cyan[700],
            },
            secondary: {
              ...tokensDark.violet,
              main: tokensDark.violet[600],
              light: tokensDark.violet[500],
            },
            neutral: {
              ...tokensLightGrey,
              main: tokensDark.grey[500],
            },
            background: {
              default: "#f8fafc",
              alt: "#f1f5f9",
              paper: "#ffffff",
            },
            text: {
              primary: tokensDark.grey[900],
              secondary: tokensDark.grey[600],
            },
            divider: "rgba(15, 23, 42, 0.08)",
          }),
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: fontUi,
      fontSize: 14,
      h1: {
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: "2.75rem",
        letterSpacing: "-0.04em",
        lineHeight: 1.05,
      },
      h2: {
        fontFamily: fontDisplay,
        fontWeight: 700,
        fontSize: "2rem",
        letterSpacing: "-0.03em",
        lineHeight: 1.15,
      },
      h3: {
        fontFamily: fontDisplay,
        fontWeight: 600,
        fontSize: "1.5rem",
        letterSpacing: "-0.02em",
      },
      h4: {
        fontFamily: fontDisplay,
        fontWeight: 600,
        fontSize: "1.2rem",
      },
      h5: {
        fontFamily: fontUi,
        fontWeight: 600,
        fontSize: "1rem",
      },
      h6: {
        fontFamily: fontUi,
        fontWeight: 600,
        fontSize: "0.875rem",
      },
      body1: { fontFamily: fontUi },
      body2: { fontFamily: fontUi },
      button: {
        fontFamily: fontUi,
        fontWeight: 600,
        letterSpacing: "0.06em",
      },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: `${tokensDark.cyan[700]} #020203`,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            borderRadius: 10,
            fontWeight: 600,
            boxShadow: "none",
            "&:hover": { boxShadow: "none" },
          },
          contained: {
            background: `linear-gradient(135deg, ${tokensDark.cyan[400]} 0%, ${tokensDark.violet[500]} 100%)`,
            color: "#020617",
            "&:hover": {
              background: `linear-gradient(135deg, ${tokensDark.cyan[300]} 0%, ${tokensDark.violet[400]} 100%)`,
            },
          },
          outlined: {
            borderColor: "rgba(34, 211, 238, 0.45)",
            color: tokensDark.cyan[200],
            "&:hover": {
              borderColor: tokensDark.cyan[400],
              backgroundColor: "rgba(34, 211, 238, 0.08)",
            },
          },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            border: "1px solid rgba(34, 211, 238, 0.12)",
            background:
              "linear-gradient(145deg, rgba(34,211,238,0.06) 0%, rgba(139,92,246,0.03) 50%, rgba(2,2,3,0.9) 100%)",
          },
        },
      },
      MuiPagination: {
        styleOverrides: {
          ul: { gap: 4 },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: { backgroundImage: "none" },
        },
      },
    },
  };
};
