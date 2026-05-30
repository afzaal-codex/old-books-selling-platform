import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* ─── Dynamic EndsAt Countdown ─── */
function Countdown({ endsAt }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (!endsAt) return;
    const updateTimer = () => {
      const difference = new Date(endsAt) - new Date();
      if (difference <= 0) { setTimeLeft("Expired"); return; }
      setTimeLeft({
        d: Math.floor(difference / (1000 * 60 * 60 * 24)),
        h: Math.floor((difference / (1000 * 60 * 60)) % 24),
        m: Math.floor((difference / 1000 / 60) % 60),
        s: Math.floor((difference / 1000) % 60),
      });
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [endsAt]);

  if (!timeLeft) return null;
  if (timeLeft === "Expired") return (
    <div style={{ color:"#cc2200", fontWeight:900, fontSize:"12px", letterSpacing:"0.15em", fontFamily:"'Playfair Display',serif", textTransform:"uppercase", padding:"4px 0" }}>
      Offer Ended
    </div>
  );

  const pad = n => String(n).padStart(2, "0");
  const ACCENT = "#C8922A", ACCENT2 = "#E8B84B";
  const timeBlocks = [
    ...(timeLeft.d > 0 ? [["DAYS", timeLeft.d]] : []),
    ["HRS", timeLeft.h], ["MIN", timeLeft.m], ["SEC", timeLeft.s]
  ];

  return (
    <div style={{ display:"flex", alignItems:"center", gap:"4px", justifyContent:"center" }}>
      {timeBlocks.map(([label, val], i) => (
        <div key={label} style={{ display:"flex", alignItems:"center", gap:"4px" }}>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center" }}>
            <div style={{
              padding:"3px 7px", minWidth:"30px", textAlign:"center",
              fontFamily:"'Playfair Display',serif", fontSize:"16px", fontWeight:900,
              background:`linear-gradient(135deg,${ACCENT},${ACCENT2})`,
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              lineHeight:1,
            }}>{pad(val)}</div>
            <div style={{ fontSize:"6px", letterSpacing:"0.15em", color:"#ffffff", marginTop:"1px" }}>{label}</div>
          </div>
          {i < timeBlocks.length - 1 && (
            <div style={{ fontSize:"14px", fontWeight:900, color:ACCENT2, marginBottom:"10px", opacity:0.7 }}>:</div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Left book image ─── */
function LeftBookImage({ src, isMobile }) {
  return (
    <img
      src={src || "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80"}
      alt="promo book"
      style={{
        width: isMobile ? "72px" : "140px",
        height: isMobile ? "100px" : "190px",
        objectFit:"cover",
        borderRadius:"3px",
        background:"none", border:"none", outline:"none", boxShadow:"none",
        display:"block",
        mixBlendMode:"luminosity",
        opacity:0.85,
        filter:"drop-shadow(0 8px 20px rgba(200,146,42,0.35))",
      }}
    />
  );
}

/* ─── MAIN ─── */
export default function PromoSection() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const { settings } = useSelector((state) => state.cms || {});
  const promo = settings?.promoSection || {};

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold:0.1 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const ACCENT = "#C8922A", ACCENT2 = "#E8B84B";
  const DEFAULT_BG_IMAGE = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1400&q=80";
  const bgImage = promo.bgImage || DEFAULT_BG_IMAGE;

  // Smaller notch on mobile so the clip doesn't eat too much
  const notch = isMobile ? 36 : 70;
  const sectionClip = `polygon(0% 0%, 100% 0%, calc(100% - ${notch}px) 50%, 100% 100%, 0% 100%, ${notch}px 50%, 0% 0%)`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes fadeSlideUp   { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeSlideRight{ from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
        .promo-btn {
          background:transparent; border:none; color:#C8922A;
          font-family:'DM Sans',sans-serif; font-weight:700;
          letter-spacing:0.1em; padding:5px 0; cursor:pointer;
          transition:color 0.2s,transform 0.2s;
          text-decoration:none; display:inline-flex; align-items:center; justify-content:center;
        }
        .promo-btn:hover{ color:#E8B84B; transform:scale(1.04); text-decoration:underline; }
        .discount-badge{
          background:linear-gradient(135deg,#C8922A,#F5D78E);
          -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
          font-family:'Playfair Display',serif; font-weight:900; line-height:1;
        }
        .vis-1{ opacity:0; animation:${visible?"fadeSlideUp 0.55s ease 0.05s forwards":"none"}; }
        .vis-2{ opacity:0; animation:${visible?"fadeSlideUp 0.55s ease 0.15s forwards":"none"}; }
        .vis-3{ opacity:0; animation:${visible?"fadeSlideUp 0.55s ease 0.27s forwards":"none"}; }
        .vis-4{ opacity:0; animation:${visible?"fadeSlideUp 0.55s ease 0.38s forwards":"none"}; }
        .vis-L{ opacity:0; animation:${visible?"fadeSlideRight 0.65s ease 0.08s forwards":"none"}; }
      `}</style>

      <div ref={sectionRef} style={{ position:"relative", width:"100%", overflow:"visible", fontFamily:"'DM Sans',sans-serif", margin:"24px 0" }}>
        <div style={{ position:"relative", width:"100%", clipPath:sectionClip, overflow:"hidden", background:"#0C0B0F" }}>

          {/* BG */}
          <div style={{ position:"absolute", inset:0, backgroundImage:`url(${bgImage})`, backgroundSize:"cover", backgroundPosition:"center", zIndex:0 }} />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(135deg,rgba(12,11,15,0.90) 0%,rgba(12,11,15,0.80) 50%,rgba(12,11,15,0.88) 100%)", zIndex:1 }} />
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse at 50% 50%,${ACCENT}1e 0%,transparent 70%)`, zIndex:2 }} />

          {/* Layout */}
          <div style={{
            position:"relative", zIndex:10,
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            gap: isMobile ? "14px" : "48px",
            minHeight: isMobile ? "130px" : "220px",
            padding: isMobile
              ? `16px ${notch + 10}px`   // mobile: tighter padding respecting notch
              : `24px ${notch + 30}px`,  // desktop: original feel
          }}>

            {/* Left image */}
            <div className="vis-L" style={{ flexShrink:0, display:"flex", alignItems:"center" }}>
              <LeftBookImage src={promo.cardImage} isMobile={isMobile} />
            </div>

            {/* Right content */}
            <div style={{ display:"flex", flexDirection:"column", alignItems: isMobile ? "flex-start" : "center", textAlign: isMobile ? "left" : "center", gap:0 }}>

              {/* Headline */}
              <div className="vis-1" style={{
                fontFamily:"'Playfair Display',serif",
                fontSize: isMobile ? "13px" : "22px",
                fontWeight:700, color:"#F0EAD6", lineHeight:"1.2", marginBottom:"2px",
              }}>
                {promo.headline || "Enjoy this Exclusive Offer"}
              </div>

              {/* Discount */}
              <div className="vis-2" style={{ marginBottom:"2px", display:"flex", alignItems:"baseline", gap:"3px" }}>
                <span className="discount-badge" style={{ fontSize: isMobile ? "34px" : "60px" }}>
                  {promo.discountValue !== undefined ? promo.discountValue : 40}%
                </span>
                <span style={{
                  fontFamily:"'Playfair Display',serif",
                  fontSize: isMobile ? "16px" : "26px",
                  fontWeight:700, color:ACCENT2,
                }}>
                  {promo.discountText || "OFF"}
                </span>
              </div>

              {/* Countdown */}
              <div className="vis-3" style={{ marginBottom: isMobile ? "8px" : "14px" }}>
                <div style={{ fontSize:"7px", letterSpacing:"0.15em", color:"#ffffff", marginBottom:"4px" }}>OFFER ENDS IN</div>
                <Countdown endsAt={promo.endsAt} />
              </div>

              {/* CTA */}
              <div className="vis-4">
                <Link to={promo.buttonLink || "/books?promo=true"} className="promo-btn" style={{ fontSize: isMobile ? "10px" : "13px" }}>
                  {promo.buttonText || "SHOP NOW"} →
                </Link>
              </div>

              {/* Coupon */}
              <div className="vis-4" style={{ marginTop: isMobile ? "5px" : "10px", fontSize:"8px", color:"#ffffff", letterSpacing:"0.1em" }}>
                USE CODE&nbsp;
                <span style={{ color:ACCENT2, fontWeight:700, border:`1px solid ${ACCENT}50`, padding:"1px 5px", fontSize:"8px" }}>
                  {promo.promoCode || "RARE40"}
                </span>
                &nbsp;AT CHECKOUT
              </div>
            </div>
          </div>

          {/* Top / bottom accent lines */}
          <div style={{ position:"absolute", top:0, left:`${notch}px`, right:`${notch}px`, height:"1px", background:`linear-gradient(90deg,transparent,${ACCENT}80,${ACCENT2}80,${ACCENT}80,transparent)`, zIndex:20 }} />
          <div style={{ position:"absolute", bottom:0, left:`${notch}px`, right:`${notch}px`, height:"1px", background:`linear-gradient(90deg,transparent,${ACCENT}80,${ACCENT2}80,${ACCENT}80,transparent)`, zIndex:20 }} />
        </div>

        {/* Notch glow hints */}
        <div style={{ position:"absolute", left:0, top:"50%", transform:"translateY(-50%)", width:0, height:0, borderTop:"14px solid transparent", borderBottom:"14px solid transparent", borderLeft:"12px solid rgba(200,146,42,0.12)", zIndex:11, filter:"blur(3px)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", right:0, top:"50%", transform:"translateY(-50%)", width:0, height:0, borderTop:"14px solid transparent", borderBottom:"14px solid transparent", borderRight:"12px solid rgba(200,146,42,0.12)", zIndex:11, filter:"blur(3px)", pointerEvents:"none" }} />
      </div>
    </>
  );
}