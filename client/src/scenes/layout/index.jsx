import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.global.userId);

  const { data } = useGetUserQuery(userId, { skip: !userId });

  return (
    <Box
      display={isNonMobile ? "flex" : "block"}
      width="100%"
      minHeight="100vh"
      position="relative"
      sx={(theme) => ({
        background:
          theme.palette.mode === "dark"
            ? `
              radial-gradient(ellipse 120% 80% at 85% -15%, rgba(34, 211, 238, 0.15), transparent 55%),
              radial-gradient(ellipse 90% 55% at -5% 45%, rgba(139, 92, 246, 0.13), transparent 48%),
              radial-gradient(ellipse 45% 35% at 50% 105%, rgba(6, 182, 212, 0.07), transparent 42%),
              linear-gradient(180deg, #020203 0%, #06060a 45%, #020203 100%)
            `
            : theme.palette.background.default,
        "&::before":
          theme.palette.mode === "dark"
            ? {
                content: '""',
                position: "fixed",
                inset: 0,
                pointerEvents: "none",
                opacity: 0.035,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='%2322d3ee' stroke-width='0.5'%3E%3Cpath d='M0 40h80M40 0v80'/%3E%3C/g%3E%3C/svg%3E")`,
                zIndex: 0,
              }
            : {},
      })}
    >
      <Box position="relative" zIndex={1} display={isNonMobile ? "flex" : "block"} width="100%" minHeight="100vh">
        <Sidebar
          user={data || {}}
          isNonMobile={isNonMobile}
          drawerWidth="272px"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Box flexGrow={1} overflow="hidden" minWidth={0}>
          <Navbar
            user={data || {}}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
