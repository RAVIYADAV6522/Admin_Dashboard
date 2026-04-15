import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { lazy, Suspense, useMemo } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { themeSettings } from "theme";
import Layout from "scenes/layout";
import { RequireAuth, LoginGate } from "components/RequireAuth";

const Login = lazy(() => import("scenes/login"));
const Dashboard = lazy(() => import("scenes/dashboard"));
const Products = lazy(() => import("scenes/products"));
const Customers = lazy(() => import("scenes/customers"));
const Transactions = lazy(() => import("scenes/transactions"));
const Geography = lazy(() => import("scenes/geography"));
const Overview = lazy(() => import("scenes/overview"));
const Daily = lazy(() => import("scenes/daily"));
const Monthly = lazy(() => import("scenes/monthly"));
const Breakdown = lazy(() => import("scenes/breakdown"));
const Admin = lazy(() => import("scenes/admin"));
const Performance = lazy(() => import("scenes/performance"));

function App() {
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<div />}>
            <Routes>
              <Route
                path="/login"
                element={
                  <LoginGate>
                    <Login />
                  </LoginGate>
                }
              />
              <Route element={<RequireAuth />}>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/transactions" element={<Transactions />} />
                  <Route path="/geography" element={<Geography />} />
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/breakdown" element={<Breakdown />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="/performance" element={<Performance />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
