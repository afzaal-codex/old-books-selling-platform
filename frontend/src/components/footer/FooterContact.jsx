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
          {settings?.supportEmail || "support@bookworld.site"}
        </p>

        <p style={{ margin: 0 }}>
          {settings?.supportPhone || "+92 300 0000000"}
        </p>

        <p style={{ margin: 0, color: "#6b6870" }}>
          Customer Support Available 24/7
        </p>
      </div>
    </div>
  );
};

export default FooterContact;