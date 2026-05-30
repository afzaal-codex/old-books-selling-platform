import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../loaders/ButtonLoader";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axiosInstance.post("/newsletter", { email });
      toast.success(response.data.message || "Subscribed successfully");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
      <h3 style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "20px",
        marginTop: 0
      }}>
        Newsletter
      </h3>

      <p style={{
        fontSize: "13px",
        lineHeight: "1.7",
        color: "#8b8b92",
        marginBottom: "16px",
        marginTop: 0
      }}>
        Subscribe for latest offers and new arrivals.
      </p>

      <div style={{
        display: "flex",
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0d0d10",
        overflow: "hidden",
        borderRadius: "0px" // sharp edges
      }}>
        <input
          type="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            height: "44px",
            padding: "0 14px",
            background: "transparent",
            color: "#ffffff",
            fontSize: "13px",
            outline: "none",
            border: "none",
            width: "100%",
            boxSizing: "border-box"
          }}
          className="newsletter-input"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#c8860a",
            color: "#000000",
            padding: "0 18px",
            fontSize: "11px",
            fontWeight: "800",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.75 : 1,
            transition: "all 0.18s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#d89b1d")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#c8860a")}
        >
          {loading ? <ButtonLoader label="" /> : "Join"}
        </button>
      </div>

      <style>{`
        .newsletter-input::placeholder {
          color: #6b6870;
        }
      `}</style>
    </form>
  );
};

export default Newsletter;
