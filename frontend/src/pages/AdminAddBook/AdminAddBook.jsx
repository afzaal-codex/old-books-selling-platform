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

  const [coverIndex,
    setCoverIndex] =
    useState(0);

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
      antique: false,
      signed: false,
      signedBy: "",
      vintage: false,
      showStock: true,
      showDiscount: true,

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

  const handleImages =
    (e) => {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => {
        const combined = [...prev, ...selectedFiles];
        if (combined.length > 10) {
          toast.error("You can upload a maximum of 10 images!");
          return prev;
        }
        return combined;
      });
      setCoverIndex(0);
      e.target.value = null;
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

        const rearrangedImages = [...images];
        if (coverIndex > 0 && coverIndex < rearrangedImages.length) {
          const [coverFile] = rearrangedImages.splice(coverIndex, 1);
          rearrangedImages.unshift(coverFile);
        }

        rearrangedImages.forEach(
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

        {images.length > 0 && (
          <div className="w-full mt-2 p-4 bg-gray-50 border border-gray-200 rounded-2xl">
            <span className="text-xs text-gray-500 font-bold uppercase block mb-3">Review Images & Select Cover Image (Click to choose)</span>
            <div className="flex flex-wrap gap-4">
              {images.map((file, idx) => {
                const url = URL.createObjectURL(file);
                const isCover = idx === coverIndex;
                return (
                  <div
                    key={idx}
                    onClick={() => setCoverIndex(idx)}
                    className={`relative w-24 h-36 cursor-pointer border-2 transition-all overflow-hidden rounded-lg group ${isCover ? "border-[#c8860a] ring-2 ring-[#c8860a]/20" : "border-gray-200 hover:border-gray-400"}`}
                  >
                    <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setImages((prev) => prev.filter((_, i) => i !== idx));
                        if (coverIndex === idx) {
                          setCoverIndex(0);
                        } else if (coverIndex > idx) {
                          setCoverIndex(coverIndex - 1);
                        }
                      }}
                      className="absolute right-1 top-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 leading-none text-[8px] font-black z-25"
                    >
                      ✕
                    </button>
                    {isCover ? (
                      <span className="absolute bottom-0 left-0 right-0 bg-[#c8860a] text-black text-[9px] font-black text-center py-1">
                        COVER IMAGE
                      </span>
                    ) : (
                      <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] font-bold text-center py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        SET AS COVER
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="antique"
              checked={formData.antique}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Antique Book
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="vintage"
              checked={formData.vintage}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Vintage Find
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="signed"
              checked={formData.signed}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Signed Book
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="showStock"
              checked={formData.showStock}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Show Stock Status
          </label>

          <label className="flex items-center gap-3 cursor-pointer text-gray-700 font-medium">
            <input
              type="checkbox"
              name="showDiscount"
              checked={formData.showDiscount}
              onChange={handleChange}
              className="h-4 w-4"
            />
            Show Discount Percentage
          </label>

          {formData.signed && (
            <input
              type="text"
              name="signedBy"
              placeholder="Signed by (e.g. Stephen King)"
              value={formData.signedBy}
              onChange={handleChange}
              className="rounded-2xl border border-gray-200 px-5 py-2 outline-none text-xs text-black"
            />
          )}
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