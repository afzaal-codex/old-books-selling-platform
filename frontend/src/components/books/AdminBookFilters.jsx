const AdminBookFilters = ({
  categories,
  authors,
  selectedCategory,
  setSelectedCategory,
  selectedAuthor,
  setSelectedAuthor,
  stockFilter,
  setStockFilter,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] p-5 rounded-3xl">
      {/* CATEGORY */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="rounded-xl border border-[var(--color-border)] bg-neutral-900 px-4 py-3 outline-none text-xs text-white focus:border-[var(--color-primary)] cursor-pointer"
      >
        <option value="" className="bg-neutral-900">All Categories</option>
        {Array.isArray(categories) && categories.filter(Boolean).map((category) => (
          <option key={category._id} value={category.name} className="bg-neutral-900">
            {category.name}
          </option>
        ))}
      </select>

      {/* AUTHOR */}
      <select
        value={selectedAuthor}
        onChange={(e) => setSelectedAuthor(e.target.value)}
        className="rounded-xl border border-[var(--color-border)] bg-neutral-900 px-4 py-3 outline-none text-xs text-white focus:border-[var(--color-primary)] cursor-pointer"
      >
        <option value="" className="bg-neutral-900">All Authors</option>
        {Array.isArray(authors) && authors.filter(Boolean).map((author) => (
          <option key={author._id} value={author.name} className="bg-neutral-900">
            {author.name}
          </option>
        ))}
      </select>

      {/* STOCK */}
      <select
        value={stockFilter}
        onChange={(e) => setStockFilter(e.target.value)}
        className="rounded-xl border border-[var(--color-border)] bg-neutral-900 px-4 py-3 outline-none text-xs text-white focus:border-[var(--color-primary)] cursor-pointer"
      >
        <option value="" className="bg-neutral-900">All Stock</option>
        <option value="instock" className="bg-neutral-900">In Stock</option>
        <option value="outofstock" className="bg-neutral-900">Out Of Stock</option>
        <option value="lowstock" className="bg-neutral-900">Low Stock (&le; 5)</option>
      </select>
    </div>
  );
};

export default AdminBookFilters;