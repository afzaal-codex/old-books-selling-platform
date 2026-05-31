import {
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

const AdminAddBook = () => {

  const navigate =
    useNavigate();

  /* STATES */

  const [loading,
    setLoading] =
    useState(false);

  const [categories,
    setCategories] =
    useState([]);

  const [authors,
    setAuthors] =
    useState([]);

  const [images,
    setImages] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      title: "",

      slug: "",

      author: "",

      category: "",

      description: "",

      originalPrice: "",

      discountedPrice: "",

      stock: "",

      condition: "Used",

      featured: false,
      bestseller: false,
      trending: false,
      newRelease: false,
      offersThisWeek: false,
      offersThisWeekExpiry: "",
      highDiscount: false,
      discountExpiresAt: "",

      bindingType: "Paperback",

      totalPages: "",

      publisher: "",

      isbn: "",

      publicationYear: "",
    });

  /* FETCH */

  useEffect(() => {

    const fetchData =
      async () => {

        try {

          const [
            categoriesRes,
            authorsRes,
          ] = await Promise.all([
            axiosInstance.get(
              "/categories"
            ),

            axiosInstance.get(
              "/authors"
            ),
          ]);

          setCategories(
            categoriesRes.data
          );

          setAuthors(
            authorsRes.data
          );

        } catch (error) {

          toast.error(
            "Failed to load form data"
          );
        }
      };

    fetchData();

  }, []);

  /* CHANGE */

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setFormData((prev) => ({
        ...prev,

        [name]:
          type === "checkbox"
            ? checked
            : value,
      }));
    };

  /* IMAGE */

  const handleImages =
    (e) => {

      setImages(
        Array.from(
          e.target.files
        )
      );
    };

  /* SUBMIT */

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const submitData =
          new FormData();

        Object.keys(
          formData
        ).forEach((key) => {

          submitData.append(
            key,
            formData[key]
          );
        });

        images.forEach(
          (image) => {

            submitData.append(
              "images",
              image
            );
          }
        );

        await axiosInstance.post(
          "/books",
          submitData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Book added successfully"
        );

        navigate(
          "/admin/books"
        );

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to add book"
        );

      } finally {

        setLoading(false);
      }
    };

  return (
    <div className="space-y-8">
      {/* TOP */}

      <div>
        <h1 className="text-4xl font-bold">
          Add New Book
        </h1>

        <p className="mt-2 text-gray-500">
          Create bookstore inventory
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-sm"
      >
        {/* GRID */}

        <div className="grid gap-6 md:grid-cols-2">
          {/* TITLE */}

          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={
              formData.title
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* SLUG */}

          <input
            type="text"
            name="slug"
            placeholder="book-slug"
            value={
              formData.slug
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* CATEGORY */}

          <select
            name="category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          >
            <option value="">
              Select Category
            </option>

            {categories.map(
              (
                category
              ) => (
                <option
                  key={
                    category._id
                  }
                  value={
                    category._id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>

          {/* AUTHOR */}

          <select
            name="author"
            value={
              formData.author
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          >
            <option value="">
              Select Author
            </option>

            {authors.map(
              (author) => (
                <option
                  key={
                    author._id
                  }
                  value={
                    author._id
                  }
                >
                  {
                    author.name
                  }
                </option>
              )
            )}
          </select>

          {/* PRICE */}

          <input
            type="number"
            name="originalPrice"
            placeholder="Original Price"
            value={
              formData.originalPrice
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* DISCOUNT */}

          <input
            type="number"
            name="discountedPrice"
            placeholder="Discounted Price"
            value={
              formData.discountedPrice
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* STOCK */}

          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={
              formData.stock
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* CONDITION */}

          <select
            name="condition"
            value={
              formData.condition
            }
            onChange={
              handleChange
            }
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          >
            <option value="Used">
              Used
            </option>

            <option value="New">
              New
            </option>
          </select>

          {/* OFFER EXPIRES AT */}

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase pl-2">Offer Expires At</span>
            <input
              type="datetime-local"
              name="discountExpiresAt"
              value={
                formData.discountExpiresAt
              }
              onChange={
                handleChange
              }
              className="rounded-2xl border border-gray-200 px-5 py-4 outline-none text-sm text-gray-600 focus:border-[#c8860a]"
            />
          </div>

          {/* OFFERS THIS WEEK EXPIRES AT */}

          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase pl-2">Offers This Week Expires At</span>
            <input
              type="datetime-local"
              name="offersThisWeekExpiry"
              value={
                formData.offersThisWeekExpiry
              }
              onChange={
                handleChange
              }
              className="rounded-2xl border border-gray-200 px-5 py-4 outline-none text-sm text-gray-600 focus:border-[#c8860a]"
            />
          </div>

          {/* BINDING TYPE */}
          <select
            name="bindingType"
            value={formData.bindingType}
            onChange={handleChange}
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          >
            <option value="Paperback">Paperback</option>
            <option value="Hard Binding">Hard Binding</option>
            <option value="Leather Binding">Leather Binding</option>
            <option value="Spiral Binding">Spiral Binding</option>
          </select>

          {/* TOTAL PAGES */}
          <input
            type="number"
            name="totalPages"
            placeholder="Total Pages"
            value={formData.totalPages}
            onChange={handleChange}
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* PUBLISHER */}
          <input
            type="text"
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* ISBN */}
          <input
            type="text"
            name="isbn"
            placeholder="ISBN Number"
            value={formData.isbn}
            onChange={handleChange}
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />

          {/* PUBLISHING YEAR */}
          <input
            type="number"
            name="publicationYear"
            placeholder="Publishing Year"
            value={formData.publicationYear}
            onChange={handleChange}
            className="rounded-2xl border border-gray-200 px-5 py-4 outline-none"
          />
        </div>

        {/* DESCRIPTION */}

        <textarea
          rows="6"
          name="description"
          placeholder="Description..."
          value={
            formData.description
          }
          onChange={
            handleChange
          }
          className="w-full rounded-2xl border border-gray-200 px-5 py-4 outline-none"
        />

        {/* IMAGES */}

        <input
          type="file"
          multiple
          onChange={
            handleImages
          }
          className="w-full rounded-2xl border border-gray-200 px-5 py-4"
        />

        {/* CHECKBOXES */}

        <div className="flex flex-wrap gap-8">
          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="featured"
              checked={
                formData.featured
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            Featured
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="bestseller"
              checked={
                formData.bestseller
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            Bestseller
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="trending"
              checked={
                formData.trending
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            Trending This Week
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="newRelease"
              checked={
                formData.newRelease
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            New Release
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="offersThisWeek"
              checked={
                formData.offersThisWeek
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            Offer This Week
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="highDiscount"
              checked={
                formData.highDiscount
              }
              onChange={
                handleChange
              }
              className="h-4 w-4"
            />
            High Discount
          </label>
        </div>

        {/* BUTTON */}

        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-[var(--color-primary)] px-8 py-4 font-semibold text-white"
        >
          {loading
            ? "Creating..."
            : "Create Book"}
        </button>
      </form>
    </div>
  );
};

export default AdminAddBook;