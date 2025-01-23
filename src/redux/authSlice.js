import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") || null : null,
  email: null,
  name: null,
  role: null,
};

export const adminAuthSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setLogin: (state, { payload }) => {
      console.log("payload", payload);
      state.token = payload.token;
      state.email = payload.email;
      state.role = payload.role;
      state.name = payload.name;
    },
    setLogout: (state) => {
      state.token = null;
      state.email = null;
      state.role = null;
    },
  },
});

export const { setLogin, setLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
