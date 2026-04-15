import React from "react";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
  Avatar,
} from "@mui/material";
import {
  SettingsOutlined,
  ChevronLeft,
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  TodayOutlined,
  AdminPanelSettingsOutlined,
  TrendingUpOutlined,
  PieChartOutlined,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import { BRAND } from "config/branding";

const navItems = [
  { text: "Dashboard", icon: <HomeOutlined sx={{ fontSize: 22 }} /> },
  { text: "Client Facing", icon: null },
  { text: "Products", icon: <ShoppingCartOutlined sx={{ fontSize: 22 }} /> },
  { text: "Customers", icon: <Groups2Outlined sx={{ fontSize: 22 }} /> },
  { text: "Transactions", icon: <ReceiptLongOutlined sx={{ fontSize: 22 }} /> },
  { text: "Geography", icon: <PublicOutlined sx={{ fontSize: 22 }} /> },
  { text: "Sales", icon: null },
  { text: "Overview", icon: <PointOfSaleOutlined sx={{ fontSize: 22 }} /> },
  { text: "Daily", icon: <TodayOutlined sx={{ fontSize: 22 }} /> },
  { text: "Monthly", icon: <CalendarMonthOutlined sx={{ fontSize: 22 }} /> },
  { text: "Breakdown", icon: <PieChartOutlined sx={{ fontSize: 22 }} /> },
  { text: "Management", icon: null },
  { text: "Admin", icon: <AdminPanelSettingsOutlined sx={{ fontSize: 22 }} /> },
  { text: "Performance", icon: <TrendingUpOutlined sx={{ fontSize: 22 }} /> },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  const paperSx = {
    color: theme.palette.text.secondary,
    backgroundColor: isDark ? "rgba(6, 6, 12, 0.85)" : theme.palette.background.paper,
    backdropFilter: "blur(20px) saturate(1.2)",
    WebkitBackdropFilter: "blur(20px)",
    boxSizing: "border-box",
    borderWidth: isNonMobile ? 0 : "1px",
    borderRight: isNonMobile
      ? `1px solid ${isDark ? "rgba(34, 211, 238, 0.12)" : "rgba(0,0,0,0.06)"}`
      : undefined,
    width: drawerWidth,
    boxShadow: isDark ? "8px 0 48px rgba(0,0,0,0.55), inset -1px 0 0 rgba(34,211,238,0.06)" : "none",
  };

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": paperSx,
          }}
        >
          <Box width="100%" display="flex" flexDirection="column" height="100%">
            <Box px={2.5} pt={3} pb={2}>
              <FlexBetween>
                <Box display="flex" alignItems="center" gap={1.25}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "14px",
                      display: "grid",
                      placeItems: "center",
                      fontFamily: '"Space Grotesk", sans-serif',
                      fontWeight: 700,
                      fontSize: "1.15rem",
                      color: "#020617",
                      background: isDark
                        ? "linear-gradient(135deg, #22d3ee 0%, #06b6d4 40%, #8b5cf6 100%)"
                        : theme.palette.primary.main,
                      boxShadow: isDark
                        ? "0 0 24px rgba(34, 211, 238, 0.35), 0 0 48px rgba(139, 92, 246, 0.15)"
                        : "none",
                    }}
                  >
                    {BRAND.mark}
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: '"Space Grotesk", sans-serif',
                        fontWeight: 700,
                        letterSpacing: "-0.03em",
                        lineHeight: 1.1,
                        color: theme.palette.text.primary,
                      }}
                    >
                      {BRAND.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.85 }}>
                      {BRAND.tagline}
                    </Typography>
                  </Box>
                </Box>
                {!isNonMobile && (
                  <IconButton
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    size="small"
                    sx={{ color: "text.secondary" }}
                  >
                    <ChevronLeft />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>

            <List sx={{ px: 1.5, flex: 1, py: 0 }}>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    <Typography
                      key={text}
                      variant="overline"
                      sx={{
                        m: "1.25rem 0 0.5rem 1rem",
                        display: "block",
                        letterSpacing: "0.2em",
                        fontWeight: 700,
                        fontSize: "0.65rem",
                        color: "text.secondary",
                        opacity: 0.65,
                      }}
                    >
                      {text}
                    </Typography>
                  );
                }
                const lcText = text.toLowerCase();
                const selected = active === lcText;

                return (
                  <ListItem key={text} disablePadding sx={{ mb: 0.35 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        borderRadius: "12px",
                        py: 1.1,
                        mx: 0.5,
                        transition: "all 0.2s ease",
                        backgroundColor: selected
                          ? isDark
                            ? "rgba(34, 211, 238, 0.08)"
                            : "rgba(6, 182, 212, 0.08)"
                          : "transparent",
                        border: selected
                          ? `1px solid ${isDark ? "rgba(34, 211, 238, 0.35)" : "rgba(6, 182, 212, 0.25)"}`
                          : "1px solid transparent",
                        boxShadow: selected
                          ? isDark
                            ? "0 0 20px rgba(34, 211, 238, 0.12), inset 0 0 0 1px rgba(139,92,246,0.15)"
                            : "0 4px 16px rgba(0,0,0,0.06)"
                          : "none",
                        "&:hover": {
                          backgroundColor: isDark ? "rgba(34, 211, 238, 0.05)" : "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 44,
                          ml: 0.5,
                          color: selected
                            ? theme.palette.primary.main
                            : theme.palette.text.secondary,
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={text}
                        primaryTypographyProps={{
                          fontWeight: selected ? 600 : 500,
                          fontSize: "0.9rem",
                          color: selected ? "text.primary" : "text.secondary",
                        }}
                      />
                      {selected && (
                        <ChevronRightOutlined
                          sx={{ fontSize: 18, color: "primary.main", opacity: 0.85 }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>

            <Box mt="auto" pt={1}>
              <Divider sx={{ borderColor: "rgba(34, 211, 238, 0.1)" }} />
              <FlexBetween
                textTransform="none"
                gap="1rem"
                m="1rem 1.25rem 1.25rem"
                sx={{
                  p: 1.25,
                  borderRadius: "14px",
                  border: `1px solid ${isDark ? "rgba(34, 211, 238, 0.15)" : "rgba(0,0,0,0.06)"}`,
                  background: isDark ? "rgba(34, 211, 238, 0.04)" : "rgba(0,0,0,0.02)",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "primary.main",
                    color: "#020617",
                    height: 42,
                    width: 42,
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {user.name ? user.name.charAt(0) : "U"}
                </Avatar>
                <Box textAlign="left" flex={1} minWidth={0}>
                  <Typography fontWeight={600} fontSize="0.88rem" color="text.primary" noWrap>
                    {user.name}
                  </Typography>
                  <Typography fontSize="0.75rem" color="text.secondary" noWrap>
                    {user.occupation}
                  </Typography>
                </Box>
                <SettingsOutlined sx={{ color: "secondary.main", fontSize: 22, opacity: 0.9 }} />
              </FlexBetween>
            </Box>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
