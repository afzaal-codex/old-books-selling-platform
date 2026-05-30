import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { useRequestBook } from "../../context/RequestBookContext";

const SearchBar = ({ isMobile = false }) => {
  const [keyword, setKeyword] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const navigate = useNavigate();
  const { openRequestModal } = useRequestBook();

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/books?keyword=${encodeURIComponent(keyword.trim())}&searchBy=${searchBy}`);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={isMobile ? "flex items-stretch gap-2 w-full" : "hidden lg:flex items-stretch gap-2 w-full max-w-2xl"}
      style={{ height: "42px" }}
    >
      {/* Search input + icon */}
      <div
        className="flex flex-1 items-stretch border bg-white/5"
        style={{ borderColor: "rgba(255,255,255,0.15)" }}
      >
        <input
          type="text"
          placeholder="Keyword | Title | Author | ISBN | Publisher"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="
            flex-1 bg-transparent
            text-sm text-white placeholder-gray-500
            outline-none
          "
          style={{ padding: "10px 0 10px 16px" }}
        />

        {/* Search Category Dropdown */}
        <div style={{ display: "flex", alignItems: "center", paddingRight: "4px" }}>
          <select
            value={searchBy}
            onChange={(e) => setSearchBy(e.target.value)}
            className="bg-neutral-900 text-xs text-gray-300 outline-none cursor-pointer border border-white/10"
            style={{
              padding: "2px",
              height: "28px",
              fontFamily: "'Satoshi', sans-serif",
              fontWeight: 600,
              color: "#c8860a",
            }}
          >
            <option value="title" style={{ background: "#111114", color: "#fff" }}>Book name</option>
            <option value="author" style={{ background: "#111114", color: "#fff" }}>Author</option>
            <option value="publisher" style={{ background: "#111114", color: "#fff" }}>Publisher</option>
          </select>
        </div>

        {/* Search icon — perfectly centered */}
        <button
          type="submit"
          className="flex items-center justify-center flex-shrink-0 cursor-pointer text-[#c8860a]"
          style={{ width: "42px", height: "42px" }}
        >
          <Search size={15} strokeWidth={2.2} />
        </button>
      </div>

      {!isMobile && (
        <>
          {/* Advanced Search */}
          <button
            type="button"
            onClick={() => navigate("/books?advanced=true")}
            className="
              flex items-center justify-center
              flex-shrink-0
              bg-transparent
              font-semibold text-gray-300
              tracking-wide cursor-pointer whitespace-nowrap
              hover:text-[#c8860a] hover:border-[#c8860a]
              transition-colors duration-200
            "
            style={{
              fontSize: "13px",
              padding: "0 14px",
              height: "42px",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            Advanced Search
          </button>

          {/* Request a Book */}
          <button
            type="button"
            onClick={openRequestModal}
            className="
              flex items-center justify-center
              flex-shrink-0
              bg-transparent
              font-semibold
              tracking-wide cursor-pointer whitespace-nowrap
              hover:text-white hover:border-white
              transition-colors duration-200
            "
            style={{
              fontSize: "13px",
              padding: "0 14px",
              height: "42px",
              border: "1px solid #c8860a",
              color: "#c8860a",
            }}
          >
            Request a Book
          </button>
        </>
      )}
    </form>
  );
};

export default SearchBar;