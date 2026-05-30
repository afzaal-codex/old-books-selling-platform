import { useSelector } from "react-redux";

const FooterSocials = () => {
  const { settings } = useSelector((state) => state.cms);
  const socials = settings?.socialLinks || {};
  
  // Filter out the pre-filled message parameter from showing as a social channel link
  const filteredSocials = Object.fromEntries(
    Object.entries(socials).filter(([key]) => key !== "whatsappMessage")
  );

  const hasActiveSocials = Object.values(filteredSocials).some((link) => !!link);

  if (!hasActiveSocials) return null;

  return (
    <div style={{ textAlign: "left" }}>
      <h3 style={{
        fontSize: "14px",
        fontWeight: "700",
        color: "#ffffff",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: "14px",
        marginTop: 0
      }}>
        Social Channels
      </h3>

      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}>
        {Object.entries(filteredSocials).map(([key, value]) =>
          value ? (
            <a
              key={key}
              href={value}
              target="_blank"
              rel="noreferrer"
              className="footer-social-link"
              style={{
                fontSize: "13px",
                fontWeight: "500",
                textTransform: "capitalize",
                color: "#6b6870",
                textDecoration: "none",
                display: "inline-block",
                transition: "all 0.18s ease"
              }}
            >
              {key}
            </a>
          ) : null
        )}
      </div>

      <style>{`
        .footer-social-link:hover {
          color: #ffffff !important;
          transform: translateX(2px);
        }
      `}</style>
    </div>
  );
};

export default FooterSocials;