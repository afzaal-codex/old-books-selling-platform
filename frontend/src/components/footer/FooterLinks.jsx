import { Link } from "react-router-dom";

const links = [
  { label: "Home", path: "/" },
  { label: "Books", path: "/books" },
  { label: "Offers", path: "/offers" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const FooterLinks = () => {
  return (
    <div style={{ textAlign: "left" }}>
      <h3 style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "20px",
        marginTop: 0
      }}>
        Quick Links
      </h3>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px"
      }}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="footer-nav-link"
            style={{
              fontSize: "13px",
              fontWeight: "500",
              color: "#6b6870",
              textDecoration: "none",
              display: "inline-block",
              transition: "all 0.18s ease"
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <style>{`
        .footer-nav-link:hover {
          color: #ffffff !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default FooterLinks;