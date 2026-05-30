import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchAuthors = createAsyncThunk(
  "authors/fetchAuthors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/authors");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createAuthorAction = createAsyncThunk(
  "authors/createAuthor",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/authors", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateAuthorAction = createAsyncThunk(
  "authors/updateAuthor",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/authors/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteAuthorAction = createAsyncThunk(
  "authors/deleteAuthor",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/authors/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  authors: [],
  loading: false,
  error: null,
};

const authorSlice = createSlice({
  name: "authors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAuthors.fulfilled, (state, action) => {
        state.loading = false;
        state.authors = action.payload;
      })
      .addCase(fetchAuthors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAuthorAction.fulfilled, (state, action) => {
        state.authors.push(action.payload);
      })
      .addCase(updateAuthorAction.fulfilled, (state, action) => {
        const index = state.authors.findIndex((a) => a._id === action.payload._id);
        if (index !== -1) {
          state.authors[index] = action.payload;
        }
      })
      .addCase(deleteAuthorAction.fulfilled, (state, action) => {
        state.authors = state.authors.filter((a) => a._id !== action.payload);
      });
  }
});

export default authorSlice.reducer;