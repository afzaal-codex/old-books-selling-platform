import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import toast from "react-hot-toast";

import axiosInstance from "../../utils/axiosInstance";

const AdminEditBook = () => {

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  /* STATES */

  const [loading,
    setLoading] =
    useState(false);

  const [pageLoading,
    setPageLoading] =
    useState(true);

  const [categories,
    setCategories] =
    useState([]);

  const [authors,
    setAuthors] =
    useState([]);

  const [images,
    setImages] =
    useState([]);

  const [existingImages,
    setExistingImages] =
    useState([]);

  const [coverSelection,
    setCoverSelection] =
    useState({ type: "existing", index: 0 });

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
            bookRes,
            categoriesRes,
            authorsRes,
          ] = await Promise.all([
            axiosInstance.get(
              `/books/${id}`
            ),

            axiosInstance.get(
              "/categories"
            ),

            axiosInstance.get(
              "/authors"
            ),
          ]);

          const book =
            bookRes.data;

          /* FORM */

          setFormData({
            title:
              book.title || "",

            slug:
              book.slug || "",

            author:
              book.author?._id ||
              "",

            category:
              book.category?._id ||
              "",

            description:
              book.description ||
              "",

            originalPrice:
              book.originalPrice ||
              "",

            discountedPrice:
              book.discountedPrice ||
              "",

            stock:
              book.stock || "",

            condition:
              book.condition ||
              "Used",

            featured:
              book.featured ||
              false,

            bestseller:
              book.bestseller ||
              false,

            trending:
              book.trending ||
              false,

            newRelease:
              book.newRelease ||
              false,

            offersThisWeek:
              book.offersThisWeek ||
              false,

            offersThisWeekExpiry:
              book.offersThisWeekExpiry
                ? new Date(book.offersThisWeekExpiry).toISOString().slice(0, 16)
                : "",

            highDiscount:
              book.highDiscount ||
              false,

            discountExpiresAt:
              book.discountExpiresAt
                ? new Date(book.discountExpiresAt).toISOString().slice(0, 16)
                : "",

            antique:
              book.antique || false,

            signed:
              book.signed || false,

            signedBy:
              book.signedBy || "",

            vintage:
              book.vintage || false,

            showStock:
              book.showStock !== false,

            showDiscount:
              book.showDiscount !== false,

            bindingType:
              book.bindingType || "Paperback",

            totalPages:
              book.totalPages || "",

            publisher:
              book.publisher || "",

            isbn:
              book.isbn || "",

            publicationYear:
              book.publicationYear || "",
          });

          setExistingImages(
            book.images || []
          );

          setCategories(
            categoriesRes.data
          );

          setAuthors(
            authorsRes.data
          );

        } catch (error) {

          toast.error(
            "Failed to fetch book"
          );

        } finally {

          setPageLoading(
            false
          );
        }
      };

    fetchData();

  }, [id]);

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

  /* IMAGES */

  const handleImages =
    (e) => {
      const selectedFiles = Array.from(e.target.files);
      const totalCount = selectedFiles.length + existingImages.length;
      if (totalCount > 10) {
        toast.error(`You can have a maximum of 10 images! You already have ${existingImages.length} stored.`);
        e.target.value = null;
        setImages([]);
        setCoverSelection({ type: "existing", index: 0 });
        return;
      }
      setImages(selectedFiles);
      setCoverSelection({ type: "existing", index: 0 });
    };

  /* REMOVE IMAGE */

  const removeExistingImage =
    (image) => {
      setExistingImages(
        (prev) =>
          prev.filter(
            (img) =>
              img !== image
          )
      );
      setCoverSelection({ type: "existing", index: 0 });
    };

  /* UPDATE */

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

        /* EXISTING */
        const orderedExisting = [...existingImages];
        if (coverSelection.type === "existing" && coverSelection.index < orderedExisting.length) {
          const [coverImg] = orderedExisting.splice(coverSelection.index, 1);
          orderedExisting.unshift(coverImg);
        }

        submitData.append(
          "existingImages",
          JSON.stringify(orderedExisting)
        );

        /* NEW */
        const orderedNew = [...images];
        if (coverSelection.type === "new" && coverSelection.index < orderedNew.length) {
          const [coverFile] = orderedNew.splice(coverSelection.index, 1);
          orderedNew.unshift(coverFile);
        }

        submitData.append("isNewCover", coverSelection.type === "new" ? "true" : "false");

        orderedNew.forEach(
          (image) => {

            submitData.append(
              "images",
              image
            );
          }
        );

        await axiosInstance.put(
          `/books/${id}`,
          submitData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Book updated successfully"
        );

        navigate(
          "/admin/books"
        );

      } catch (error) {

        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );

      } finally {

        setLoading(false);
      }
    };

  if (pageLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        Loading Book...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* TOP */}

      <div>
        <h1 className="text-4xl font-bold">
          Edit Book
        </h1>

        <p className="mt-2 text-gray-500">
          Update bookstore inventory
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

        {/* IMAGES & COVER MANAGER */}

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Image Manager & Cover Selection</h3>
          <p className="text-xs text-gray-500">Click on any image thumbnail to set it as the book's primary cover image.</p>
          
          {/* Existing Images Gallery */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase">Existing Images</span>
              <div className="flex flex-wrap gap-4 bg-gray-50 p-4 border border-gray-200 rounded-2xl">
                {existingImages.map((image, index) => {
                  const isCover = coverSelection.type === "existing" && coverSelection.index === index;
                  return (
                    <div
                      key={`exist-${index}`}
                      onClick={() => setCoverSelection({ type: "existing", index })}
                      className={`relative w-24 h-36 cursor-pointer border-2 transition-all overflow-hidden rounded-lg group ${isCover ? "border-[#c8860a] ring-2 ring-[#c8860a]/20" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <img src={image} alt={`existing-${index}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExistingImage(image);
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

          {/* New Image Upload */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-gray-400 uppercase block">Upload New Images</span>
            <input
              type="file"
              multiple
              onChange={handleImages}
              className="w-full rounded-2xl border border-gray-200 px-5 py-4"
            />
          </div>

          {/* New Images Previews */}
          {images.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-400 uppercase">New Upload Previews</span>
              <div className="flex flex-wrap gap-4 bg-gray-50 p-4 border border-gray-200 rounded-2xl">
                {images.map((file, index) => {
                  const url = URL.createObjectURL(file);
                  const isCover = coverSelection.type === "new" && coverSelection.index === index;
                  return (
                    <div
                      key={`new-${index}`}
                      onClick={() => setCoverSelection({ type: "new", index })}
                      className={`relative w-24 h-36 cursor-pointer border-2 transition-all overflow-hidden rounded-lg group ${isCover ? "border-[#c8860a] ring-2 ring-[#c8860a]/20" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <img src={url} alt={`new-${index}`} className="w-full h-full object-cover" />
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
        </div>

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
            ? "Updating..."
            : "Update Book"}
        </button>
      </form>
    </div>
  );
};

export default AdminEditBook;