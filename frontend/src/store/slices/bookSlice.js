import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/books", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchSingleBook = createAsyncThunk(
  "books/fetchSingleBook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchAdminBooksAnalytics = createAsyncThunk(
  "books/fetchAdminBooksAnalytics",
  async (range = "all", { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/books/admin/analytics", { params: { range } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createBookAction = createAsyncThunk(
  "books/createBook",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/books", formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateBookAction = createAsyncThunk(
  "books/updateBook",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/books/${id}`, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteBookAction = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/books/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  books: [],
  singleBook: null,
  analyticsBooks: [],
  loading: false,
  error: null,
};

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearSingleBook: (state) => {
      state.singleBook = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSingleBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSingleBook.fulfilled, (state, action) => {
        state.loading = false;
        state.singleBook = action.payload;
      })
      .addCase(fetchSingleBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAdminBooksAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminBooksAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analyticsBooks = action.payload;
      })
      .addCase(fetchAdminBooksAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBookAction.fulfilled, (state, action) => {
        state.books = state.books.filter((b) => b._id !== action.payload);
        state.analyticsBooks = state.analyticsBooks.filter((b) => b._id !== action.payload);
      });
  }
});

export const { clearSingleBook } = bookSlice.actions;
export default bookSlice.reducer;
