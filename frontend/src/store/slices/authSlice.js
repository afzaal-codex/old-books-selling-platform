import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

// Async thunks
export const fetchUsers = createAsyncThunk("auth/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

export const toggleBlockUser = createAsyncThunk("auth/toggleBlockUser", async ({ id, block }, { rejectWithValue }) => {
  try {
    const endpoint = block ? `/users/${id}/block` : `/users/${id}/unblock`;
    const response = await axiosInstance.put(endpoint);
    return { id, isBlocked: block, message: response.data.message };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || error.message);
  }
});

const tokenVal = localStorage.getItem("token");
const token = (tokenVal && tokenVal !== "null" && tokenVal !== "undefined") ? tokenVal : null;
const userStr = localStorage.getItem("user");
const user = (userStr && userStr !== "null" && userStr !== "undefined") ? JSON.parse(userStr) : null;
const isAdmin = localStorage.getItem("isAdmin") === "true";

const initialState = {
  token,
  user,
  isAdmin,
  isAuthenticated: !!token,
  users: [],
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAdmin = action.payload.isAdmin;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("isAdmin", action.payload.isAdmin);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAdmin = false;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUserProfile: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleBlockUser.fulfilled, (state, action) => {
        const u = state.users.find((user) => user._id === action.payload.id);
        if (u) {
          u.isBlocked = action.payload.isBlocked;
        }
      });
  }
});

export const { setAuth, logout, clearError, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
