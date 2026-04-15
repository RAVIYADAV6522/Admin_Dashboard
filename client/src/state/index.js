import { createSlice } from "@reduxjs/toolkit";

function loadAuth() {
  try {
    const raw = localStorage.getItem("auth");
    if (!raw) return {};
    const p = JSON.parse(raw);
    return {
      token: p.token ?? null,
      userId: p.userId ?? null,
    };
  } catch {
    return {};
  }
}

const requireAuthClient = import.meta.env.VITE_REQUIRE_AUTH !== "false";
const devUserId = import.meta.env.VITE_DEFAULT_USER_ID || "";

const initialState = {
  mode: "dark",
  userId: !requireAuthClient && devUserId ? devUserId : null,
  token: null,
  ...loadAuth(),
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.userId = user?._id ?? user?.id ?? null;
      localStorage.setItem(
        "auth",
        JSON.stringify({ token: state.token, userId: state.userId })
      );
    },
    logout: (state) => {
      state.token = null;
      state.userId = null;
      localStorage.removeItem("auth");
    },
  },
});

export const { setMode, setCredentials, logout } = globalSlice.actions;

export default globalSlice.reducer;
