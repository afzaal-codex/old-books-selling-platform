import { useState, useEffect, useRef, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setDirectCheckoutItem } from "../../store/slices/cartSlice";

const BOOKS = [
  { id:1, title:"The Gilded Manuscript", author:"Elara Voss",
    desc:"A luminous journey through illuminated texts of the Renaissance — where ink becomes immortality and every margin holds a secret.",
    rating:4.9, reviews:312, price:"Rs. 340.00", oldPrice:"Rs. 420.00", category:"Renaissance", label:"Collector's Edition", stock:"3 Left",
    accent:["#C8922A","#E8B84B","#F5D78E"], cover:"https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&q=80" },
  { id:2, title:"Shadows of the Codex", author:"Dorian Marsh",
    desc:"An obsidian-bound grimoire cataloguing lost alchemical traditions — authenticated, annotated, extraordinary.",
    rating:4.8, reviews:204, price:"Rs. 285.00", oldPrice:"Rs. 360.00", category:"Alchemy & Occult", label:"Rare First Edition", stock:"1 Left",
    accent:["#7A6B8A","#A08CB0","#C5B3D8"], cover:"https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&q=80" },
  { id:3, title:"Letters from the Meridian", author:"Isabeau Chénier",
    desc:"Handwritten correspondence between two explorers across three continents — intimate, world-altering, exquisitely preserved.",
    rating:4.7, reviews:178, price:"Rs. 195.00", oldPrice:"Rs. 240.00", category:"Correspondence", label:"Signed Copy", stock:"7 Left",
    accent:["#8B4A2F","#B5654A","#D4937A"], cover:"https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80" },
  { id:4, title:"The Cartographer's Atlas", author:"Nikolai Brennan",
    desc:"Sixteen hand-drawn maps of territories that no longer exist — the definitive record of erased geographies.",
    rating:5.0, reviews:89, price:"Rs. 520.00", oldPrice:"Rs. 640.00", category:"Cartography", label:"Museum Quality", stock:"2 Left",
    accent:["#2F6B5A","#4A9A82","#7BC4A8"], cover:"https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&q=80" },
  { id:5, title:"Verses of the Forgotten Age", author:"Mireille Dumont",
    desc:"Poetry from the 14th century — discovered in a monastery vault, translated by scholars across four universities.",
    rating:4.6, reviews:256, price:"Rs. 165.00", oldPrice:"Rs. 200.00", category:"Poetry & Verse", label:"Limited Print", stock:"12 Left",
    accent:["#5A4A7A","#7B6AA0","#A090C5"], cover:"https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=300&q=80" },
];

const DEFAULT_PRIMARY_LINE = "Where Every Page\u00A0Whispers History.";
const DEFAULT_SECONDARY_LINE = "Rare Volumes. Timeless\u00A0Souls.";

function SecondaryTypewriter({ accent, secondaryLine = DEFAULT_SECONDARY_LINE }) {
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    let cancelled = false;
    let tid;
    const delay = (ms) => new Promise(res => { tid = setTimeout(res, ms); });
    const run = async () => {
      while (!cancelled) {
        setPhase("typing");
        for (let i = 0; i <= secondaryLine.length; i++) {
          if (cancelled) return;
          setText(secondaryLine.slice(0, i));
          await delay(38 + Math.random() * 34);
        }
        setPhase("pause");
        await delay(2800);
        setPhase("erasing");
        for (let i = secondaryLine.length; i >= 0; i--) {
          if (cancelled) return;
          setText(secondaryLine.slice(0, i));
          await delay(20 + Math.random() * 16);
        }
        setPhase("gap");
        await delay(500);
      }
    };
    run();
    return () => { cancelled = true; clearTimeout(tid); };
  }, [secondaryLine]);

  const showCursor = phase === "typing" || phase === "erasing";

  return (
    <div style={{
      fontFamily:"'Cormorant Garamond','Playfair Display',Georgia,serif",
      fontSize:"clamp(13px,1.5vw,20px)", fontWeight:500, fontStyle:"italic",
      letterSpacing:"0.01em", lineHeight:1.4, color:accent,
      textShadow:`0 0 28px ${accent}50`, transition:"color 0.9s,text-shadow 0.9s",
      minHeight:"1.5em",
    }}>
      {text}
      {showCursor && (
        <span style={{
          display:"inline-block", width:"1.5px", height:"0.82em",
          background:accent, marginLeft:"2px", verticalAlign:"middle",
          animation:"blink 0.7s step-end infinite", transition:"background 0.9s",
        }} />
      )}
    </div>
  );
}

