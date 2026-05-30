const AdminBookStats = ({
  books,
}) => {
  const safeBooks = Array.isArray(books) ? books.filter(Boolean) : [];

  const totalRevenue = safeBooks.reduce(
    (acc, book) => acc + (book.totalRevenue || 0),
    0
  );

  const totalOrders = safeBooks.reduce(
    (acc, book) => acc + (book.totalOrders || 0),
    0
  );

  const totalStock = safeBooks.reduce(
    (acc, book) => acc + (book?.stock || 0),
    0
  );

  const stats = [
    {
      title: "Total Titles",
      value: safeBooks.length,
      color: "text-white"
    },
    {
      title: "Generated Revenue",
      value: `Rs. ${totalRevenue}`,
      color: "text-[var(--color-primary)]"
    },
    {
      title: "Placed Orders",
      value: totalOrders,
      color: "text-blue-400"
    },
    {
      title: "Stock Count",
      value: totalStock,
      color: totalStock <= 10 ? "text-[var(--color-accent)]" : "text-emerald-400"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-card-bg)] p-6 shadow-lg"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            {stat.title}
          </p>
          <h2 className={`mt-3 text-2xl font-black ${stat.color}`}>
            {stat.value}
          </h2>
        </div>
      ))}
    </div>
  );
};

export default AdminBookStats;