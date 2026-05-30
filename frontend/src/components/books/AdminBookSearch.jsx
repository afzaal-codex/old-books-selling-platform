import { Search } from "lucide-react";

const AdminBookSearch = ({
  search,
  setSearch,
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSearch(search);
      }}
      className="flex items-center w-full rounded-xl border border-[var(--color-border)] bg-neutral-900 focus-within:border-[var(--color-primary)] transition-all duration-300"
    >
      <input
        type="text"
        placeholder="Search books by title, author name, or keywords..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-transparent px-4 py-3 text-xs outline-none text-white placeholder-gray-500"
      />
      
      {/* Divider */}
      <div className="h-6 w-[1px] bg-neutral-800" />
      
      {/* Search Icon Gold Wrapper on Right */}
      <button
        type="submit"
        className="px-4 py-3 flex items-center justify-center cursor-pointer border-none bg-transparent outline-none hover:opacity-85 transition-opacity"
        title="Search"
      >
        <div className="bg-[var(--color-primary)] text-black p-1.5 rounded-lg flex items-center justify-center">
          <Search size={14} strokeWidth={2.5} style={{ color: "#000000" }} />
        </div>
      </button>
    </form>
  );
};

export default AdminBookSearch;