import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/notifications");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markNotificationRead",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/notifications/${id}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter((n) => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        const idx = state.notifications.findIndex((n) => n._id === action.payload._id);
        if (idx !== -1) {
          state.notifications[idx].read = true;
        }
        state.unreadCount = Math.max(state.unreadCount - 1, 0);
      });
  }
});

export const { clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
