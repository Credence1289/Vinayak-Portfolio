import { useState, useEffect, useRef, useCallback } from "react";

// ─── Content (recruiter-optimised) ────────────────────────────────────────────
const PROJECTS = [
  {
    id: 1,
    title: "PiggyBank — Savings API",
    tag: "Backend",
    tagline: "Goal-locked digital wallet with enforced business rules.",
    desc: "Built a REST API that lets users save toward a fixed goal and blocks withdrawals until the target is met — simulating real fintech guardrails. Migrated from in-memory storage to PostgreSQL with full transaction history.",
    stack: ["FastAPI", "SQLAlchemy", "PostgreSQL", "JWT", "Pydantic"],
    link: "https://github.com/Credence1289",
  },
  {
    id: 2,
    title: "FastBlog — Social Backend",
    tag: "Backend",
    tagline: "Secure, ownership-enforced social content API.",
    desc: "Designed a production-style backend with OAuth2 + bcrypt auth, relational user–post models, and strict ownership rules so users can only edit their own content. Built with modular architecture and dependency injection.",
    stack: ["FastAPI", "PostgreSQL", "JWT", "OAuth2", "bcrypt"],
    link: "https://github.com/Credence1289",
  },
  {
    id: 3,
    title: "Blog Platform — Full Stack",
    tag: "Full Stack",
    tagline: "End-to-end blog with auth and dynamic templates.",
    desc: "Delivered a complete blog from database to browser: user auth, profile management, CRUD posts, and responsive templates — using Django's full MVC stack with PostgreSQL persistence.",
    stack: ["Django", "PostgreSQL", "Python", "HTML", "CSS"],
    link: "https://github.com/Credence1289",
  },
];

const SKILL_GROUPS = [
  { label: "Languages",  items: ["Python", "SQL", "C++"] },
  { label: "Frameworks", items: ["FastAPI", "Django", "SQLAlchemy ORM", "Django ORM"] },
  { label: "Databases",  items: ["PostgreSQL", "MySQL"] },
  { label: "Auth & API", items: ["JWT", "OAuth2", "RESTful Design", "Swagger / OpenAPI"] },
  { label: "Tooling",    items: ["Git", "GitHub", "Docker", "Postman", "VS Code", "PyCharm"] },
  { label: "Concepts",   items: ["OOP", "System Design", "Dependency Injection", "CORS"] },
];

const TIMELINE = [
  {
    period: "Jun – Jul 2025",
    title: "Python Programming Intern",
    org: "InternPe · Remote",
    points: [
      "Solved backend-oriented problems covering data structures and modular design.",
      "Earned completion certificate through practical assignments.",
    ],
  },
];

const NAV_ITEMS = ["About", "Skills", "Projects", "Experience", "Contacts"];

