import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/categories");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createCategoryAction = createAsyncThunk(
  "categories/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/categories", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateCategoryAction = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/categories/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteCategoryAction = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/categories/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  categories: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCategoryAction.fulfilled, (state, action) => {
        state.categories.push(action.payload);
      })
      .addCase(updateCategoryAction.fulfilled, (state, action) => {
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(deleteCategoryAction.fulfilled, (state, action) => {
        state.categories = state.categories.filter((c) => c._id !== action.payload);
      });
  }
});

export default categorySlice.reducer;