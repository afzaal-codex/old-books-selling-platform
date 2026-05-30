import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const createOrderAction = createAsyncThunk(
  "orders/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/orders", orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders/my");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleOrder = createAsyncThunk(
  "orders/fetchSingleOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateOrderStatusAction = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/status`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const cancelOrderAction = createAsyncThunk(
  "orders/cancelOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/orders/${id}/cancel`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAdminStats = createAsyncThunk(
  "orders/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders/admin/stats");
      return response.data.stats;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  orders: [],
  myOrders: [],
  currentOrder: null,
  adminStats: null,
  loading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetOrderState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.currentOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAction.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentOrder = action.payload;
        state.myOrders.unshift(action.payload);
      })
      .addCase(createOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSingleOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchSingleOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatusAction.fulfilled, (state, action) => {
        const idx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) {
          state.orders[idx] = { ...state.orders[idx], ...action.payload };
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder = { ...state.currentOrder, ...action.payload };
        }
      })
      .addCase(cancelOrderAction.fulfilled, (state, action) => {
        const idx = state.myOrders.findIndex((o) => o._id === action.payload._id);
        if (idx !== -1) {
          state.myOrders[idx].orderStatus = "Cancelled";
        }
        const oIdx = state.orders.findIndex((o) => o._id === action.payload._id);
        if (oIdx !== -1) {
          state.orders[oIdx].orderStatus = "Cancelled";
        }
        if (state.currentOrder && state.currentOrder._id === action.payload._id) {
          state.currentOrder.orderStatus = "Cancelled";
        }
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.adminStats = action.payload;
      })
      .addCase("auth/logout", (state) => {
        state.myOrders = [];
        state.currentOrder = null;
        state.success = false;
        state.error = null;
      });
  }
});

export const { resetOrderState } = orderSlice.actions;
export default orderSlice.reducer;