// ─── useInView hook ────────────────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─── FadeUp wrapper ────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, style = {} }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(28px)",
      transition: `opacity 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1), transform 0.65s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─── Cursor ────────────────────────────────────────────────────────────────────
function Cursor() {
  const ref = useRef(null);
  const pos = useRef({ x: -100, y: -100 });
  const raf = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(pointer:coarse)").matches) return;
    const onMove = (e) => { pos.current = { x: e.clientX, y: e.clientY }; };
    window.addEventListener("mousemove", onMove);
    const tick = () => {
      if (ref.current) ref.current.style.transform = `translate(${pos.current.x - 4}px,${pos.current.y - 4}px)`;
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove", onMove); cancelAnimationFrame(raf.current); };
  }, []);
  return <div ref={ref} aria-hidden style={{ position:"fixed",top:0,left:0,zIndex:9999,width:8,height:8,borderRadius:"50%",background:"#fff",mixBlendMode:"difference",pointerEvents:"none",willChange:"transform" }} />;
}

// ─── Nav ───────────────────────────────────────────────────────────────────────
function Nav({ dark, setDark, active, scrollTo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const C = {
    bg: dark ? "rgba(8,8,10,0.88)" : "rgba(252,252,250,0.88)",
    border: dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    muted: dark ? "rgba(255,255,255,0.44)" : "rgba(0,0,0,0.4)",
    fg: dark ? "#fff" : "#0a0a0a",
  };

  return (
    <header style={{ position:"fixed",top:0,left:0,right:0,zIndex:100, borderBottom: scrolled ? `1px solid ${C.border}` : "1px solid transparent", backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none", background: scrolled ? C.bg : "transparent", transition:"all 0.3s" }}>
      <nav style={{ maxWidth:1080,margin:"0 auto",padding:"0 32px",height:60,display:"flex",alignItems:"center",justifyContent:"space-between" }} aria-label="Main navigation">
        <button onClick={() => scrollTo("about")} style={{ background:"none",border:"none",cursor:"pointer",fontFamily:"'Geist Mono',monospace",fontSize:15,fontWeight:600,color:C.fg,letterSpacing:"-0.02em" }}>
          VD<span style={{ color:"#10b981" }}>.</span>
        </button>

        {/* Desktop */}
        <ul style={{ display:"flex",gap:6,listStyle:"none",background: dark?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)", padding:"4px",borderRadius:999,border:`1px solid ${C.border}` }} className="nav-desktop">
          {NAV_ITEMS.map(n => (
            <li key={n}>
              <button onClick={() => scrollTo(n.toLowerCase())} style={{
                background: active===n ? (dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.08)") : "none",
                border:"none",cursor:"pointer",padding:"5px 14px",borderRadius:999,
                fontSize:13,color: active===n ? C.fg : C.muted,
                fontWeight: active===n ? 500 : 400,
                transition:"all 0.2s",letterSpacing:"-0.01em",
              }}>{n}</button>
            </li>
          ))}
        </ul>

        <div style={{ display:"flex",alignItems:"center",gap:8 }}>
          {/* Dark toggle */}
          <button onClick={() => setDark(d=>!d)} aria-label="Toggle theme" style={{ width:36,height:36,borderRadius:10,border:`1px solid ${C.border}`,background: dark?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.05)",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,transition:"all 0.2s" }}>
            {dark ? "○" : "●"}
          </button>
          {/* Hamburger */}
          <button onClick={() => setOpen(o=>!o)} className="nav-mobile" aria-label="Menu" style={{ width:36,height:36,borderRadius:10,border:`1px solid ${C.border}`,background:"none",cursor:"pointer",color:C.fg,fontSize:16,display:"none",alignItems:"center",justifyContent:"center" }}>
            {open ? "✕" : "≡"}
          </button>
        </div>
      </nav>

      {open && (
        <div style={{ padding:"16px 32px 24px",borderTop:`1px solid ${C.border}`,background: dark?"#08080a":"#fcfcfa",display:"flex",flexDirection:"column",gap:2 }}>
          {NAV_ITEMS.map(n => (
            <button key={n} onClick={() => { scrollTo(n.toLowerCase()); setOpen(false); }} style={{ background:"none",border:"none",cursor:"pointer",textAlign:"left",padding:"10px 0",fontSize:16,color: active===n ? "#10b981" : C.muted,fontWeight: active===n ? 600 : 400 }}>
              {n}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}

// ─── Section label ─────────────────────────────────────────────────────────────
function Label({ text }) {
  return <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:"#10b981",marginBottom:12 }}>{text}</p>;
}

// ─── Project Card ──────────────────────────────────────────────────────────────
function Card({ p, dark }) {
  const [hover, setHover] = useState(false);
  const C = {
    border: dark ? (hover?"rgba(16,185,129,0.35)":"rgba(255,255,255,0.08)") : (hover?"rgba(16,185,129,0.35)":"rgba(0,0,0,0.08)"),
    bg: dark ? (hover?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.02)") : (hover?"rgba(0,0,0,0.03)":"rgba(0,0,0,0.015)"),
    muted: dark?"rgba(255,255,255,0.5)":"rgba(0,0,0,0.46)",
    pill: dark?"rgba(255,255,255,0.07)":"rgba(0,0,0,0.06)",
  };
  return (
    <article onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{ borderRadius:16,border:`1px solid ${C.border}`,background:C.bg,padding:"28px 28px 24px",display:"flex",flexDirection:"column",gap:0,transition:"border-color 0.25s,background 0.25s,box-shadow 0.25s",boxShadow: hover?(dark?"0 8px 32px rgba(0,0,0,0.4)":"0 8px 32px rgba(0,0,0,0.08)"):"none",cursor:"default" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20 }}>
        <span style={{ fontFamily:"'Geist Mono',monospace",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:"#10b981",background:"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.2)",padding:"3px 10px",borderRadius:999 }}>
          {p.tag}
        </span>
        <a href={p.link} target="_blank" rel="noopener noreferrer" aria-label={`${p.title} on GitHub`} style={{ width:32,height:32,borderRadius:8,border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"center",color:C.muted,textDecoration:"none",fontSize:14,opacity: hover?1:0.5,transition:"opacity 0.2s,transform 0.2s",transform: hover?"translate(1px,-1px)":"none" }}>
          ↗
        </a>
      </div>

      <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:11,color:"rgba(16,185,129,0.7)",marginBottom:6,letterSpacing:"0.02em" }}>{p.tagline}</p>
      <h3 style={{ fontSize:18,fontWeight:600,marginBottom:12,lineHeight:1.25,letterSpacing:"-0.02em" }}>{p.title}</h3>
      <p style={{ fontSize:13.5,lineHeight:1.7,color:C.muted,marginBottom:20,flex:1 }}>{p.desc}</p>

      <div style={{ display:"flex",flexWrap:"wrap",gap:6,marginTop:"auto" }}>
        {p.stack.map(s => <span key={s} style={{ fontSize:11,fontFamily:"'Geist Mono',monospace",padding:"3px 10px",borderRadius:6,background:C.pill,color:C.muted }}>{s}</span>)}
      </div>
    </article>
  );
}

// ─── Skill pill ────────────────────────────────────────────────────────────────
function SkillPill({ text, dark }) {
  const [hover, setHover] = useState(false);
  return (
    <span onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} style={{ fontSize:13,fontFamily:"'Geist Mono',monospace",padding:"6px 14px",borderRadius:8,border:`1px solid ${hover?"rgba(16,185,129,0.4)":(dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)")}`,background: hover?"rgba(16,185,129,0.07)":(dark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.03)"),color: hover?"#10b981":"inherit",transition:"all 0.18s",cursor:"default",display:"inline-block" }}>
      {text}
    </span>
  );
}

