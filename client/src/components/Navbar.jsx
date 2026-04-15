import React, { useState } from "react";
import {
  LightModeOutlined,
  DarkModeOutlined,
  Menu as MenuIcon,
  Search,
  SettingsOutlined,
  ArrowDropDownOutlined,
} from "@mui/icons-material";
import FlexBetween from "components/FlexBetween";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMode, logout } from "state";
import { api } from "state/api";
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  useTheme,
  Box,
} from "@mui/material";

const Navbar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const isDark = theme.palette.mode === "dark";

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  return (
    <AppBar
      elevation={0}
      sx={{
        position: "static",
        background: "transparent",
        borderBottom: `1px solid ${isDark ? "rgba(34, 211, 238, 0.1)" : "rgba(0,0,0,0.06)"}`,
        backdropFilter: "blur(12px)",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 1, minHeight: 72 }}>
        <FlexBetween gap={2}>
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{
              color: "text.secondary",
              border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: "12px",
            }}
          >
            <MenuIcon />
          </IconButton>
          <FlexBetween
            sx={{
              backgroundColor: isDark ? "rgba(34, 211, 238, 0.04)" : "rgba(0,0,0,0.04)",
              border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(0,0,0,0.06)"}`,
              borderRadius: "14px",
              px: 2,
              py: 0.5,
              minWidth: { xs: 200, sm: 320 },
              transition: "box-shadow 0.2s, border-color 0.2s",
              "&:focus-within": isDark
                ? {
                    boxShadow: "0 0 0 2px rgba(34, 211, 238, 0.25)",
                    borderColor: "rgba(34, 211, 238, 0.45)",
                  }
                : {},
            }}
          >
            <InputBase
              placeholder="Search catalog, people, orders…"
              sx={{
                flex: 1,
                color: "text.primary",
                fontSize: "0.9rem",
                "& input::placeholder": {
                  color: theme.palette.text.secondary,
                  opacity: 0.75,
                },
              }}
            />
            <IconButton size="small" sx={{ color: "primary.main" }}>
              <Search fontSize="small" />
            </IconButton>
          </FlexBetween>
        </FlexBetween>

        <FlexBetween gap={1}>
          <IconButton
            onClick={() => dispatch(setMode())}
            sx={{
              color: "text.secondary",
              border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: "12px",
            }}
          >
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlined sx={{ fontSize: 22 }} />
            ) : (
              <LightModeOutlined sx={{ fontSize: 22 }} />
            )}
          </IconButton>
          <IconButton
            sx={{
              color: "text.secondary",
              border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.2)" : "rgba(0,0,0,0.08)"}`,
              borderRadius: "12px",
            }}
          >
            <SettingsOutlined sx={{ fontSize: 22 }} />
          </IconButton>
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: 1.25,
                ml: 0.5,
                pl: 1,
                pr: 1.5,
                py: 0.75,
                borderRadius: "14px",
                border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.22)" : "rgba(0,0,0,0.08)"}`,
                background: isDark ? "rgba(34, 211, 238, 0.04)" : "rgba(0,0,0,0.02)",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  color: "#020617",
                  height: 36,
                  width: 36,
                  fontSize: "0.9rem",
                  fontWeight: 700,
                }}
              >
                {user.name ? user.name.charAt(0) : "U"}
              </Avatar>
              <Box textAlign="left" display={{ xs: "none", sm: "block" }}>
                <Typography fontWeight={600} fontSize="0.85rem" color="text.primary">
                  {user.name}
                </Typography>
                <Typography fontSize="0.72rem" color="text.secondary" noWrap maxWidth={140}>
                  {user.occupation}
                </Typography>
              </Box>
              <ArrowDropDownOutlined sx={{ color: "secondary.main", fontSize: 24, opacity: 0.95 }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              slotProps={{
                paper: {
                  sx: {
                    mt: 1,
                    borderRadius: "12px",
                    border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
                    boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                  },
                },
              }}
            >
              <MenuItem
                onClick={() => {
                  dispatch(logout());
                  dispatch(api.util.resetApiState());
                  handleClose();
                  navigate("/login");
                }}
              >
                Log out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
