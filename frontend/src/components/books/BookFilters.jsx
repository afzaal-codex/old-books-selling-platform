const BookFilters = ({
  /* USER FILTERS */

  selectedCondition,
  setSelectedCondition,

  selectedCategory,
  setSelectedCategory,

  selectedAuthor,
  setSelectedAuthor,

  selectedPrice,
  setSelectedPrice,

  selectedRating,
  setSelectedRating,

  categories = [],
  authors = [],

  /* ADMIN FILTERS */

  isAdmin = false,

  selectedStock,
  setSelectedStock,

  selectedStatus,
  setSelectedStatus,

  selectedDiscount,
  setSelectedDiscount,
}) => {
  return (
    <div className="space-y-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* USER CONDITION FILTERS */}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={() =>
            setSelectedCondition(
              "All"
            )
          }
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            selectedCondition ===
            "All"
              ? "bg-[var(--color-primary)] text-white"
              : "border border-gray-200 bg-white text-gray-700"
          }`}
        >
          All Books
        </button>

        <button
          onClick={() =>
            setSelectedCondition(
              "New"
            )
          }
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            selectedCondition ===
            "New"
              ? "bg-[var(--color-primary)] text-white"
              : "border border-gray-200 bg-white text-gray-700"
          }`}
        >
          New
        </button>

        <button
          onClick={() =>
            setSelectedCondition(
              "Used"
            )
          }
          className={`rounded-2xl px-5 py-3 text-sm font-semibold transition ${
            selectedCondition ===
            "Used"
              ? "bg-[var(--color-primary)] text-white"
              : "border border-gray-200 bg-white text-gray-700"
          }`}
        >
          Used
        </button>
      </div>

      {/* ADVANCED FILTERS */}

      <div
        className={`grid gap-5 ${
          isAdmin
            ? "md:grid-cols-3"
            : "md:grid-cols-2 lg:grid-cols-4"
        }`}
      >
        {/* CATEGORY */}

        {!isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Category
            </label>

            <select
              value={
                selectedCategory
              }
              onChange={(e) =>
                setSelectedCategory(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="">
                All Categories
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
          </div>
        )}

        {/* AUTHOR */}

        {!isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Author
            </label>

            <select
              value={
                selectedAuthor
              }
              onChange={(e) =>
                setSelectedAuthor(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="">
                All Authors
              </option>

              {authors.map(
                (
                  author
                ) => (
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
          </div>
        )}

        {/* PRICE */}

        {!isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Price Range
            </label>

            <select
              value={
                selectedPrice
              }
              onChange={(e) =>
                setSelectedPrice(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="">
                All Prices
              </option>

              <option value="0-500">
                Rs 0 - 500
              </option>

              <option value="500-1000">
                Rs 500 - 1000
              </option>

              <option value="1000-2000">
                Rs 1000 - 2000
              </option>

              <option value="2000-5000">
                Rs 2000 - 5000
              </option>
            </select>
          </div>
        )}

        {/* RATINGS */}

        {!isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Ratings
            </label>

            <select
              value={
                selectedRating
              }
              onChange={(e) =>
                setSelectedRating(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="">
                All Ratings
              </option>

              <option value="5">
                ⭐⭐⭐⭐⭐
              </option>

              <option value="4">
                ⭐⭐⭐⭐ & Up
              </option>

              <option value="3">
                ⭐⭐⭐ & Up
              </option>

              <option value="2">
                ⭐⭐ & Up
              </option>

              <option value="1">
                ⭐ & Up
              </option>
            </select>
          </div>
        )}

        {/* ADMIN STOCK */}

        {isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Stock
            </label>

            <select
              value={
                selectedStock
              }
              onChange={(e) =>
                setSelectedStock(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            >
              <option value="">
                All
              </option>

              <option value="low">
                Low Stock
              </option>

              <option value="out">
                Out Of Stock
              </option>

              <option value="healthy">
                Healthy Stock
              </option>
            </select>
          </div>
        )}

        {/* ADMIN STATUS */}

        {isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Status
            </label>

            <select
              value={
                selectedStatus
              }
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            >
              <option value="">
                All
              </option>

              <option value="featured">
                Featured
              </option>

              <option value="bestseller">
                Bestseller
              </option>

              <option value="trending">
                Trending
              </option>

              <option value="recommended">
                Recommended
              </option>
            </select>
          </div>
        )}

        {/* ADMIN DISCOUNT */}

        {isAdmin && (
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Discount
            </label>

            <select
              value={
                selectedDiscount
              }
              onChange={(e) =>
                setSelectedDiscount(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-gray-200 px-4 py-3"
            >
              <option value="">
                All
              </option>

              <option value="discounted">
                Discounted
              </option>

              <option value="non-discounted">
                Non Discounted
              </option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookFilters;