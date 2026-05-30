import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchSettings = createAsyncThunk(
  "cms/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/cms");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateSettingsAction = createAsyncThunk(
  "cms/updateSettings",
  async (settingsData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put("/cms", settingsData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  settings: null,
  loading: false,
  error: null,
};

const cmsSlice = createSlice({
  name: "cms",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateSettingsAction.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSettingsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateSettingsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default cmsSlice.reducer;
