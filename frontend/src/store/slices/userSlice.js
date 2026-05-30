import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAllUsers = createAsyncThunk(
  "users/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const blockUserAction = createAsyncThunk(
  "users/blockUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${id}/block`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const unblockUserAction = createAsyncThunk(
  "users/unblockUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/users/${id}/unblock`);
      return { id, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  users: [],
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(blockUserAction.fulfilled, (state, action) => {
        const u = state.users.find((user) => user._id === action.payload.id);
        if (u) {
          u.isBlocked = true;
        }
      })
      .addCase(unblockUserAction.fulfilled, (state, action) => {
        const u = state.users.find((user) => user._id === action.payload.id);
        if (u) {
          u.isBlocked = false;
        }
      });
  }
});

export default userSlice.reducer;
