import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";

import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import axiosInstance from "../../utils/axiosInstance";

import BookTable from "../../components/books/BookTable";

import AdminBookStats from "../../components/books/AdminBookStats";

import AdminBookSearch from "../../components/books/AdminBookSearch";

import AdminBookFilters from "../../components/books/AdminBookFilters";

import AdminBookDetailsModal from "./AdminBookDetailsModal";

const AdminBooks = ({ mode }) => {

  const [books, setBooks] =
    useState([]);

  const [filteredBooks,
    setFilteredBooks] =
    useState([]);

  const [categories,
    setCategories] =
    useState([]);

  const [authors,
    setAuthors] =
    useState([]);

  const [search,
    setSearch] =
    useState("");

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    selectedAuthor,
    setSelectedAuthor,
  ] = useState("");

  const [stockFilter,
    setStockFilter] =
    useState("");

  const [loading,
    setLoading] =
    useState(true);

  const [error,
    setError] =
    useState(null);

  const [
    selectedBook,
    setSelectedBook,
  ] = useState(null);

  /* FETCH */

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const [
            booksRes,
            categoriesRes,
            authorsRes,
          ] = await Promise.all([
            axiosInstance.get(
              "/books/admin/analytics"
            ),

            axiosInstance.get(
              "/categories"
            ),

            axiosInstance.get(
              "/authors"
            ),
          ]);

          const booksData = Array.isArray(booksRes?.data) 
            ? booksRes.data 
            : (booksRes?.data?.books || []);

          const categoriesData = Array.isArray(categoriesRes?.data) 
            ? categoriesRes.data 
            : (categoriesRes?.data?.categories || []);

          const authorsData = Array.isArray(authorsRes?.data) 
            ? authorsRes.data 
            : (authorsRes?.data?.authors || []);

          setBooks(booksData);
          setFilteredBooks(booksData);
          setCategories(categoriesData);
          setAuthors(authorsData);

        } catch (error) {

          toast.error(
            "Failed to fetch books"
          );
          setError(error?.response?.data?.message || "Failed to load books");

        } finally {

          setLoading(false);
        }
      };

    fetchData();

  }, []);

  /* FILTERS */

  useEffect(() => {

    let tempBooks = Array.isArray(books) ? [...books].filter(b => b && b._id) : [];

    /* MODE FILTER */
    if (mode === "offersThisWeek") {
      tempBooks = tempBooks.filter((book) => book.offersThisWeek);
    }

    /* SEARCH */

    if (search) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.title
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              )
        );
    }

    /* CATEGORY */

    if (selectedCategory) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.category?.name ===
            selectedCategory
        );
    }

    /* AUTHOR */

    if (selectedAuthor) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.author?.name ===
            selectedAuthor
        );
    }

    /* STOCK */

    if (
      stockFilter ===
      "instock"
    ) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.stock > 0
        );
    }

    if (
      stockFilter ===
      "outofstock"
    ) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.stock === 0
        );
    }

    if (
      stockFilter ===
      "lowstock"
    ) {

      tempBooks =
        tempBooks.filter(
          (book) =>
            book.stock <= 5
        );
    }

    setFilteredBooks(
      tempBooks
    );

  }, [
    books,
    search,
    selectedCategory,
    selectedAuthor,
    stockFilter,
  ]);

  /* DELETE */

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this book?"
        );

      if (!confirmDelete) {
        return;
      }

      try {

        await axiosInstance.delete(
          `/books/${id}`
        );

        toast.success(
          "Book deleted"
        );

        setBooks((prev) =>
          prev.filter(
            (book) =>
              book._id !== id
          )
        );

      } catch (error) {

        toast.error(
          "Delete failed"
        );
      }
    };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 size={36} className="animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 text-center">
        <p className="text-red-400 font-semibold">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-black cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* TOP */}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            {mode === "offersThisWeek" ? "Offers This Week Management" : "Books Management"}
          </h1>

          <p className="mt-2 text-gray-500">
            {mode === "offersThisWeek" ? "Manage weekly promotional offers" : "Manage inventory and analytics"}
          </p>
        </div>

        <Link
          to="/admin/add-book"
          className="rounded-2xl bg-[var(--color-primary)] px-6 py-4 font-semibold text-white"
        >
          Add New Book
        </Link>
      </div>

      {/* STATS */}

      <AdminBookStats
        books={filteredBooks}
      />

      {/* SEARCH */}

      <AdminBookSearch
        search={search}
        setSearch={setSearch}
      />

      {/* FILTERS */}

      <AdminBookFilters
        categories={categories}
        authors={authors}
        selectedCategory={
          selectedCategory
        }
        setSelectedCategory={
          setSelectedCategory
        }
        selectedAuthor={
          selectedAuthor
        }
        setSelectedAuthor={
          setSelectedAuthor
        }
        stockFilter={
          stockFilter
        }
        setStockFilter={
          setStockFilter
        }
      />

      {/* TABLE */}

      <BookTable
        books={filteredBooks}
        handleDelete={
          handleDelete
        }
        setSelectedBook={
          setSelectedBook
        }
      />

      {/* MODAL */}

      <AdminBookDetailsModal
        book={selectedBook}
        setSelectedBook={
          setSelectedBook
        }
      />
    </div>
  );
};

export default AdminBooks;