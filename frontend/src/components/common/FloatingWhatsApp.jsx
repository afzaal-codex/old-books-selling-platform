import { useSelector } from "react-redux";

const normalizeWhatsAppLink = (value, textMessage) => {
  if (!value) return "";
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
};

const FloatingWhatsApp = () => {
  const { settings } = useSelector((state) => state.cms);
  const link = normalizeWhatsAppLink(
    settings?.socialLinks?.whatsapp,
    settings?.socialLinks?.whatsappMessage
  );

  if (!link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Chat on WhatsApp"
    >
      <img
        src="/whatsapp-icon.svg"
        alt="WhatsApp"
      />
    </a>
  );
};

export default FloatingWhatsApp;