// ─── Timeline item ─────────────────────────────────────────────────────────────
function TimelineItem({ item, dark, last }) {
  const C = { muted: dark?"rgba(255,255,255,0.46)":"rgba(0,0,0,0.42)", border: dark?"rgba(255,255,255,0.1)":"rgba(0,0,0,0.1)" };
  return (
    <div style={{ display:"flex",gap:20 }}>
      <div style={{ display:"flex",flexDirection:"column",alignItems:"center",paddingTop:4 }}>
        <div style={{ width:10,height:10,borderRadius:"50%",background:"#10b981",flexShrink:0,boxShadow:"0 0 0 3px rgba(16,185,129,0.15)" }} />
        {!last && <div style={{ width:1,flex:1,background:C.border,marginTop:8,marginBottom:0 }} />}
      </div>
      <div style={{ paddingBottom: last?0:36 }}>
        <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:11,color:"#10b981",letterSpacing:"0.06em",marginBottom:5 }}>{item.period}</p>
        <h3 style={{ fontSize:16,fontWeight:600,letterSpacing:"-0.02em",marginBottom:4 }}>{item.title}</h3>
        <p style={{ fontSize:13,color:C.muted,marginBottom: item.points.length?12:0 }}>{item.org}</p>
        {item.points.map(pt => (
          <p key={pt} style={{ fontSize:13,color:C.muted,paddingLeft:14,position:"relative",marginBottom:3,lineHeight:1.6 }}>
            <span style={{ position:"absolute",left:0,color:"#10b981",fontSize:10,top:4 }}>▸</span>{pt}
          </p>
        ))}
      </div>
    </div>
  );
}