function HexCanvas({ accentColor = "#C8922A" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x:-9999, y:-9999 });
  const particlesRef = useRef([]);
  const rafRef = useRef(null);
  const accentRef = useRef(accentColor);
  useEffect(() => { accentRef.current = accentColor; }, [accentColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W, H, hexes = [];

    function hexToRgb(hex) {
      return { r:parseInt(hex.slice(1,3),16), g:parseInt(hex.slice(3,5),16), b:parseInt(hex.slice(5,7),16) };
    }

    function buildGrid() {
      const parent = canvas.parentElement;
      W = canvas.width = parent.offsetWidth;
      H = canvas.height = parent.offsetHeight;
      hexes = [];
      const size=38, w=size*Math.sqrt(3), h=size*2;
      const cols=Math.ceil(W/w)+2, rows=Math.ceil(H/(h*0.75))+2;
      for (let row=-1; row<rows; row++)
        for (let col=-1; col<cols; col++)
          hexes.push({ x:col*w+(row%2)*(w/2), y:row*h*0.75, size, glow:0, targetGlow:0, phase:Math.random()*Math.PI*2 });
    }

    function hexPath(cx,cy,s) {
      ctx.beginPath();
      for (let i=0;i<6;i++) {
        const a=(Math.PI/180)*(60*i-30);
        i===0?ctx.moveTo(cx+s*Math.cos(a),cy+s*Math.sin(a)):ctx.lineTo(cx+s*Math.cos(a),cy+s*Math.sin(a));
      }
      ctx.closePath();
    }

    let frameCount=0;
    function draw(ts) {
      rafRef.current=requestAnimationFrame(draw);
      ctx.clearRect(0,0,W,H);
      const mx=mouseRef.current.x, my=mouseRef.current.y;
      const ac=hexToRgb(accentRef.current);
      frameCount++;
      hexes.forEach(hex=>{
        const dx=hex.x-mx,dy=hex.y-my,dist=Math.sqrt(dx*dx+dy*dy);
        hex.targetGlow=Math.max(0,1-dist/180)**2;
        hex.glow+=(hex.targetGlow-hex.glow)*0.08;
        const ambient=0.018+0.012*Math.sin(ts*0.0008+hex.phase);
        const g=hex.glow+ambient;
        hexPath(hex.x,hex.y,hex.size-1.5); ctx.fillStyle=`rgba(18,16,22,0.92)`; ctx.fill();
        if(g>0.01){ hexPath(hex.x,hex.y,hex.size-1.5); ctx.fillStyle=`rgba(${ac.r},${ac.g},${ac.b},${g*0.18})`; ctx.fill(); }
        hexPath(hex.x,hex.y,hex.size-1.5); ctx.strokeStyle=`rgba(${ac.r},${ac.g},${ac.b},${0.08+g*0.35})`; ctx.lineWidth=0.8; ctx.stroke();
        hexPath(hex.x,hex.y,hex.size-3); ctx.strokeStyle=`rgba(255,255,255,${0.03+g*0.07})`; ctx.lineWidth=0.5; ctx.stroke();
        hexPath(hex.x,hex.y,hex.size); ctx.strokeStyle=`rgba(${ac.r},${ac.g},${ac.b},${0.04+g*0.28})`; ctx.lineWidth=1.5; ctx.stroke();
      });
      if(frameCount%3===0&&mx>=0&&mx<=W) particlesRef.current.push({ x:mx+(Math.random()-0.5)*60, y:my+(Math.random()-0.5)*60, vx:(Math.random()-0.5)*1.8, vy:(Math.random()-0.5)*1.8, life:1.0, decay:0.012+Math.random()*0.015, radius:1.5+Math.random()*3 });
      particlesRef.current=particlesRef.current.filter(p=>p.life>0);
      particlesRef.current.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.life-=p.decay;
        const pg=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.radius*3);
        pg.addColorStop(0,`rgba(${ac.r},${ac.g},${ac.b},${p.life*0.7})`);
        pg.addColorStop(1,`rgba(${ac.r},${ac.g},${ac.b},0)`);
        ctx.beginPath(); ctx.arc(p.x,p.y,p.radius*3,0,Math.PI*2); ctx.fillStyle=pg; ctx.fill();
      });
      if(mx>=0&&mx<=W) {
        const halo=ctx.createRadialGradient(mx,my,0,mx,my,90);
        halo.addColorStop(0,`rgba(${ac.r},${ac.g},${ac.b},0.12)`);
        halo.addColorStop(1,`rgba(${ac.r},${ac.g},${ac.b},0)`);
        ctx.beginPath(); ctx.arc(mx,my,90,0,Math.PI*2); ctx.fillStyle=halo; ctx.fill();
      }
    }

    buildGrid();
    rafRef.current=requestAnimationFrame(draw);
    const onMove=e=>{ const rect=canvas.getBoundingClientRect(); mouseRef.current={x:e.clientX-rect.left,y:e.clientY-rect.top}; };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("resize",()=>buildGrid());
    return ()=>{ cancelAnimationFrame(rafRef.current); window.removeEventListener("mousemove",onMove); };
  },[]);

  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",zIndex:0 }} />;
}

function StarRating({ rating }) {
  return (
    <div style={{ display:"flex",alignItems:"center",gap:"3px" }}>
      {[1,2,3,4,5].map(s=>(
        <svg key={s} width="11" height="11" viewBox="0 0 12 12">
          <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 1,4.5 4.5,4.5"
            fill={s<=Math.round(rating)?"#E8B84B":"rgba(255,255,255,0.15)"} />
        </svg>
      ))}
    </div>
  );
}

function InfoCardContent({ book, accent, cardVisible, onAcquire }) {
  return (
    <div key={`card-${book.id}`} style={{
      position:"relative", overflow:"hidden",
      border:`1px solid rgba(255,255,255,0.13)`,
      borderTop:`2px solid ${accent}`,
      boxSizing:"border-box",
      opacity:cardVisible?1:0,
      transform:cardVisible?"translateY(0)":"translateY(10px)",
      transition:"opacity 0.45s ease,transform 0.45s ease,border-color 0.9s ease",
      borderRadius:"2px",
      backdropFilter:"blur(18px) saturate(1.6)",
      WebkitBackdropFilter:"blur(18px) saturate(1.6)",
    }}>
      <div style={{ position:"absolute",inset:0,backgroundImage:`url(${book.cover})`,backgroundSize:"cover",backgroundPosition:"center",filter:"blur(28px) brightness(0.18) saturate(1.8)",transform:"scale(1.18)",zIndex:0 }} />
      <div style={{ position:"absolute",inset:0,background:"rgba(10,8,16,0.62)",zIndex:1 }} />
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"48%",background:"linear-gradient(180deg,rgba(255,255,255,0.055) 0%,transparent 100%)",zIndex:2,pointerEvents:"none" }} />
      <div style={{ position:"absolute",top:0,left:0,right:0,height:"2px",background:`linear-gradient(90deg,${accent},transparent)`,transition:"background 0.9s",zIndex:3 }} />
      <div style={{ position:"relative",zIndex:4,padding:"14px 16px 16px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px" }}>
          <span style={{ fontSize:"8.5px",fontWeight:700,letterSpacing:"0.12em",color:accent,background:`${accent}22`,padding:"2px 7px",border:`1px solid ${accent}40`,transition:"color 0.9s,background 0.9s" }}>{book.label}</span>
          <span style={{ fontSize:"8.5px",fontWeight:600,letterSpacing:"0.1em",color:"rgba(240,234,214,0.38)" }}>{book.stock}</span>
        </div>
        <div style={{ fontSize:"17px",fontWeight:800,letterSpacing:"-0.01em",lineHeight:"1.2",color:"#F0EAD6",marginBottom:"3px",fontFamily:"'Cormorant Garamond','Playfair Display',Georgia,serif" }}>{book.title}</div>
        <div style={{ fontSize:"8.5px",fontWeight:600,letterSpacing:"0.1em",color:"rgba(240,234,214,0.42)",marginBottom:"9px" }}>BY {book.author.toUpperCase()}</div>
        <div style={{ fontSize:"11.5px",fontWeight:400,lineHeight:"1.55",color:"rgba(240,234,214,0.60)",marginBottom:"10px" }}>{book.desc}</div>
        <div style={{ display:"flex",alignItems:"center",gap:"5px",marginBottom:"10px" }}>
          <StarRating rating={book.rating} />
          <span style={{ fontSize:"11px",fontWeight:800,color:"#E8B84B" }}>{book.rating.toFixed(1)}</span>
          <span style={{ fontSize:"9px",fontWeight:500,color:"rgba(240,234,214,0.28)" }}>({book.reviews})</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontSize:"8px",fontWeight:700,letterSpacing:"0.2em",color:"rgba(240,234,214,0.28)",marginBottom:"2px" }}>PRICE</div>
            <div style={{ display:"flex",alignItems:"baseline",gap:"5px" }}>
              <span style={{ fontSize:"18px",fontWeight:900,color:"#c8860a" }}>{book.price}</span>
              {book.oldPrice&&<span style={{ fontSize:"10px",fontWeight:500,color:"#6b7280",textDecoration:"line-through" }}>{book.oldPrice}</span>}
            </div>
          </div>
          <button className="acquire-btn" onClick={onAcquire} style={{ background:accent,border:"none",color:"#0C0B0F",fontSize:"9px",fontWeight:800,letterSpacing:"0.07em",padding:"9px 14px",cursor:"pointer",transition:"opacity 0.2s,transform 0.2s,background 0.9s ease" }}>ACQUIRE</button>
        </div>
      </div>
    </div>
  );
}

export default function LuxuryBookHero() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeIdx, setActiveIdx] = useState(0);
  const [orbitPhase, setOrbitPhase] = useState(0);
  const [cardVisible, setCardVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bookT, setBookT] = useState(0);
  const animRef = useRef(null);
  const phaseRef = useRef(0);
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ w:1200, h:700 });

  const { settings } = useSelector((state) => state.cms || {});
  const heroSection = settings?.heroSection || {};
  const heroBooks = heroSection.books && heroSection.books.length > 0 ? heroSection.books : null;

  const button1Text = heroSection.button1Text || "SELL YOUR BOOK";
  const button1Link = heroSection.button1Link || "/sell-book";
  const button2Text = heroSection.button2Text || "CHOOSE FROM US";
  const button2Link = heroSection.button2Link || "/books";
  const primaryLine = heroSection.primaryLine || DEFAULT_PRIMARY_LINE;
  const secondaryLine = heroSection.secondaryLine || DEFAULT_SECONDARY_LINE;

  const currentBooks = heroBooks ? heroBooks.map((b, idx) => ({
    id:idx+1, title:b.title, author:b.author?.name||b.author||"Unknown",
    desc:b.description||"", rating:b.rating||5.0, reviews:b.reviews||10,
    price:`Rs. ${b.discountedPrice>0?b.discountedPrice:b.originalPrice}`,
    oldPrice:b.discountedPrice>0?`Rs. ${b.originalPrice}`:"",
    category:b.category?.name||"Book",
    label:b.trending?"Trending":b.featured?"Featured":"Rare Find",
    stock:b.stock>0?`${b.stock} Left`:"Available",
    accent:idx%3===0?["#C8922A","#E8B84B","#F5D78E"]:idx%3===1?["#7A6B8A","#A08CB0","#C5B3D8"]:["#2F6B5A","#4A9A82","#7BC4A8"],
    cover:b.images?.[0]||b.cover||"https://placehold.co/300x450",
  })) : BOOKS;

  const book = currentBooks[activeIdx] || currentBooks[0];
  const accent = book?.accent?.[0] || "#C8922A";
  const accentLight = book?.accent?.[1] || "#E8B84B";

  const handleAcquire = () => {
    const originalBook = heroSection.books?.[activeIdx];
    if (originalBook) {
      dispatch(setDirectCheckoutItem({ ...originalBook, quantity:1 }));
    } else {
      const staticBook = BOOKS[activeIdx];
      dispatch(setDirectCheckoutItem({
        _id:staticBook.id, title:staticBook.title, images:[staticBook.cover],
        originalPrice:parseFloat(staticBook.price.replace("Rs. ","")),
        discountedPrice:0, stock:5, quantity:1,
      }));
    }
    navigate("/checkout");
  };

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const r = containerRef.current.getBoundingClientRect();
        setDims({ w:r.width, h:r.height });
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const isMobile = dims.w < 768;

  const getOrbit = useCallback(() => {
    const { w, h } = dims;
    const isMob = w < 768;
    const r = isMob ? Math.min(w*1.05,h*1.3) : Math.min(w*0.68,h*1.55);
    const cx = isMob ? w*0.36 : w*0.37;
    const cy = isMob ? h*0.04 : h*0.04;
    return { cx, cy, r };
  }, [dims]);

  // ─── ANGLE MAPPING ───
  // Phase 0 (enter): t 0→0.5 maps angle -78 → 18  (enters from bottom of curve)
  // Phase 1 (pause): t=0.5, angle=18 (display position)
  // Phase 2 (exit):  t 0.5→1 maps angle 18 → 108  (continues FORWARD along same curve)
  function tToAngle(t) {
    const startAngle = -78;
    const pauseAngle =  18;
    const endAngle   = 108;
    const eio = (x) => (x < 0.5 ? 2*x*x : -1+(4-2*x)*x);

    if (t <= 0.5) {
      return startAngle + (pauseAngle - startAngle) * eio(t / 0.5);
    } else {
      return pauseAngle + (endAngle - pauseAngle) * eio((t - 0.5) / 0.5);
    }
  }

  function getBookPos(t) {
    const { cx, cy, r } = getOrbit();
    const angle = tToAngle(t);
    const rad = angle * Math.PI / 180;
    return { bx:cx+r*Math.cos(rad), by:cy+r*Math.sin(rad), tangentAngle:angle+90 };
  }

  // ─── TRIGGER NEXT: simultaneous card+book transition ───
  const triggerNext = useCallback((nextIdx) => {
    // Fade card out immediately as book starts exiting
    setIsTransitioning(true);
    setCardVisible(false);
    setTimeout(() => {
      setActiveIdx(nextIdx);
      phaseRef.current = 0;
      setBookT(0);
      setOrbitPhase(0);
      setIsTransitioning(false);
      // Card fades in exactly when book arrives at pause point
      // ENTER = 1000ms, so card appears in sync
      setTimeout(() => setCardVisible(true), 280);
    }, 380);
  }, []);

  // ─── ANIMATION LOOP ───
  // ENTER: 1000ms | PAUSE: 3000ms | EXIT: 1000ms → total 5s per book
  useEffect(() => {
    let startTime = null;
    const ENTER = 1000, PAUSE = 3000, EXIT = 1000;

    const animate = (ts) => {
      if (!startTime) startTime = ts;
      const el = ts - startTime;

      if (phaseRef.current === 0) {
        // Entering through tunnel bottom → pause position
        const p = Math.min(el / ENTER, 1);
        setBookT(p * 0.5);
        if (p >= 1) {
          phaseRef.current = 1;
          startTime = ts;
          setOrbitPhase(1);
          // Show card simultaneously when book reaches pause
          setCardVisible(true);
        }
      } else if (phaseRef.current === 1) {
        setBookT(0.5);
        if (el >= PAUSE) {
          phaseRef.current = 2;
          startTime = ts;
          setOrbitPhase(2);
          // Hide card simultaneously as book starts exiting
          setCardVisible(false);
        }
      } else if (phaseRef.current === 2) {
        // Exiting back down through same tunnel
        const p = Math.min(el / EXIT, 1);
        setBookT(0.5 + p * 0.5);  // 0.5 → 1.0 maps pauseAngle → entryAngle (reverse)
        if (p >= 1) {
          // Swap to next book and restart
          const nextIdx = (activeIdx + 1) % currentBooks.length;
          setActiveIdx(nextIdx);
          phaseRef.current = 0;
          startTime = null;
          setBookT(0);
          setOrbitPhase(0);
          setIsTransitioning(false);
          setTimeout(() => setCardVisible(true), 280);
          return;
        }
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
  }, [activeIdx, currentBooks.length]);

  const handleNav = (dir) => {
    if (isTransitioning) return;
    const next = dir === 1
      ? (activeIdx + 1) % currentBooks.length
      : (activeIdx - 1 + currentBooks.length) % currentBooks.length;
    if (animRef.current) cancelAnimationFrame(animRef.current);
    triggerNext(next);
  };

  const { bx, by, tangentAngle } = getBookPos(bookT);
  const isPaused = orbitPhase === 1;
  const bookW = isPaused ? 187 : 105;
  const bookH = isPaused ? 259 : 145;
  // Fade in on enter (t: 0→0.04) and fade out on exit (t: 0.96→1)
  const bookOpacity = bookT < 0.04 ? bookT / 0.04 : bookT > 0.96 ? (1 - bookT) / 0.04 : 1;
  // During exit book continues forward so tangent direction stays the same
  const bookRotate = isPaused ? 0 : tangentAngle - 90;

  const { cx:oCx, cy:oCy, r:oR } = getOrbit();
  const orbitThick = 132;
  const tw = isMobile ? 46 : 58;
  const th = isMobile ? 62 : 77;

  // ─── BOOK THUMBNAIL ROW ───
  const BookRow = () => (
    <div style={{ display:"flex", alignItems:"flex-end", gap:isMobile?"4px":"7px" }}>
      {currentBooks.map((b, i) => {
        const isActive = i === activeIdx;
        return (
          <div key={b.id}
            onClick={() => { if (!isTransitioning && i !== activeIdx) { if (animRef.current) cancelAnimationFrame(animRef.current); triggerNext(i); } }}
            style={{
              display:"flex", flexDirection:"column", alignItems:"center",
              cursor:"pointer", flexShrink:0,
              transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              transform:isActive?"translateY(-10px) scale(1.08)":"translateY(0) scale(1)",
            }}>
            <div style={{ position:"relative", marginBottom:"6px" }}>
              <img src={b.cover} alt={b.title} style={{
                width:`${tw}px`, height:`${th}px`, objectFit:"cover", borderRadius:"1px", display:"block",
                filter:isActive?`brightness(1.18) drop-shadow(0 4px 14px ${b.accent[0]}90)`:"brightness(0.42)",
                transition:"filter 0.5s ease",
              }} />
              {isActive && (
                <div style={{ position:"absolute",inset:"-2px",border:`1px solid ${b.accent[0]}80`,borderRadius:"2px",pointerEvents:"none",boxShadow:`0 0 10px ${b.accent[0]}40`,transition:"border-color 0.9s" }} />
              )}
            </div>
            <div style={{ width:isActive?`${tw}px`:"0px",height:"1.5px",background:b.accent[0],transition:"width 0.5s ease,background 0.9s ease" }} />
          </div>
        );
      })}
    </div>
  );

  // ─── COUNTER ───
  const Counter = () => (
    <div style={{ display:"flex", alignItems:"center", gap:"11px" }}>
      <button className="arr-btn" onClick={() => handleNav(-1)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(240,234,214,0.32)",fontSize:"17px",padding:"0 6px",flexShrink:0,transition:"color 0.2s",lineHeight:1 }}>←</button>
      <span style={{ fontSize:"11px",fontWeight:700,letterSpacing:"0.08em",color:accent,transition:"color 0.9s" }}>{String(activeIdx+1).padStart(2,"0")}</span>
      <div style={{ width:"44px",height:"1px",background:"rgba(255,255,255,0.1)",position:"relative",overflow:"hidden" }}>
        <div style={{ position:"absolute",left:0,top:0,height:"100%",width:`${((activeIdx+1)/currentBooks.length)*100}%`,background:accent,transition:"width 0.55s ease,background 0.9s ease" }} />
      </div>
      <span style={{ fontSize:"11px",fontWeight:500,letterSpacing:"0.08em",color:"rgba(240,234,214,0.22)" }}>{String(currentBooks.length).padStart(2,"0")}</span>
      <button className="arr-btn" onClick={() => handleNav(1)} style={{ background:"none",border:"none",cursor:"pointer",color:"rgba(240,234,214,0.32)",fontSize:"17px",padding:"0 6px",flexShrink:0,transition:"color 0.2s",lineHeight:1 }}>→</button>
    </div>
  );

  const sharedStyle = `
    @import url('https://fonts.googleapis.com/css2?family=Satoshi:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,500;1,600;1,700&display=swap');
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes grain{0%,100%{transform:translate(0,0)}20%{transform:translate(-1%,-1%)}40%{transform:translate(1%,0)}60%{transform:translate(-1%,1%)}80%{transform:translate(1%,-1%)}}
    @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
    .acquire-btn:hover{opacity:0.86;transform:scale(1.02)}
    .arr-btn:hover{color:#F0EAD6!important}
    .cta-gold:hover{opacity:0.86;transform:translateY(-1px)}
    .cta-white:hover{opacity:0.86;transform:translateY(-1px)}
  `;

  // ── MOBILE LAYOUT ──
  if (isMobile) {
    return (
      <div ref={containerRef} style={{
        position:"relative", width:"100%", height:"calc(100svh - var(--site-header-height, 0px))",
        background:"#0C0B0F", overflow:"hidden",
        fontFamily:"'Satoshi',system-ui,sans-serif",
        display:"flex", flexDirection:"column",
      }}>
        <style>{sharedStyle}</style>
        <HexCanvas accentColor={accent} />
        <div style={{ position:"absolute",inset:0,opacity:0.3,mixBlendMode:"overlay",pointerEvents:"none",zIndex:5,
          backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")` }} />

        {/* Typography + CTAs */}
        <div style={{ padding:"28px 16px 0",position:"relative",zIndex:10,flex:"0 0 auto" }}>
          <div style={{ fontFamily:"'Cormorant Garamond','Playfair Display',Georgia,serif",fontSize:"clamp(24px,6vw,38px)",fontWeight:700,fontStyle:"italic",lineHeight:1.15,letterSpacing:"-0.02em",color:"#F0EAD6",marginBottom:"10px" }}>{primaryLine}</div>
          <SecondaryTypewriter accent={accent} secondaryLine={secondaryLine} />
          <div style={{ display:"flex",gap:"10px",marginTop:"18px" }}>
            <Link to={button1Link} className="cta-gold" style={{ background:"#C8922A",border:"none",color:"#0C0B0F",fontSize:"9.5px",fontWeight:800,letterSpacing:"0.12em",padding:"11px 16px",cursor:"pointer",transition:"opacity 0.2s,transform 0.2s",whiteSpace:"nowrap",flex:1,textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{button1Text}</Link>
            <Link to={button2Link} className="cta-white" style={{ background:"#F0EAD6",border:"none",color:"#0C0B0F",fontSize:"9.5px",fontWeight:800,letterSpacing:"0.12em",padding:"11px 16px",cursor:"pointer",transition:"opacity 0.2s,transform 0.2s",whiteSpace:"nowrap",flex:1,textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{button2Text}</Link>
          </div>
        </div>

        {/* Card */}
        <div style={{ padding:"14px 10px 0",position:"relative",zIndex:10,flex:"0 0 auto" }}>
          <InfoCardContent book={book} accent={accent} cardVisible={cardVisible} onAcquire={handleAcquire} />
        </div>

        {/* Counter — 12px below card */}
        <div style={{ marginTop:"12px",display:"flex",justifyContent:"center",position:"relative",zIndex:10,flex:"0 0 auto" }}>
          <Counter />
        </div>

        {/* Row — 24px below counter */}
        <div style={{ marginTop:"24px",paddingBottom:"16px",display:"flex",justifyContent:"center",position:"relative",zIndex:10,flex:"0 0 auto" }}>
          <BookRow />
        </div>

        <div style={{ flex:"1 1 0",minHeight:"8px" }} />
        <h2 style={{ position:"absolute",width:"1px",height:"1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap" }}>Luxury rare books marketplace hero</h2>
      </div>
    );
  }

  // ── DESKTOP LAYOUT ──
  return (
    <div ref={containerRef} style={{
      position:"relative", width:"100%", height:"calc(100svh - var(--site-header-height, 0px))",
      background:"#0C0B0F", overflow:"hidden",
      fontFamily:"'Satoshi',system-ui,sans-serif",
    }}>
      <style>{sharedStyle}</style>
      <HexCanvas accentColor={accent} />

      {/* Grain */}
      <div style={{ position:"absolute",inset:0,opacity:0.35,mixBlendMode:"overlay",pointerEvents:"none",zIndex:10,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        animation:"grain 0.4s steps(2) infinite" }} />

      {/* Orbit SVG */}
      <svg style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:11 }}>
        <defs>
          <clipPath id="hc"><rect x="0" y="0" width="100%" height="100%" /></clipPath>
          <filter id="og"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        </defs>
        <circle cx={oCx} cy={oCy} r={oR} fill="none" stroke={accent} strokeWidth={orbitThick+36} strokeOpacity="0.04" clipPath="url(#hc)" style={{transition:"stroke 0.9s"}}/>
        <circle cx={oCx} cy={oCy} r={oR} fill="none" stroke={accent} strokeWidth={orbitThick+10} strokeOpacity="0.10" clipPath="url(#hc)" style={{transition:"stroke 0.9s"}}/>
        <circle cx={oCx} cy={oCy} r={oR} fill="none" stroke={accent} strokeWidth={orbitThick}   strokeOpacity="0.22" clipPath="url(#hc)" filter="url(#og)" style={{transition:"stroke 0.9s"}}/>
        <circle cx={oCx} cy={oCy} r={oR-orbitThick/2} fill="none" stroke={accentLight} strokeWidth="0.9" strokeOpacity="0.36" clipPath="url(#hc)" style={{transition:"stroke 0.9s"}}/>
        <circle cx={oCx} cy={oCy} r={oR+orbitThick/2} fill="none" stroke={accentLight} strokeWidth="0.5" strokeOpacity="0.18" clipPath="url(#hc)" style={{transition:"stroke 0.9s"}}/>
        {[...Array(24)].map((_,i)=>{
          const a=(i*360/24)*Math.PI/180;
          const r1=oR-orbitThick/2+5, r2=oR-orbitThick/2+(i%4===0?20:11);
          return <line key={i} x1={oCx+r1*Math.cos(a)} y1={oCy+r1*Math.sin(a)} x2={oCx+r2*Math.cos(a)} y2={oCy+r2*Math.sin(a)} stroke={accentLight} strokeWidth={i%4===0?"1.2":"0.6"} strokeOpacity={i%4===0?"0.40":"0.20"} clipPath="url(#hc)" style={{transition:"stroke 0.9s"}}/>;
        })}
      </svg>

      {/* Animated book */}
      <div style={{
        position:"absolute", left:bx, top:by,
        transform:`translate(-50%,-50%) rotate(${bookRotate}deg)`,
        opacity:bookOpacity, zIndex:12, pointerEvents:"none",
        transition:isPaused?"transform 0.65s cubic-bezier(0.34,1.56,0.64,1),width 0.35s ease,height 0.35s ease":"width 0.35s ease,height 0.35s ease",
        width:bookW, height:bookH,
        filter:isPaused?`drop-shadow(0 10px 38px ${accent}70) drop-shadow(0 0 16px ${accent}44)`:`drop-shadow(0 4px 14px ${accent}30)`,
      }}>
        <img src={book.cover} alt={book.title} style={{ width:"100%",height:"100%",objectFit:"cover",borderRadius:"2px",display:"block" }} />
        <div style={{ position:"absolute",left:0,top:0,width:"14px",height:"100%",background:`linear-gradient(90deg,${accent}55,transparent)`,borderRadius:"2px 0 0 2px" }} />
        {isPaused&&<div style={{ position:"absolute",inset:"-3px",border:`1px solid ${accent}60`,borderRadius:"2px",pointerEvents:"none",boxShadow:`0 0 18px ${accent}45`,transition:"border-color 0.9s,box-shadow 0.9s" }} />}
      </div>

      {/* ── LEFT: Headline + CTAs ── */}
      <div style={{ position:"absolute",left:"48px",top:"10px",zIndex:20,maxWidth:"460px",display:"flex",flexDirection:"column",gap:0 }}>
        <div style={{ width:"60px",height:"1px",marginBottom:"20px",background:accent,transition:"background 0.9s",boxShadow:`0 0 8px ${accent}60` }} />
        <div style={{ fontFamily:"'Cormorant Garamond','Playfair Display',Georgia,serif",fontSize:"clamp(26px,3.4vw,52px)",fontWeight:700,fontStyle:"italic",lineHeight:1.1,letterSpacing:"-0.025em",color:"#F0EAD6",marginBottom:"14px" }}>{primaryLine}</div>
        <SecondaryTypewriter accent={accent} secondaryLine={secondaryLine} />
        <div style={{ display:"flex",gap:"10px",marginTop:"28px" }}>
          <Link to={button1Link} className="cta-gold" style={{ background:"#C8922A",border:"none",color:"#0C0B0F",fontSize:"10px",fontWeight:800,letterSpacing:"0.14em",padding:"13px 22px",cursor:"pointer",transition:"opacity 0.2s,transform 0.2s",whiteSpace:"nowrap",textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{button1Text}</Link>
          <Link to={button2Link} className="cta-white" style={{ background:"#F0EAD6",border:"none",color:"#0C0B0F",fontSize:"10px",fontWeight:800,letterSpacing:"0.14em",padding:"13px 22px",cursor:"pointer",transition:"opacity 0.2s,transform 0.2s",whiteSpace:"nowrap",textDecoration:"none",display:"inline-flex",alignItems:"center",justifyContent:"center" }}>{button2Text}</Link>
        </div>
      </div>

      {/* ── CENTER: Card + Counter + Row — all simultaneous with book ── */}
      <div style={{
        position:"absolute",
        left:"50%", top:"8px",
        transform:"translateX(-50%)",
        zIndex:20, width:"300px",
        display:"flex", flexDirection:"column", alignItems:"center",
        gap:0,
      }}>
        {/* Card fades in/out in sync with book arrival/departure */}
        <div style={{ width:"100%" }}>
          <InfoCardContent book={book} accent={accent} cardVisible={cardVisible} onAcquire={handleAcquire} />
        </div>

        {/* Counter — 14px below card, also synced (opacity follows cardVisible) */}
        <div style={{
          marginTop:"14px",
          opacity:cardVisible?1:0,
          transform:cardVisible?"translateY(0)":"translateY(6px)",
          transition:"opacity 0.45s ease,transform 0.45s ease",
        }}>
          <Counter />
        </div>

        {/* Book row — 28px below counter, also synced */}
        <div style={{
          marginTop:"28px",
          opacity:cardVisible?1:0,
          transform:cardVisible?"translateY(0)":"translateY(6px)",
          transition:"opacity 0.45s ease 0.05s,transform 0.45s ease 0.05s",
        }}>
          <BookRow />
        </div>
      </div>

      <h2 style={{ position:"absolute",width:"1px",height:"1px",overflow:"hidden",clip:"rect(0,0,0,0)",whiteSpace:"nowrap" }}>Luxury rare books marketplace hero</h2>
    </div>
  );
}