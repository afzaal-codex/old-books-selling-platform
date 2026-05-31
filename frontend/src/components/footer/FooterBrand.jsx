import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaFacebookF, FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import companyData from "../../data/companyData";

const normalizeSocialHref = (key, value, textMessage) => {
  if (!value) return "";
  if (key === "whatsapp") {
    let url = "";
    if (/^https?:\/\//i.test(value)) {
      url = value;
    } else {
      let phone = value.replace(/[^\d]/g, "");
      if (phone.startsWith("0") && phone.length === 11) {
        phone = "92" + phone.substring(1);
      }
      url = phone ? `https://wa.me/${phone}` : "";
    }
    if (url && textMessage) {
      const separator = url.includes("?") ? "&" : "?";
      if (!url.includes("text=")) {
        url += `${separator}text=${encodeURIComponent(textMessage)}`;
      }
    }
    return url;
  }
  return value;
};

const FooterBrand = () => {
  const companyName = companyData.companyName || companyData.name || "BookWorld";
  const { settings } = useSelector((state) => state.cms);
  const socials = settings?.socialLinks || {};
  const activeSocials = Object.entries(socials)
    .filter(([key]) => key !== "whatsappMessage")
    .filter(([, value]) => Boolean(value));
  const icons = {
    facebook: <FaFacebookF size={16} />,
    instagram: <FaInstagram size={17} />,
    whatsapp: <FaWhatsapp size={18} />,
    youtube: <FaYoutube size={18} />,
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* LOGO & NAME GROUP */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textDecoration: "none",
          textAlign: "left"
        }}
      >
        {companyData.logo ? (
          <img
            src={companyData.logo}
            alt={companyName}
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "999px",
              objectFit: "cover"
            }}
          />
        ) : (
          <div style={{
            width: "56px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#c8860a",
            fontSize: "24px",
            fontWeight: "800",
            color: "#ffffff",
            borderRadius: "999px"
          }}>
            {companyName.charAt(0)}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column" }}>
          <h2 style={{
            fontSize: "24px",
            fontWeight: "800",
            letterSpacing: "-0.02em",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1.1
          }}>
            {companyName}
          </h2>
        </div>
      </Link>

      {activeSocials.length > 0 && (
        <div className="footer-brand-socials">
          {activeSocials.map(([key, value]) => (
            <a
              key={key}
              href={normalizeSocialHref(key, value, socials.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
              className="footer-brand-social"
              aria-label={key}
            >
              {icons[key] || <span>{key.charAt(0).toUpperCase()}</span>}
            </a>
          ))}
        </div>
      )}

      <style>{`
        .footer-brand-socials {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          width: max-content;
          background: transparent;
          margin-top: 4px;
        }
        .footer-brand-social {
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1.5px solid rgba(200,134,10,0.85);
          color: #c8860a;
          text-decoration: none;
          transition: all 0.2s ease;
          background: transparent;
        }
        .footer-brand-social:hover {
          background: rgba(200,134,10,0.08);
          color: #f0ede8;
          border-color: #f0ede8;
        }
      `}</style>
    </div>
  );
};

export default FooterBrand;