// ─── Contact Card ─────────────────────────────────────────────────────────────
function ContactCard({ icon, label, value, href, dark, border, surfaceBg, muted }) {
  const [hover, setHover] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display:"flex", flexDirection:"column", gap:10,
        padding:"22px 22px 20px",
        borderRadius:14,
        border:`1px solid ${hover ? "rgba(16,185,129,0.35)" : border}`,
        background: hover ? "rgba(16,185,129,0.05)" : surfaceBg,
        textDecoration:"none", color:"inherit",
        transition:"border-color 0.2s, background 0.2s, transform 0.2s, box-shadow 0.2s",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? (dark?"0 8px 24px rgba(0,0,0,0.35)":"0 8px 24px rgba(0,0,0,0.07)") : "none",
        cursor:"pointer",
      }}
    >
      <span style={{ fontSize:20, lineHeight:1 }}>{icon}</span>
      <div>
        <p style={{ fontFamily:"'Geist Mono',monospace", fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", color:"#10b981", marginBottom:4 }}>{label}</p>
        <p style={{ fontSize:13, color: hover ? (dark?"#fff":"#0a0a0a") : muted, lineHeight:1.45, whiteSpace:"pre-line", transition:"color 0.2s" }}>{value}</p>
      </div>
      <span style={{ fontFamily:"'Geist Mono',monospace", fontSize:11, color:"#10b981", opacity: hover?1:0, transition:"opacity 0.2s", marginTop:"auto" }}>Open ↗</span>
    </a>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark]   = useState(true);
  const [active, setActive] = useState("About");
  const [ready, setReady]  = useState(false);

  useEffect(() => { setTimeout(() => setReady(true), 80); }, []);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY + 80;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_ITEMS[i].toLowerCase());
        if (el && el.offsetTop <= y) { setActive(NAV_ITEMS[i]); break; }
      }
    };
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });
  }, []);

  const bg   = dark ? "#08080a" : "#fafaf8";
  const fg   = dark ? "#f0f0ee" : "#0a0a0a";
  const muted = dark ? "rgba(255,255,255,0.46)" : "rgba(0,0,0,0.42)";
  const border = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const surfaceBg = dark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)";
  const W = 1080;

  return (
    <div style={{ background:bg,color:fg,minHeight:"100vh",fontFamily:"'Geist','DM Sans',system-ui,sans-serif",transition:"background 0.35s,color 0.35s",overflowX:"hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth;-webkit-font-smoothing:antialiased}
        ::selection{background:rgba(16,185,129,0.25)}
        input,textarea{font-family:inherit;color:inherit}
        input::placeholder,textarea::placeholder{opacity:0.35}
        @keyframes fadeUp{from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:none}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        .nav-desktop{display:flex!important}
        .nav-mobile{display:none!important}
        @media(max-width:680px){
          .nav-desktop{display:none!important}
          .nav-mobile{display:flex!important}
        }
      `}</style>

      <Cursor />
      <Nav dark={dark} setDark={setDark} active={active} scrollTo={scrollTo} />

      <main style={{ maxWidth:W,margin:"0 auto",padding:"0 32px" }}>

        {/* ── HERO ── */}
        <section id="about" style={{ minHeight:"100svh",display:"flex",flexDirection:"column",justifyContent:"center",paddingTop:100,paddingBottom:80,position:"relative" }}>
          <div style={{ opacity: ready?1:0, transform: ready?"none":"translateY(24px)", transition:"opacity 0.8s cubic-bezier(0.22,1,0.36,1),transform 0.8s cubic-bezier(0.22,1,0.36,1)" }}>

            {/* Status badge */}
            <div style={{ display:"inline-flex",alignItems:"center",gap:8,background: dark?"rgba(16,185,129,0.08)":"rgba(16,185,129,0.1)",border:"1px solid rgba(16,185,129,0.25)",borderRadius:999,padding:"6px 14px",marginBottom:48 }}>
              <span style={{ width:7,height:7,borderRadius:"50%",background:"#10b981",boxShadow:"0 0 6px #10b981",animation:"blink 2.4s ease-in-out infinite",display:"inline-block" }} />
              <span style={{ fontFamily:"'Geist Mono',monospace",fontSize:12,color:"#10b981",letterSpacing:"0.06em" }}>Available for internships & junior roles</span>
            </div>

            <h1 style={{ fontSize:"clamp(44px,7.5vw,88px)",fontWeight:700,lineHeight:1.02,letterSpacing:"-0.04em",marginBottom:24 }}>
              Backend engineer<br />
              <span style={{ color:"#10b981" }}>who ships.</span>
            </h1>

            <p style={{ maxWidth:520,fontSize:"clamp(15px,2vw,17px)",lineHeight:1.75,color:muted,marginBottom:16,fontWeight:300 }}>
              I'm <strong style={{ color:fg,fontWeight:500 }}>Vinayak Dewoolkar</strong> — a final-year engineering student from Mumbai building
              production-ready APIs with FastAPI and PostgreSQL. I care about clean architecture,
              solid auth, and code that other engineers actually enjoy reading.
            </p>
            <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:13,color:"rgba(16,185,129,0.7)",marginBottom:48,letterSpacing:"0.02em" }}>
              Atharva College of Engineering · BE Electronics & Telecom · 2026
            </p>

            <div style={{ display:"flex",flexWrap:"wrap",gap:10,marginBottom:48 }}>
              <button onClick={()=>scrollTo("projects")} style={{ padding:"12px 28px",borderRadius:12,background:"#10b981",color:"#021a10",border:"none",cursor:"pointer",fontSize:14,fontWeight:600,letterSpacing:"-0.01em",transition:"opacity 0.2s,transform 0.15s" }}
                onMouseEnter={e=>{e.currentTarget.style.opacity=0.85;e.currentTarget.style.transform="translateY(-1px)"}}
                onMouseLeave={e=>{e.currentTarget.style.opacity=1;e.currentTarget.style.transform="none"}}>
                See my work →
              </button>
              <button onClick={()=>scrollTo("contact")} style={{ padding:"12px 28px",borderRadius:12,background:surfaceBg,color:fg,border:`1px solid ${border}`,cursor:"pointer",fontSize:14,fontWeight:500,letterSpacing:"-0.01em",display:"inline-flex",alignItems:"center",transition:"border-color 0.2s" }}
                onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(16,185,129,0.4)"}
                onMouseLeave={e=>e.currentTarget.style.borderColor=border}>
                Contacts
              </button>
            </div>

            <div style={{ display:"flex",flexWrap:"wrap",gap:6 }}>
              {[
                ["↗ GitHub","https://github.com/Credence1289"],
                ["↗ LinkedIn","http://www.linkedin.com/in/vinayak-dewoolkar-180b21256"],
                ["↗ Instagram","https://www.instagram.com/vinayak_1289_/"],
                ["✉ dewoolkar.vinayak@gmail.com","https://mail.google.com/mail/?view=cm&to=dewoolkar.vinayak@gmail.com"],
              ].map(([label,href])=>(
                <a key={label} href={href} target="_blank" rel="noopener noreferrer" style={{ fontFamily:"'Geist Mono',monospace",fontSize:12,color:muted,textDecoration:"none",padding:"5px 10px",borderRadius:8,border:`1px solid transparent`,transition:"all 0.18s" }}
                  onMouseEnter={e=>{e.currentTarget.style.color="#10b981";e.currentTarget.style.borderColor="rgba(16,185,129,0.25)"}}
                  onMouseLeave={e=>{e.currentTarget.style.color=muted;e.currentTarget.style.borderColor="transparent"}}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position:"absolute",bottom:32,left:"50%",transform:"translateX(-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:6,color:muted }} aria-hidden>
            <div style={{ width:1,height:40,background:`linear-gradient(to bottom, transparent, ${muted})`,animation:"none" }} />
            <span style={{ fontFamily:"'Geist Mono',monospace",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase" }}>scroll</span>
          </div>
        </section>

        {/* ── SKILLS ── */}
        <section id="skills" style={{ paddingTop:96,paddingBottom:96 }}>
          <FadeUp>
            <Label text="Expertise" />
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:700,letterSpacing:"-0.03em",marginBottom:56 }}>
              My toolkit
            </h2>
          </FadeUp>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:32 }}>
            {SKILL_GROUPS.map((g,i)=>(
              <FadeUp key={g.label} delay={i*0.07}>
                <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",color:"#10b981",marginBottom:14 }}>{g.label}</p>
                <div style={{ display:"flex",flexWrap:"wrap",gap:7 }}>
                  {g.items.map(item=><SkillPill key={item} text={item} dark={dark} />)}
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── PROJECTS ── */}
        <section id="projects" style={{ paddingTop:96,paddingBottom:96 }}>
          <FadeUp>
            <Label text="Work" />
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:700,letterSpacing:"-0.03em",marginBottom:16 }}>
              Selected projects
            </h2>
            <p style={{ fontSize:15,color:muted,marginBottom:56,maxWidth:480,lineHeight:1.65 }}>
              Every project was built end-to-end: schema design, business logic, auth, and tested APIs.
            </p>
          </FadeUp>

          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:16 }}>
            {PROJECTS.map((p,i)=>(
              <FadeUp key={p.id} delay={i*0.1}>
                <Card p={p} dark={dark} />
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── EXPERIENCE ── */}
        <section id="experience" style={{ paddingTop:96,paddingBottom:96 }}>
          <FadeUp>
            <Label text="Background" />
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:700,letterSpacing:"-0.03em",marginBottom:56 }}>
              Experience & education
            </h2>
          </FadeUp>

          <div style={{ maxWidth:600 }}>
            {TIMELINE.map((item,i)=>(
              <FadeUp key={item.title} delay={i*0.1}>
                <TimelineItem item={item} dark={dark} last={i===TIMELINE.length-1} />
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section style={{ paddingTop:0,paddingBottom:96 }}>
          <FadeUp>
            <div style={{ borderLeft:`3px solid #10b981`,paddingLeft:28,maxWidth:680 }}>
              <p style={{ fontSize:"clamp(19px,2.8vw,26px)",fontWeight:300,lineHeight:1.65,letterSpacing:"-0.02em",fontStyle:"italic",color: dark?"rgba(255,255,255,0.75)":"rgba(0,0,0,0.65)",marginBottom:16 }}>
                "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
              </p>
              <p style={{ fontFamily:"'Geist Mono',monospace",fontSize:12,color:"#10b981",letterSpacing:"0.06em" }}>— Martin Fowler</p>
            </div>
          </FadeUp>
        </section>

        {/* ── CONTACTS ── */}
        <section id="contact" style={{ paddingTop:0,paddingBottom:120 }}>
          <FadeUp>
            <Label text="Contacts" />
            <h2 style={{ fontSize:"clamp(28px,4vw,42px)",fontWeight:700,letterSpacing:"-0.03em",marginBottom:16 }}>
              Let's talk
            </h2>
            <p style={{ fontSize:15,color:muted,marginBottom:48,maxWidth:460,lineHeight:1.75 }}>
              Open to backend internships and junior roles. Reach out on any platform — I reply within a day.
            </p>
          </FadeUp>

          <FadeUp delay={0.08}>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,maxWidth:720 }}>
              {[
                { icon:"✉", label:"Email", value:"dewoolkar.vinayak\n@gmail.com", href:"https://mail.google.com/mail/?view=cm&to=dewoolkar.vinayak@gmail.com" },
                { icon:"⌥", label:"GitHub", value:"Credence1289", href:"https://github.com/Credence1289" },
                { icon:"ld", label:"LinkedIn", value:"vinayak-dewoolkar", href:"http://www.linkedin.com/in/vinayak-dewoolkar-180b21256" },
                { icon:"in", label:"Instagram", value:"vinayak_1289_", href:"https://www.instagram.com/vinayak_1289_/" },
                { icon:"☎", label:"Phone", value:"+91 99672 95157", href:"tel:+919967295157" },
              ].map(({ icon, label, value, href }) => (
                <ContactCard key={label} icon={icon} label={label} value={value} href={href} dark={dark} border={border} surfaceBg={surfaceBg} muted={muted} />
              ))}
            </div>
          </FadeUp>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${border}`,padding:"28px 32px" }}>
        <div style={{ maxWidth:W,margin:"0 auto",display:"flex",flexWrap:"wrap",alignItems:"center",justifyContent:"space-between",gap:16,fontFamily:"'Geist Mono',monospace",fontSize:12,color:muted,letterSpacing:"0.02em" }}>
          <span>© 2026 Vinayak Dewoolkar</span>
          <div style={{ display:"flex",gap:20 }}>
            {[["GitHub","https://github.com/Credence1289"],["LinkedIn","http://www.linkedin.com/in/vinayak-dewoolkar-180b21256"]].map(([l,h])=>(
              <a key={l} href={h} target="_blank" rel="noopener noreferrer" style={{ color:"inherit",textDecoration:"none",transition:"color 0.18s" }}
                onMouseEnter={e=>e.target.style.color="#10b981"}
                onMouseLeave={e=>e.target.style.color=muted}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
