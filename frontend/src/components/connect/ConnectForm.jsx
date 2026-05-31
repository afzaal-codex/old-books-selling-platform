import React, { useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import ButtonLoader from "../loaders/ButtonLoader";

const ConnectForm = () => {
  const { settings } = useSelector((state) => state.cms || {});
  const connect = settings?.connectSection || {};

  const eyebrow = connect.eyebrow || "The Old Shelf · Newsletter";
  const heading = connect.heading || "Stay Within the Pages";
  const headingEm = connect.headingEm || "the Pages";
  const description = connect.description || "Rare arrivals, weekly curations & exclusive offers — delivered quietly to your inbox like a letter from a distant library.";
  const bgImage = connect.bgImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&fit=crop";
  const cardImage = connect.cardImage || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop";
  const buttonText = connect.buttonText || "Connect";

  const renderHeading = () => {
    if (headingEm && heading.includes(headingEm)) {
      const idx = heading.indexOf(headingEm);
      const before = heading.substring(0, idx);
      const after = heading.substring(idx + headingEm.length);
      return (
        <>
          {before}<em>{headingEm}</em>{after}
        </>
      );
    }
    return heading;
  };

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage("");
    setStatus("");
    try {
      const response = await axiosInstance.post("/connect", { email });
      setStatus("success");
      setMessage(response.data.message || "Thank you — a rare welcome awaits your inbox.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Noto+Sans:wght@700&display=swap');

        .cf-outer {
          width: 100%;
          position: relative;
          font-family: 'Lora', Georgia, serif;
        }

        /* Top-left golden corner bracket */
        .cf-outer::before {
          content: '';
          position: absolute;
          top: -1px; left: -1px;
          width: 56px; height: 56px;
          border-top: 2px solid #c8860a;
          border-left: 2px solid #c8860a;
          z-index: 10;
          pointer-events: none;
        }

        /* Bottom-right golden corner bracket */
        .cf-outer::after {
          content: '';
          position: absolute;
          bottom: -1px; right: -1px;
          width: 56px; height: 56px;
          border-bottom: 2px solid #c8860a;
          border-right: 2px solid #c8860a;
          z-index: 10;
          pointer-events: none;
        }

        .cf-card {
          position: relative;
          display: flex;
          min-height: 340px;
          overflow: hidden;
          background: #0c0b0f;
        }

        /* Full card background image */
        .cf-bg {
          position: absolute; inset: 0;
          background-image: url('https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=900&fit=crop');
          background-size: cover;
          background-position: center;
          z-index: 0;
        }

        /* Dark backdrop — image barely visible */
        .cf-backdrop {
          position: absolute; inset: 0;
          background: rgba(10, 9, 13, 0.84);
          z-index: 1;
        }

        /* ── LEFT IMAGE COLUMN (desktop only) ── */
        .cf-left {
          position: relative;
          z-index: 2;
          flex: 0 0 0px; /* hidden on mobile, overridden below */
          display: none;
        }

        .cf-img-wrap {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .cf-img-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          border: none; outline: none;
        }

        /* ── RIGHT CONTENT COLUMN ── */
        .cf-right {
          position: relative;
          z-index: 2;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 48px 48px 48px;
        }

        .cf-eyebrow {
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #c8860a;
          margin-bottom: 14px;
          font-weight: 500;
        }

        .cf-heading {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          line-height: 1.18;
          color: #f0ead6;
          margin-bottom: 8px;
        }

        .cf-heading em {
          font-style: italic;
          font-weight: 400;
          color: #e8b84b;
        }

        .cf-desc {
          font-size: 13px;
          font-style: italic;
          line-height: 1.65;
          color: rgba(240, 234, 214, 0.44);
          margin-bottom: 34px;
          max-width: 400px;
        }

        /* ── INPUT ROW ── */
        .cf-form-row {
          display: flex;
          align-items: flex-end;
          width: 100%;
          max-width: 440px;
          /* bottom border spans full row including button */
          border-bottom: 1.5px solid #c8860a;
        }

        /* Input: no background, no border of its own */
        .cf-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: 'Lora', serif;
          font-size: 13px;
          color: #ffffff;
          padding: 8px 0 8px 0;
        }

        .cf-input::placeholder {
          color: rgba(255, 255, 255, 0.45);
        }

        /* Golden button — sharp corners, black bold text, no border-radius */
        .cf-btn {
          flex-shrink: 0;
          padding: 8px 20px;
          background: linear-gradient(135deg, #c8991a, #e8b830, #c8991a);
          color: #0d0900;
          font-family: 'Noto Sans', Arial, sans-serif;
          font-size: 10.5px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: none;
          border-radius: 0;
          cursor: pointer;
          transition: filter 0.18s;
          white-space: nowrap;
          /* sits flush at end of the underline */
          margin-bottom: -1.5px;
          height: calc(100% + 1.5px);
          align-self: stretch;
          display: flex;
          align-items: center;
        }

        .cf-btn:hover:not(:disabled) { filter: brightness(1.1); }
        .cf-btn:active:not(:disabled) { filter: brightness(0.94); }
        .cf-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* Feedback */
        .cf-message {
          margin-top: 16px;
          font-family: 'Lora', serif;
          font-size: 12px;
          font-style: italic;
          min-height: 18px;
        }
        .cf-message.success { color: #6ee7b7; }
        .cf-message.error   { color: #fca5a5; }

        /* ── DESKTOP: show left image column ── */
        @media (min-width: 640px) {
          .cf-left {
            display: flex;
            flex: 0 0 260px;
          }

          .cf-img-wrap {
            width: 100%;
          }

          .cf-right {
            padding: 44px 52px 44px 40px;
          }
        }
      `}</style>

      <div className="cf-outer">
        <div className="cf-card">
          <div className="cf-bg" style={{ backgroundImage: `url(${bgImage})` }} />
          <div className="cf-backdrop" />

          {/* LEFT: book image — desktop only */}
          <div className="cf-left">
            <div className="cf-img-wrap">
              <img
                src={cardImage}
                alt="Rare book"
              />
            </div>
          </div>

          {/* RIGHT: content */}
          <div className="cf-right">
            <p className="cf-eyebrow">{eyebrow}</p>

            <h2 className="cf-heading">
              {renderHeading()}
            </h2>

            <p className="cf-desc">
              {description}
            </p>

            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              {/* Input + button share a single bottom golden line */}
              <div className="cf-form-row">
                <input
                  className="cf-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  autoComplete="email"
                />
                <button
                  type="submit"
                  className="cf-btn"
                  disabled={loading}
                >
                  {loading ? <ButtonLoader label="" /> : buttonText}
                </button>
              </div>
            </form>

            {message && (
              <p className={`cf-message ${status}`}>{message}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConnectForm;