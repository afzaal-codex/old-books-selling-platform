import { BookOpen, Shield, Users, Heart, Library } from "lucide-react";

/* ─── Design tokens ───────────────────────────────────────────────────────── */
const T = {
  bg:     "#0a0a0b",
  card:   "#111114",
  hover:  "#16161a",
  border: "#222228",
  gold:   "#c8860a",
  text:   "#f0ede8",
  muted:  "#6b6870",
  dim:    "#44424a",
};

const s = {
  label: {
    fontFamily:    "system-ui, sans-serif",
    fontSize:      9,
    fontWeight:    700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color:         T.muted,
  },
};

const About = () => {
  const stats = [
    { label: "Books Circulated", value: "50,000+" },
    { label: "Active Readers",   value: "12,000+" },
    { label: "Verified Sellers", value: "1,500+"  },
    { label: "Carbon Saved",     value: "8.5 Tons" },
  ];

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
      <SeoHead page="About Us" />
      <div style={{ background: T.bg, fontFamily: "system-ui, sans-serif", paddingBottom: 48, display: "flex", flexDirection: "column", gap: 1 }}>

      {/* ── Page Header — cart-header eyebrow style ── */}
      <div style={{ paddingBottom: 28, borderBottom: `1px solid ${T.border}`, marginBottom: 28 }}>
        {/* Eyebrow */}
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          fontSize: 11, fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", color: T.gold,
          marginBottom: 10, fontFamily: "system-ui, sans-serif",
        }}>
          <Library size={11} color={T.gold} strokeWidth={2} />
          Our Story
        </div>
        {/* Title */}
        <h1 style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "clamp(26px, 4vw, 36px)",
          fontWeight: 800, color: T.text,
          lineHeight: 1.15, margin: "0 0 6px",
          letterSpacing: "-0.01em",
        }}>
          About BookWorld
        </h1>
        {/* Subtitle */}
        <p style={{ fontFamily: "system-ui, sans-serif", fontSize: 13, color: T.muted, margin: 0 }}>
          A premium marketplace for pre-loved and rare books.
        </p>
      </div>

      {/* ── Hero Section ── */}
      <HeroSection />

      {/* ── Stats ── */}
      <StatsSection stats={stats} />

      {/* ── Core Values ── */}
      <ValuesSection values={values} />

      {/* responsive helpers */}
      <style>{`
        .about-hero   { flex-direction: row !important; }
        .about-grid-4 { grid-template-columns: repeat(4,1fr) !important; }
        .about-grid-2 { grid-template-columns: repeat(2,1fr) !important; }
        @media(max-width:768px){
          .about-hero   { flex-direction: column !important; }
          .about-grid-4 { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media(max-width:480px){
          .about-grid-2 { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ─── Hero ───────────────────────────────────────────────────────────────── */
const HeroSection = () => (
  <div
    className="about-hero"
    style={{
      background:    T.card,
      border:        `1px solid ${T.border}`,
      borderRadius:  0,
      padding:       "32px 32px",
      display:       "flex",
      alignItems:    "center",
      gap:           40,
      marginBottom:  1,
    }}
  >
    {/* Left content */}
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Mission label */}
      <span style={{
        display:       "inline-flex",
        alignItems:    "center",
        gap:           6,
        fontFamily:    "system-ui, sans-serif",
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color:         T.gold,
        border:        `1px solid ${T.border}`,
        background:    "#0d0d10",
        padding:       "4px 10px",
        width:         "fit-content",
        borderRadius:  0,
      }}>
        Our Mission
      </span>

      <h2 style={{
        fontFamily:   "system-ui, sans-serif",
        fontSize:     "clamp(22px, 3vw, 32px)",
        fontWeight:   800,
        color:        T.gold,
        lineHeight:   1.15,
        letterSpacing:"-0.01em",
        margin:       0,
        maxWidth:     520,
      }}>
        Preserving Stories,<br />Sharing Knowledge
      </h2>

      <p style={{
        fontFamily: "system-ui, sans-serif",
        fontSize:   13,
        color:      T.muted,
        lineHeight: 1.7,
        margin:     0,
        maxWidth:   520,
      }}>
        Welcome to BookWorld, your premium marketplace for pre-loved and rare books.
        We believe that every book has a soul, and its journey shouldn't end on a single shelf.
        Our platform provides a seamless, secure, and beautiful space to buy and sell old books,
        connecting buyers with trusted sellers.
      </p>
    </div>

    {/* Right brand mark */}
    <div style={{
      flexShrink:     0,
      width:          140,
      alignSelf:      "stretch",
      display:        "flex",
      flexDirection:  "column",
      alignItems:     "center",
      justifyContent: "center",
      background:     "#0d0d10",
      border:         `1px solid ${T.border}`,
      borderRadius:   0,
      padding:        "24px 20px",
      gap:            8,
    }}>
      <span style={{
        fontFamily:   "system-ui, sans-serif",
        fontSize:     36,
        fontWeight:   800,
        color:        T.gold,
        lineHeight:   1,
        letterSpacing:"-0.03em",
      }}>B</span>
      <div style={{ width: 24, height: 1, background: T.border }} />
      <span style={{
        ...{ fontFamily: "system-ui, sans-serif" },
        fontSize:      8,
        fontWeight:    700,
        letterSpacing: "0.20em",
        textTransform: "uppercase",
        color:         T.muted,
        textAlign:     "center",
      }}>
        Book<br />World
      </span>
    </div>
  </div>
);

/* ─── Stats ──────────────────────────────────────────────────────────────── */
const StatCard = ({ stat }) => {
  const [hov, setHov] = React.useState(false);
  return (
      <SeoHead page="About Us" />
      <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background:    T.card,
        border:        `1px solid ${hov ? "#333339" : T.border}`,
        borderRadius:  0,
        padding:       "20px 16px",
        textAlign:     "center",
        transition:    "all 0.18s ease",
      }}
    >
      <p style={{
        fontFamily:   "system-ui, sans-serif",
        fontSize:     28,
        fontWeight:   800,
        color:        T.gold,
        lineHeight:   1.1,
        letterSpacing:"-0.02em",
        margin:       "0 0 6px",
      }}>
        {stat.value}
      </p>
      <p style={{
        fontFamily:    "system-ui, sans-serif",
        fontSize:      9,
        fontWeight:    700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color:         T.muted,
        margin:        0,
      }}>
        {stat.label}
      </p>
    </div>
  );
};

const StatsSection = ({ stats }) => (
  <div
    className="about-grid-2"
    style={{
      display:             "grid",
      gridTemplateColumns: "repeat(2,1fr)",
      gap:                 1,
      marginBottom:        1,
    }}
  >
    {stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
  </div>
);

/* ─── Values ─────────────────────────────────────────────────────────────── */
const ValueCard = ({ v }) => {
  const [hov, setHov] = React.useState(false);
  return (
      <SeoHead page="About Us" />
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
        fontFamily:   "system-ui, sans-serif",
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

const ValuesSection = ({ values }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 28 }}>
    {/* Section header */}
    <div style={{ textAlign: "center" }}>
      <span style={{
        fontFamily:    "system-ui, sans-serif",
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
        fontFamily:   "system-ui, sans-serif",
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
        gridTemplateColumns: "repeat(2,1fr)",
        gap:                 1,
      }}
    >
      {values.map((v, i) => <ValueCard key={i} v={v} />)}
    </div>
  </div>
);

/* React needs to be in scope for useState in sub-components */
import React from "react";
import SeoHead from "../../components/common/SeoHead";

export default About;