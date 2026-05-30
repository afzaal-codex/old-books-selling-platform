import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/wishlist");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const toggleWishlistItem = createAsyncThunk(
  "wishlist/toggleWishlistItem",
  async ({ bookId, inWishlist }, { rejectWithValue }) => {
    try {
      if (inWishlist) {
        await axiosInstance.delete(`/wishlist/${bookId}`);
        return { bookId, action: "removed" };
      } else {
        await axiosInstance.post("/wishlist", { bookId });
        return { bookId, action: "added" };
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  wishlist: null,
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => {
        if (state.wishlist) {
          if (action.payload.action === "removed") {
            state.wishlist.books = state.wishlist.books.filter(
              (book) => book._id !== action.payload.bookId
            );
          } else {
            // Re-fetch since we need populated book details
            // We'll let the component dispatch fetchWishlist after addition
          }
        }
      })
      .addCase("auth/logout", (state) => {
        state.wishlist = null;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
