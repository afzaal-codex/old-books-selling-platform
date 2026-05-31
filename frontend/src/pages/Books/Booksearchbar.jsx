import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";

const T = {
  card:   "#111114",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#DCDCDC",
  dim:    "#44424a",
};

/**
 * BookSearchBar
 * Self-contained search component — handles its own URL param sync.
 *
 * Props:
 *   value       {string}   controlled value from parent
 *   onChange    {fn}       (value: string) => void
 *   placeholder {string}
 *   autoFocus   {boolean}
 *   onFocus     {fn}       called when input is focused — use to close all dropdowns in parent
 */
const BookSearchBar = ({
  value,
  onChange,
  placeholder = "Search by title, author, ISBN…",
  autoFocus = false,
  onFocus,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const [searchParams] = useSearchParams();

  /* Sync from URL ?q= on first mount */
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q && q !== value) onChange(q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClear = () => {
    onChange("");
    inputRef.current?.focus();
  };

  const handleFocus = () => {
    setFocused(true);
    onFocus?.(); // notify parent to close all dropdowns
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onChange(value);
      }}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        fontFamily: "system-ui, sans-serif",
        background: T.card,
        border: `1px solid ${focused ? T.gold : T.border}`,
        transition: "border-color 0.18s ease",
      }}
    >
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => setFocused(false)}
        autoFocus={autoFocus}
        placeholder={placeholder}
        aria-label="Search books"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          padding: "9px 12px",
          fontFamily: "system-ui, sans-serif",
          fontSize: 12,
          color: T.text,
          outline: "none",
          caretColor: T.gold,
        }}
      />

      {/* Divider */}
      <div style={{ width: "1px", height: "18px", backgroundColor: "rgba(255,255,255,0.15)" }} />

      {/* Search icon wrapper on right */}
      <button
        type="submit"
        style={{
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          outline: "none"
        }}
        title="Search"
      >
        <div style={{
          backgroundColor: T.gold,
          color: "#000000",
          padding: "5px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px"
        }}>
          <Search size={13} strokeWidth={2.5} style={{ color: "#000000" }} />
        </div>
      </button>
    </form>
  );
};

export default BookSearchBar;