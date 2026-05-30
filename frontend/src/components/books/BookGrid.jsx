import BookCard from "./BookCard";

const BookGrid = ({ books }) => {

  if (!books?.length) {
    return (
      <div className="flex min-h-[350px] items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white">
        <h2 className="text-2xl font-bold text-gray-500">
          No Books Found
        </h2>
      </div>
    );
  }

  return (
<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">      {books.map((book) => (
        <BookCard
          key={book._id}
          book={book}
        />
      ))}
    </div>
  );
};

export default BookGrid;