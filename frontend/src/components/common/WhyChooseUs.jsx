import React, { useState } from "react";
import { BookOpen, Shield, Users, Heart } from "lucide-react";

const T = {
  bg:     "#0a0a0b",
  card:   "#111114",
  hover:  "#16161a",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#DCDCDC",
  dim:    "#44424a",
};

const ValueCard = ({ v }) => {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    hov ? T.hover : T.card,
        border:        `1px solid ${hov ? "#333339" : T.border}`,
        borderRadius:  0,
        padding:       "20px",
        display:       "flex",
        flexDirection: "column",
        gap:           12,
        transition:    "all 0.18s ease",
      }}
    >
      {/* Icon box */}
      <div style={{
        width:          36,
        height:         36,
        background:     "#0d0d10",
        border:         `1px solid ${T.border}`,
        borderRadius:   0,
        display:        "flex",
        alignItems:     "center",
        justifyContent: "center",
        flexShrink:     0,
      }}>
        {v.icon}
      </div>

      <h3 style={{
        fontFamily:   "Satoshi, system-ui, sans-serif",
        fontSize:     13,
        fontWeight:   800,
        color:        T.text,
        letterSpacing:"-0.01em",
        lineHeight:   1.2,
        margin:       0,
      }}>
        {v.title}
      </h3>

      <p style={{
        fontFamily: "system-ui, sans-serif",
        fontSize:   12,
        color:      T.muted,
        lineHeight: 1.6,
        margin:     0,
      }}>
        {v.desc}
      </p>
    </div>
  );
};

const WhyChooseUs = () => {
  const values = [
    {
      icon:  <BookOpen size={18} color={T.gold} strokeWidth={1.75} />,
      title: "Sustainable Reading",
      desc:  "Promoting a circular economy by giving books a second life and saving trees.",
    },
    {
      icon:  <Shield size={18} color={T.gold} strokeWidth={1.75} />,
      title: "Quality Assurance",
      desc:  "Every listed book undergoes assessment so you know exactly what condition it is in.",
    },
    {
      icon:  <Users size={18} color={T.gold} strokeWidth={1.75} />,
      title: "Community Driven",
      desc:  "Connecting passionate book lovers, students, and local sellers across the country.",
    },
    {
      icon:  <Heart size={18} color={T.gold} strokeWidth={1.75} />,
      title: "Affordable Literacy",
      desc:  "Making education and literary adventures accessible to everyone at unmatched prices.",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28, marginBottom: 28 }}>
      {/* Section header */}
      <div style={{ textAlign: "center" }}>
        <span style={{
          fontFamily:    "Satoshi, system-ui, sans-serif",
          fontSize:      9,
          fontWeight:    700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color:         T.gold,
          display:       "block",
          marginBottom:  8,
        }}>
          Core Pillars
        </span>
        <h2 style={{
          fontFamily:   "Satoshi, system-ui, sans-serif",
          fontSize:     "clamp(20px, 3vw, 28px)",
          fontWeight:   800,
          color:        T.text,
          letterSpacing:"-0.01em",
          lineHeight:   1.15,
          margin:       "0 0 8px",
        }}>
          Why Choose BookWorld?
        </h2>
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          Our core pillars guide everything we build and support for our users.
        </p>
      </div>

      {/* Grid */}
      <div
        className="about-grid-4"
        style={{
          display:             "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap:                 1,
        }}
      >
        {values.map((v, i) => <ValueCard key={i} v={v} />)}
      </div>

      {/* Responsive helpers */}
      <style>{`
        .about-grid-4 { grid-template-columns: repeat(4, 1fr) !important; }
        @media(max-width:768px){
          .about-grid-4 { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;
