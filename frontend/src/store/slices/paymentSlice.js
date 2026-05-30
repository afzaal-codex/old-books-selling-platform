import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const submitPayment = createAsyncThunk(
  "payments/submitPayment",
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/payments", paymentData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchPayments = createAsyncThunk(
  "payments/fetchPayments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/payments");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const verifyPaymentAction = createAsyncThunk(
  "payments/verifyPayment",
  async ({ id, verificationStatus, adminNotes }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/payments/${id}`, { verificationStatus, adminNotes });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  payments: [],
  loading: false,
  error: null,
  success: false,
};

const paymentSlice = createSlice({
  name: "payments",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitPayment.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyPaymentAction.fulfilled, (state, action) => {
        const idx = state.payments.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) {
          state.payments[idx] = { ...state.payments[idx], ...action.payload };
        }
      });
  }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
