import { useSelector } from "react-redux";

const FooterContact = () => {
  const { settings } = useSelector((state) => state.cms);

  return (
    <div style={{ textAlign: "left" }}>
      <h3 style={{
        fontSize: "16px",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "20px",
        marginTop: 0
      }}>
        Contact
      </h3>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        fontSize: "13px",
        lineHeight: "1.7",
        color: "#8b8b92"
      }}>
        <p style={{ margin: 0 }}>
          <a
            href={`mailto:${settings?.supportEmail || "hello@bookworld.site"}`}
            className="footer-contact-link"
            style={{ color: "#8b8b92", textDecoration: "none", transition: "color 0.18s ease" }}
          >
            {settings?.supportEmail || "hello@bookworld.site"}
          </a>
        </p>

        <p style={{ margin: 0 }}>
          <a
            href={`tel:${settings?.supportPhone || "+92 300 0000000"}`}
            className="footer-contact-link"
            style={{ color: "#8b8b92", textDecoration: "none", transition: "color 0.18s ease" }}
          >
            {settings?.supportPhone || "+92 300 0000000"}
          </a>
        </p>

        <p style={{ margin: 0, color: "#DCDCDC" }}>
          Customer Support Available 24/7
        </p>
      </div>

      <style>{`
        .footer-contact-link:hover {
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
};

export default FooterContact;