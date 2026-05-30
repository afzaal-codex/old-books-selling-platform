import companyData from "../../data/companyData";

const FooterBottom = () => {
  return (
    <div style={{
      borderTop: "1px solid rgba(255,255,255,0.08)",
      paddingTop: "20px",
      paddingBottom: "20px",
      background: "#111114"
    }}>
      <style>{`
        .footer-bottom-container {
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .footer-bottom-text {
          font-size: 12px;
          color: #6b6870;
          margin: 0;
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .footer-bottom-link-item {
          font-size: 12px;
          fontWeight: 500;
          color: #6b6870;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.18s ease;
          padding: 0;
        }

        .footer-bottom-link-item:hover {
          color: #ffffff !important;
        }

        @media (max-width: 600px) {
          .footer-bottom-container {
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }
        }
      `}</style>

      <div className="footer-bottom-container">
        <p className="footer-bottom-text">
          © {new Date().getFullYear()} {companyData.companyName}. All rights reserved.
        </p>

        <div className="footer-bottom-links">
          <button className="footer-bottom-link-item">
            Privacy Policy
          </button>
          <button className="footer-bottom-link-item">
            Terms &amp; Conditions
          </button>
        </div>
      </div>
    </div>
  );
};

export default FooterBottom;