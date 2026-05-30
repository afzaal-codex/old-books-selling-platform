import FooterBrand from "./FooterBrand";
import FooterLinks from "./FooterLinks";
import FooterContact from "./FooterContact";
import Newsletter from "./Newsletter";
import FooterBottom from "./FooterBottom";

const Footer = () => {
  return (
    <footer style={{
      background: "#111114",
      borderTop: "1px solid #222228",
      marginTop: "3px",
      fontFamily: '"Satoshi", system-ui, sans-serif',
      color: "#ffffff"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;700;800;900&display=swap');
        
        .premium-footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 32px;
          padding-top: 48px;
          padding-bottom: 48px;
          max-width: 1200px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }

        @media (max-width: 991px) {
          .premium-footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 600px) {
          .premium-footer-grid {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
        }
      `}</style>

      {/* MAIN FOOTER */}
      <div className="premium-footer-grid">
        {/* Column 1: BRAND */}
        <FooterBrand />

        {/* Column 2: LINKS */}
        <FooterLinks />

        {/* Column 3: CONTACT */}
        <FooterContact />

        {/* Column 4: NEWSLETTER */}
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <Newsletter />
        </div>
      </div>

      {/* BOTTOM */}
      <FooterBottom />
    </footer>
  );
};

export default Footer;
