import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// ── VS Code / Developer Dark Theme ──────────────────────────────────────────
// Palette: exactly what devs stare at all day
const T = {
  // backgrounds — VS Code layering
  bg:       "#1e1e1e",   // editor bg (Dark+)
  sidebar:  "#252526",   // sidebar bg
  surface:  "#2d2d2d",   // panels / cards
  elevated: "#333333",   // hover / slightly lifted
  border:   "#3e3e42",   // borders (VS Code separator)
  input:    "#3c3c3c",   // input fields

  // text — VS Code text colours
  textBright: "#d4d4d4", // primary text
  text:       "#cccccc", // body text
  muted:      "#858585", // comments / secondary
  faint:      "#5a5a5a", // very muted

  // syntax highlight colours — what devs love
  cyan:    "#4ec9b0",   // class names / teal
  blue:    "#569cd6",   // keywords
  purple:  "#c586c0",   // control flow / purple
  yellow:  "#dcdcaa",   // function names
  orange:  "#ce9178",   // strings
  green:   "#6a9955",   // comments / green
  red:     "#f44747",   // errors
  ltBlue:  "#9cdcfe",   // variables / light blue
  white:   "#d4d4d4",

  // accents
  accent:  "#4ec9b0",   // primary CTA — VS Code teal
  accent2: "#569cd6",   // secondary — VS Code blue
};

// ── Data ─────────────────────────────────────────────────────────────────────
const SKILLS = [
  { category: "Frontend",       color: T.ltBlue,  items: ["React","React Native","Expo","JavaScript","TypeScript"] },
  { category: "Backend",        color: T.yellow,  items: ["Node.js","Express","Django"] },
  { category: "Real-Time",      color: T.cyan,    items: ["Socket.IO"] },
  { category: "Infrastructure", color: T.purple,  items: ["Docker","Kubernetes","Redis"] },
  { category: "Other",          color: T.orange,  items: ["Authentication","Authorization","REST APIs","System Architecture"] },
];

const PROJECTS = [
  {
    id: 1, title: "Work Tracking Platform", tag: "Full-Stack",
    color: T.ltBlue, desc: "Advanced task and work tracking platform with real-time updates and role-based access.",
    long: "A comprehensive work management solution enabling teams to track tasks, manage workflows, and collaborate in real time. Features sophisticated role-based permissions, live Socket.IO updates, and a cross-platform experience through React web and React Native mobile apps.",
    features: ["JWT Authentication & Authorization","Real-time updates via Socket.IO","React web application","React Native + Expo mobile","Node.js + Express REST API","Role-based access control"],
    tech: ["React","React Native","Expo","Node.js","Express","Socket.IO","JWT"],
    arch: ["Client (React / React Native)","Express REST API","Socket.IO Server","PostgreSQL + Redis"],
    status: "Source available upon request",
    media: {
      items: [
        { type: "image", src: "/media/work-tracking/work-tracking1.jpg", label: "dashboard" },
        { type: "image", src: "/media/work-tracking/work-tracking2.jpg", label: "tasks view" },
        { type: "image", src: "/media/work-tracking/work-tracking3.jpg", label: "mobile app" },
        { type: "video", src: "/media/work-tracking/work-tracking.mp4", label: "demo" },
      ],
    },
  },
  {
    id: 2, title: "Education Platform", tag: "Full-Stack",
    color: T.cyan, desc: "Education platform where teachers upload lessons and students learn via web and mobile apps.",
    long: "A dual-workflow platform serving both educators and students. Teachers upload structured video lessons; students access them on any device. Includes real-time messaging, progress tracking, and seamless cross-platform support via React and Expo.",
    features: ["Video lesson upload & streaming","Real-time messaging system","Teacher and student workflows","Django REST backend","Express for live updates","Redis caching layer","React + Expo applications"],
    tech: ["React","Expo","Django","Express","Socket.IO","Redis","Python"],
    arch: ["Client (React / Expo)","Django REST API","Express Socket Server","Redis + PostgreSQL"],
    status: "Demo available",
    media: {
      items: [
        { type: "image", src: "/media/education-platform/education-platform1.jpg", label: "teacher portal" },
        { type: "image", src: "/media/education-platform/ecucation-platform2.jpg", label: "student view" },
        { type: "video", src: "/media/education-platform/education-platform.mp4", label: "demo" },
      ],
    },
  },
  {
    id: 3, title: "Invoicing & Business Platform", tag: "Full-Stack",
    color: T.purple, desc: "Multi-portal invoicing and workflow platform with automated invoice generation and order-to-delivery lifecycle.",
    long: "A sophisticated business operations platform featuring four portals: Customer, Staff, Admin, and Super Admin. Handles org onboarding approvals, automated invoice generation, and tracks orders through every delivery stage. Built for scale with Docker, Kubernetes, and Redis.",
    features: ["Customer, Staff, Admin, Super Admin portals","Organisation approval workflow","Automated invoice generation","Order-to-delivery lifecycle","Django + Express backend","Redis + Docker + Kubernetes","Role-based access system"],
    tech: ["Django","Express","Redis","Docker","Kubernetes","React","PostgreSQL"],
    arch: ["4 React Portals","Django REST API","Express Microservices","Redis + PostgreSQL","Docker / Kubernetes"],
    status: "Demo available",
    media: {
      items: [
        { type: "image", src: "/media/invoicing/invoicing-system1.jpg", label: "overview" },
        { type: "image", src: "/media/invoicing/invoicing.png", label: "customer portal" },
        { type: "image", src: "/media/invoicing/invoicing2.png", label: "staff portal" },
        { type: "image", src: "/media/invoicing/invoicing3.png", label: "admin portal" },
        { type: "image", src: "/media/invoicing/invoicing4.png", label: "super admin" },
        { type: "video", src: "/media/invoicing/invoicing-system.mp4", label: "demo" },
      ],
    },
  },
];

const STATS = [
  { v: "2+",   label: "Years Experience",  color: T.cyan   },
  { v: "3",    label: "Large Projects",    color: T.yellow },
  { v: "Web+", label: "Mobile Developer",  color: T.ltBlue },
  { v: "RT",   label: "Real-time Systems", color: T.purple },
];

const NAV = ["home","about","skills","projects","architecture","resume","contact"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}>
      {children}
    </motion.div>
  );
}

function Wrap({ children, style }) {
  return <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 24px", ...style }}>{children}</div>;
}

function Sec({ id, children, alt }) {
  return (
    <section id={id} style={{ padding: "96px 0", background: alt ? T.sidebar : T.bg }}>
      {children}
    </section>
  );
}

function SecHead({ title, sub }) {
  return (
    <FadeUp>
      <div style={{ marginBottom: 56, textAlign: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: 12, color: T.green, letterSpacing: "0.14em", marginBottom: 10 }}>
          // {sub}
        </p>
        <h2 style={{ fontFamily: "monospace", fontSize: "clamp(1.7rem,3.5vw,2.4rem)", fontWeight: 700, color: T.textBright, letterSpacing: "-0.01em", margin: 0 }}>
          {title}
        </h2>
        <div style={{ width: 40, height: 2, background: T.accent, margin: "18px auto 0", borderRadius: 99 }} />
      </div>
    </FadeUp>
  );
}

function Chip({ label, color }) {
  return (
    <span style={{
      fontFamily: "monospace", fontSize: 11, fontWeight: 600,
      padding: "2px 8px", borderRadius: 4,
      background: color + "1a", color, border: `1px solid ${color}38`,
    }}>{label}</span>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 30);
      for (let i = NAV.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV[i]);
        if (el && el.getBoundingClientRect().top <= 110) { setActive(NAV[i]); break; }
      }
    };
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const go = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setOpen(false); };

  return (
    <motion.nav initial={{ y: -56 }} animate={{ y: 0 }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 900,
        background: scrolled ? "rgba(30,30,30,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "none",
        transition: "all 0.25s",
      }}>
      <Wrap>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          {/* Logo */}
          <span onClick={() => go("home")} style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: T.yellow, cursor: "pointer", letterSpacing: "0.02em" }}>
            <span style={{ color: T.blue }}>const</span>{" "}
            <span style={{ color: T.ltBlue }}>dev</span>{" "}
            <span style={{ color: T.textBright }}>=</span>{" "}
            <span style={{ color: T.cyan }}>{`{portfolio}`}</span>
          </span>

          {/* Desktop links */}
          <div className="nav-desktop" style={{ display: "flex", gap: 2 }}>
            {NAV.map(id => (
              <button key={id} onClick={() => go(id)} style={{
                background: active === id ? T.elevated : "transparent",
                color: active === id ? T.textBright : T.muted,
                border: "none", padding: "5px 13px", borderRadius: 5, cursor: "pointer",
                fontFamily: "monospace", fontSize: 13, fontWeight: 600,
                transition: "all 0.15s",
                borderBottom: active === id ? `2px solid ${T.accent}` : "2px solid transparent",
              }}>{id}</button>
            ))}
          </div>

          {/* Mobile toggle */}
          <button className="nav-mobile" onClick={() => setOpen(o => !o)} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 5, padding: "5px 11px", cursor: "pointer", color: T.textBright, fontFamily: "monospace", fontSize: 18 }}>
            {open ? "×" : "≡"}
          </button>
        </div>
      </Wrap>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            style={{ background: "rgba(30,30,30,0.98)", borderTop: `1px solid ${T.border}`, padding: "14px 24px" }}>
            {NAV.map(id => (
              <button key={id} onClick={() => go(id)} style={{ display: "block", width: "100%", textAlign: "left", background: "transparent", border: "none", color: active === id ? T.accent : T.text, padding: "10px 0", fontFamily: "monospace", fontSize: 14, cursor: "pointer" }}>
                {id}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const lines = [
    { ln: "1",  tokens: [{ t: "// ", c: T.green }, { t: "Full-Stack Software Developer", c: T.green }] },
    { ln: "2",  tokens: [] },
    { ln: "3",  tokens: [{ t: "const ", c: T.blue }, { t: "developer", c: T.ltBlue }, { t: " = {", c: T.textBright }] },
    { ln: "4",  tokens: [{ t: "  name", c: T.ltBlue }, { t: ": ", c: T.textBright }, { t: '"Khaleel Hanafie"', c: T.orange }] },
    { ln: "5",  tokens: [{ t: "  role", c: T.ltBlue }, { t: ": ", c: T.textBright }, { t: '"Full-Stack Developer"', c: T.orange }] },
    { ln: "6",  tokens: [{ t: "  exp", c: T.ltBlue }, { t: ":  ", c: T.textBright }, { t: '"2+ years"', c: T.orange }] },
    { ln: "7",  tokens: [{ t: "  stack", c: T.ltBlue }, { t: ": [", c: T.textBright }, { t: '"React"', c: T.orange }, { t: ", ", c: T.textBright }, { t: '"Node"', c: T.orange }, { t: ", ", c: T.textBright }, { t: '"Django"', c: T.orange }, { t: "]", c: T.textBright }] },
    { ln: "8",  tokens: [{ t: "  platforms", c: T.ltBlue }, { t: ": [", c: T.textBright }, { t: '"web"', c: T.orange }, { t: ", ", c: T.textBright }, { t: '"mobile"', c: T.orange }, { t: "]", c: T.textBright }] },
    { ln: "9",  tokens: [{ t: "}", c: T.textBright }] },
    { ln: "10", tokens: [] },
    { ln: "11", tokens: [{ t: "export default ", c: T.blue }, { t: "developer", c: T.ltBlue }] },
  ];

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", background: T.bg, paddingTop: 56, position: "relative", overflow: "hidden" }}>
      {/* subtle grid bg */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: `linear-gradient(${T.border} 1px,transparent 1px),linear-gradient(90deg,${T.border} 1px,transparent 1px)`, backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <Wrap style={{ position: "relative", zIndex: 1, width: "100%", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 48, alignItems: "center", padding: "60px 24px" }}>
        {/* Left — text */}
        <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: T.surface, border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 12px", marginBottom: 28, fontFamily: "monospace", fontSize: 11, color: T.green }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.cyan, display: "inline-block" }} />
            available for opportunities
          </div>

          <h1 style={{ fontFamily: "monospace", fontSize: "clamp(2.2rem,5vw,3.6rem)", fontWeight: 700, color: T.textBright, lineHeight: 1.12, marginBottom: 18, letterSpacing: "-0.02em" }}>
            Hi, I'm a<br />
            <span style={{ color: T.cyan }}>Full-Stack</span><br />
            <span style={{ color: T.yellow }}>Developer</span>
          </h1>

          <p style={{ fontFamily: "monospace", fontSize: 13, color: T.muted, lineHeight: 1.85, maxWidth: 420, marginBottom: 36 }}>
            Software developer with approximately 2 years of experience building web and mobile applications, real-time systems, scalable backend services, and business platforms.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "view projects()",  color: T.cyan,   onClick: () => document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "contact.me()",     color: T.yellow, onClick: () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }) },
              { label: "resume.download()",color: T.purple, onClick: () => document.getElementById("resume")?.scrollIntoView({ behavior: "smooth" }) },
            ].map((b, i) => (
              <motion.button key={i} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }} onClick={b.onClick} style={{
                background: i === 0 ? b.color + "18" : "transparent",
                color: b.color, border: `1px solid ${b.color}50`,
                padding: "9px 18px", borderRadius: 5, fontFamily: "monospace", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                {b.label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right — code block */}
        <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", fontFamily: "monospace", fontSize: 13 }}>
            {/* tab bar */}
            <div style={{ background: T.sidebar, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: "#f44747" }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: T.yellow }} />
              <span style={{ width: 11, height: 11, borderRadius: "50%", background: T.cyan }} />
              <span style={{ marginLeft: 10, color: T.muted, fontSize: 11 }}>developer.ts</span>
            </div>
            {/* code */}
            <div style={{ padding: "18px 0" }}>
              {lines.map((line, li) => (
                <motion.div key={li} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + li * 0.07 }}
                  style={{ display: "flex", gap: 0, lineHeight: "22px", paddingLeft: 0, minHeight: 22 }}>
                  <span style={{ width: 42, textAlign: "right", paddingRight: 18, color: T.faint, userSelect: "none", flexShrink: 0 }}>{line.ln}</span>
                  <span>
                    {line.tokens.map((tk, ti) => (
                      <span key={ti} style={{ color: tk.c }}>{tk.t}</span>
                    ))}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </Wrap>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────────
function About() {
  return (
    <Sec id="about" alt>
      <Wrap>
        <SecHead title="About Me" sub="who I am" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
          <FadeUp>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 28 }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: T.green, marginBottom: 8 }}>// professional summary</p>
              <p style={{ color: T.text, fontSize: 14, lineHeight: 1.85, fontFamily: "monospace" }}>
                I build full-stack applications across web and mobile platforms with experience in{" "}
                <span style={{ color: T.ltBlue }}>React</span>,{" "}
                <span style={{ color: T.ltBlue }}>React Native</span>,{" "}
                <span style={{ color: T.ltBlue }}>Expo</span>,{" "}
                <span style={{ color: T.yellow }}>Node.js</span>,{" "}
                <span style={{ color: T.yellow }}>Django</span>,{" "}
                <span style={{ color: T.purple }}>Redis</span>,{" "}
                <span style={{ color: T.purple }}>Docker</span>,{" "}
                <span style={{ color: T.purple }}>Kubernetes</span>, authentication systems, and real-time architectures.
              </p>
              <p style={{ color: T.muted, fontSize: 13, lineHeight: 1.85, fontFamily: "monospace", marginTop: 14 }}>
                I thrive on engineering clean, scalable systems — from the database layer up to polished mobile interfaces — with a focus on reliability and real-world performance.
              </p>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {STATS.map((s, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <motion.div whileHover={{ scale: 1.04 }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "22px 16px", textAlign: "center" }}>
                  <div style={{ fontFamily: "monospace", fontSize: "1.7rem", fontWeight: 700, color: s.color }}>{s.v}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, marginTop: 6 }}>{s.label}</div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Wrap>
    </Sec>
  );
}

// ── Skills ────────────────────────────────────────────────────────────────────
function Skills() {
  return (
    <Sec id="skills">
      <Wrap>
        <SecHead title="Technical Skills" sub="what I work with" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(190px,1fr))", gap: 16 }}>
          {SKILLS.map((g, gi) => (
            <FadeUp key={gi} delay={gi * 0.07}>
              <motion.div whileHover={{ y: -5, borderColor: g.color + "60" }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 20, height: "100%", borderTop: `2px solid ${g.color}`, transition: "border-color 0.2s" }}>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: g.color, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 16 }}>
                  {g.category.toUpperCase()}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {g.items.map((item, ii) => (
                    <div key={ii}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: T.text }}>{item}</span>
                      </div>
                      <div style={{ height: 3, borderRadius: 99, background: T.elevated }}>
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${78 + (ii * 7 % 20)}%` }} viewport={{ once: true }} transition={{ delay: 0.3 + ii * 0.06, duration: 0.7, ease: "easeOut" }}
                          style={{ height: "100%", borderRadius: 99, background: g.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </Wrap>
    </Sec>
  );
}

function projectPoster(p) {
  return p.media?.items.find(i => i.type === "image")?.src;
}

function VideoModal({ p, videoSrc, onClose }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2100,
        background: "rgba(0,0,0,0.92)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "clamp(12px, 3vw, 28px)",
      }}
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        style={{
          width: "min(960px, 100%)",
          maxHeight: "calc(100vh - 24px)",
          display: "flex",
          flexDirection: "column",
          borderRadius: 10,
          overflow: "hidden",
          border: `1px solid ${T.border}`,
          boxShadow: "0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.04)",
        }}
      >
        <div style={{
          background: T.sidebar,
          borderBottom: `1px solid ${T.border}`,
          padding: "10px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f44747", flexShrink: 0 }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.yellow, flexShrink: 0 }} />
            <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.cyan, flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, marginLeft: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-demo.mp4
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 4,
              padding: "4px 10px", cursor: "pointer", color: T.muted,
              fontFamily: "monospace", fontSize: 11, flexShrink: 0, marginLeft: 12,
            }}
          >
            esc ×
          </button>
        </div>

        <div className="video-stage-wrap">
          <div className="video-stage">
            <video
              ref={videoRef}
              className="video-player"
              src={videoSrc}
              controls
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>
        </div>

        <div style={{
          padding: "10px 16px",
          background: T.surface,
          borderTop: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, color: T.faint }}>
            // {p.title} — {p.tag.toLowerCase()} demo
          </span>
          <Chip label={p.tag} color={p.color} />
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectMediaPreview({ item, p, poster, onPlayVideo, large }) {
  const h = large ? "auto" : "100%";
  if (item.type === "image") {
    return (
      <img
        src={item.src}
        alt={`${p.title} — ${item.label}`}
        style={{ width: "100%", height: h, aspectRatio: large ? "16/9" : undefined, objectFit: "cover", display: "block" }}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={onPlayVideo}
      style={{ position: "relative", width: "100%", height: h, aspectRatio: large ? "16/9" : undefined, padding: 0, border: "none", cursor: "pointer", background: "#0a0a0a", display: "block" }}
    >
      {poster && <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.45, display: "block" }} />}
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, background: "rgba(0,0,0,0.35)" }}>
        <span style={{ width: large ? 56 : 40, height: large ? 56 : 40, borderRadius: "50%", background: p.color + "dd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: large ? 20 : 14, color: T.bg }}>▶</span>
        {large && <span style={{ fontFamily: "monospace", fontSize: 11, color: T.textBright }}>// {item.label}</span>}
      </div>
    </button>
  );
}

function ProjectMediaStrip({ items, active, color, poster, onSelect }) {
  return (
    <div className="media-strip">
      {items.map((item, i) => (
        <button
          key={item.src}
          type="button"
          onClick={() => onSelect(i)}
          title={item.label}
          style={{
            padding: 0, flexShrink: 0, width: 72, height: 52,
            border: `2px solid ${active === i ? color : T.border}`,
            borderRadius: 5, overflow: "hidden", cursor: "pointer", background: T.bg,
            position: "relative",
          }}
        >
          {item.type === "image" ? (
            <img src={item.src} alt={item.label} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          ) : (
            <>
              {poster && <img src={poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.4, display: "block" }} />}
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.45)" }}>
                <span style={{ fontSize: 14, color: color }}>▶</span>
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}

function ProjectMediaGallery({ p, active, onSelect, onPlayVideo, large }) {
  if (!p.media?.items?.length) return null;
  const poster = projectPoster(p);
  const item = p.media.items[active] ?? p.media.items[0];
  return (
    <div>
      <div style={{ borderRadius: large ? 6 : 0, overflow: "hidden", border: large ? `1px solid ${T.border}` : "none", marginBottom: large ? 10 : 0, background: T.bg }}>
        <ProjectMediaPreview item={item} p={p} poster={poster} onPlayVideo={onPlayVideo} large={large} />
      </div>
      <ProjectMediaStrip items={p.media.items} active={active} color={p.color} poster={poster} onSelect={onSelect} />
      {large && (
        <p style={{ fontFamily: "monospace", fontSize: 10, color: T.faint, marginTop: 8, textAlign: "center" }}>
          // {item.label} · {active + 1}/{p.media.items.length}
        </p>
      )}
    </div>
  );
}

function ProjectCard({ p }) {
  const [details, setDetails] = useState(false);
  const [arch, setArch] = useState(false);
  const [video, setVideo] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);

  const openDetails = () => { setActiveMedia(0); setDetails(true); };
  const playVideo = () => {
    const vid = p.media?.items.find(i => i.type === "video");
    if (vid) setVideo(true);
  };
  const selectMedia = (i) => {
    setActiveMedia(i);
    if (p.media.items[i].type === "video") setVideo(true);
  };

  return (
    <>
      <FadeUp>
        <motion.div whileHover={{ y: -6, borderColor: p.color + "55" }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column", transition: "border-color 0.2s", borderTop: `2px solid ${p.color}` }}>
          {p.media?.items?.length > 0 && (
            <div style={{ borderBottom: `1px solid ${T.border}` }}>
              <div className="project-cover" style={{ position: "relative", aspectRatio: "16/9", background: T.bg }}>
                <ProjectMediaPreview
                  item={p.media.items[activeMedia]}
                  p={p}
                  poster={projectPoster(p)}
                  onPlayVideo={playVideo}
                />
              </div>
              <div style={{ padding: "8px 10px", background: T.bg }}>
                <ProjectMediaStrip items={p.media.items} active={activeMedia} color={p.color} poster={projectPoster(p)} onSelect={selectMedia} />
              </div>
            </div>
          )}
          <div style={{ padding: "22px 22px 0" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <h3 style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 15, color: p.color, margin: 0 }}>{p.title}</h3>
              <Chip label={p.tag} color={p.color} />
            </div>
            <p style={{ fontFamily: "monospace", fontSize: 12, color: T.muted, lineHeight: 1.75, marginBottom: 18 }}>{p.desc}</p>
          </div>

          {/* features */}
          <div style={{ padding: "0 22px", flex: 1 }}>
            <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 10 }}>// features</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 12px", marginBottom: 16 }}>
              {p.features.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 5, fontFamily: "monospace", fontSize: 11, color: T.muted }}>
                  <span style={{ color: p.color, flexShrink: 0 }}>›</span>{f}
                </div>
              ))}
            </div>
          </div>

          {/* tech */}
          <div style={{ padding: "0 22px", display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 20 }}>
            {p.tech.map((t, i) => <Chip key={i} label={t} color={p.color} />)}
          </div>

          {/* actions */}
          <div style={{ padding: "0 22px 22px", display: "flex", gap: 8 }}>
            <button onClick={openDetails} style={{ flex: 1, padding: "7px 0", borderRadius: 4, background: p.color + "15", border: `1px solid ${p.color}40`, color: p.color, fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>details()</button>
            <button onClick={() => setArch(true)} style={{ flex: 1, padding: "7px 0", borderRadius: 4, background: "transparent", border: `1px solid ${T.border}`, color: T.muted, fontFamily: "monospace", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>arch()</button>
            {p.media?.items.some(i => i.type === "video") && (
              <button onClick={playVideo} title="Watch demo" style={{ padding: "7px 12px", borderRadius: 4, background: p.color + "15", border: `1px solid ${p.color}40`, color: p.color, fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}>▶</button>
            )}
          </div>

          <div style={{ padding: "10px 22px", borderTop: `1px solid ${T.border}`, background: T.bg }}>
            <span style={{ fontFamily: "monospace", fontSize: 10, color: T.faint }}>// {p.status}</span>
          </div>
        </motion.div>
      </FadeUp>

      {/* Details modal */}
      <AnimatePresence>
        {details && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetails(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }} onClick={e => e.stopPropagation()}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 32, maxWidth: 640, width: "100%", maxHeight: "82vh", overflowY: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <h3 style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: p.color, margin: 0 }}>{p.title}</h3>
                <button onClick={() => setDetails(false)} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", color: T.muted, fontFamily: "monospace" }}>×</button>
              </div>
              {p.media?.items?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <ProjectMediaGallery
                    p={p}
                    active={activeMedia}
                    onSelect={selectMedia}
                    onPlayVideo={playVideo}
                    large
                  />
                </div>
              )}
              <p style={{ fontFamily: "monospace", fontSize: 12, color: T.muted, lineHeight: 1.85, marginBottom: 20 }}>{p.long}</p>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 10 }}>// all features</p>
              <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ fontFamily: "monospace", fontSize: 12, color: T.text, display: "flex", gap: 8 }}>
                    <span style={{ color: p.color }}>›</span>{f}
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: 20, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {p.tech.map((t, i) => <Chip key={i} label={t} color={p.color} />)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video modal */}
      <AnimatePresence>
        {video && p.media?.items.some(i => i.type === "video") && (
          <VideoModal
            p={p}
            videoSrc={p.media.items.find(i => i.type === "video").src}
            onClose={() => setVideo(false)}
          />
        )}
      </AnimatePresence>

      {/* Arch modal */}
      <AnimatePresence>
        {arch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setArch(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.93 }} animate={{ scale: 1 }} exit={{ scale: 0.93 }} onClick={e => e.stopPropagation()}
              style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 32, maxWidth: 400, width: "100%" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <p style={{ fontFamily: "monospace", fontSize: 13, color: T.textBright, fontWeight: 700, margin: 0 }}>// architecture</p>
                <button onClick={() => setArch(false)} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 4, padding: "4px 10px", cursor: "pointer", color: T.muted, fontFamily: "monospace" }}>×</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "stretch" }}>
                {p.arch.map((layer, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: "100%", background: i === 0 ? p.color + "20" : T.bg, border: `1px solid ${i === 0 ? p.color + "50" : T.border}`, borderRadius: 5, padding: "12px 16px", fontFamily: "monospace", fontSize: 12, color: i === 0 ? p.color : T.muted, textAlign: "center" }}>
                      {layer}
                    </div>
                    {i < p.arch.length - 1 && (
                      <div style={{ width: 1, height: 18, background: T.border }} />
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Projects ──────────────────────────────────────────────────────────────────
function Projects() {
  return (
    <Sec id="projects" alt>
      <Wrap>
        <SecHead title="Featured Projects" sub="what I've built — full-stack" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))", gap: 20 }}>
          {PROJECTS.map(p => <ProjectCard key={p.id} p={p} />)}
        </div>
      </Wrap>
    </Sec>
  );
}

// ── Architecture ──────────────────────────────────────────────────────────────
function Architecture() {
  const stack = [
    { label: "Client Apps",      sub: "React  ·  React Native  ·  Expo",     color: T.ltBlue  },
    { label: "API Services",     sub: "Node.js/Express  ·  Django REST",      color: T.yellow  },
    { label: "Real-Time",        sub: "Socket.IO  ·  WebSockets",             color: T.cyan    },
    { label: "Cache & Queue",    sub: "Redis",                                color: T.orange  },
    { label: "Database",         sub: "PostgreSQL",                           color: T.purple  },
  ];

  const cards = [
    { icon: "🔐", title: "Auth", desc: "JWT + role-based access across all portals" },
    { icon: "⚡", title: "Real-Time", desc: "Socket.IO live updates & notifications" },
    { icon: "👥", title: "Multi-Role", desc: "Customer · Staff · Admin · Super Admin" },
    { icon: "📈", title: "Scale", desc: "Docker + Kubernetes horizontal scaling" },
  ];

  return (
    <Sec id="architecture">
      <Wrap>
        <SecHead title="System Architecture" sub="how it fits together" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
          <FadeUp>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 28 }}>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 20 }}>// system_stack.ts</p>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "stretch", gap: 0 }}>
                {stack.map((l, i) => (
                  <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <motion.div whileHover={{ x: 4 }} style={{ width: "100%", background: l.color + "12", border: `1px solid ${l.color}35`, borderRadius: 5, padding: "12px 16px" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: l.color }}>{l.label}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: T.muted, marginTop: 3 }}>{l.sub}</div>
                    </motion.div>
                    {i < stack.length - 1 && (
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.6, repeat: Infinity, delay: i * 0.3 }} style={{ width: 1, height: 20, background: l.color + "60" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, alignContent: "start" }}>
            {cards.map((c, i) => (
              <FadeUp key={i} delay={i * 0.09}>
                <motion.div whileHover={{ scale: 1.04 }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 18 }}>
                  <div style={{ fontSize: 22, marginBottom: 10 }}>{c.icon}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: T.textBright, marginBottom: 6 }}>{c.title}</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, lineHeight: 1.6 }}>{c.desc}</div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </Wrap>
    </Sec>
  );
}

// ── Resume ────────────────────────────────────────────────────────────────────
function Resume() {
  const exp = [
    { period: "2023 – Present", role: "Full-Stack Developer", org: "Independent / Contract", desc: "Building production web and mobile applications — real-time platforms, enterprise tools, and cross-platform mobile apps." },
    { period: "2023", role: "Software Developer", org: "Project Work", desc: "Developed multiple large-scale applications including work tracking, education, and invoicing platforms." },
  ];

  return (
    <Sec id="resume" alt>
      <Wrap>
        <SecHead title="Resume" sub="experience & skills" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 28 }}>
          <FadeUp>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 16 }}>// experience[]</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {exp.map((e, i) => (
                  <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.cyan}`, borderRadius: "0 8px 8px 0", padding: "18px 20px" }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: T.cyan, marginBottom: 4 }}>{e.period}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: T.textBright, marginBottom: 2 }}>{e.role}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, marginBottom: 8 }}>{e.org}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, lineHeight: 1.7 }}>{e.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 16 }}>// skills[]</p>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 22, marginBottom: 18 }}>
                {SKILLS.map((g, i) => (
                  <div key={i} style={{ marginBottom: i < SKILLS.length - 1 ? 14 : 0 }}>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: g.color, fontWeight: 700, marginBottom: 7 }}>{g.category}</div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {g.items.map((item, ii) => <Chip key={ii} label={item} color={g.color} />)}
                    </div>
                  </div>
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }} style={{ width: "100%", padding: 14, borderRadius: 6, background: T.cyan + "18", border: `1px solid ${T.cyan}50`, color: T.cyan, fontFamily: "monospace", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                resume.download() →
              </motion.button>
            </div>
          </FadeUp>
        </div>
      </Wrap>
    </Sec>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const links = [
    { label: "email",  value: "khaleelhanafie188@gmail.com",  color: T.ltBlue, href: "mailto:khaleelhanafie188@gmail.com" },
    { label: "phone",  value: "+27 61 646 4116",             color: T.yellow, href: "tel:+27616464116" },
    { label: "github", value: "github.com/khaleel188",       color: T.cyan,   href: "https://github.com/khaleel188" },
  ];

  const inputStyle = { width: "100%", padding: "9px 12px", borderRadius: 4, background: T.input, border: `1px solid ${T.border}`, color: T.text, fontFamily: "monospace", fontSize: 12, outline: "none", boxSizing: "border-box" };

  return (
    <Sec id="contact">
      <Wrap>
        <SecHead title="Get In Touch" sub="let's connect" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 28 }}>
          <FadeUp>
            <div>
              <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 16 }}>// contact_info</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {links.map((l, i) => (
                  <motion.a key={i} href={l.href} target="_blank" rel="noopener noreferrer" whileHover={{ x: 6 }} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6, padding: "14px 18px", cursor: "pointer", display: "flex", gap: 14, alignItems: "center", textDecoration: "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: T.muted }}>{l.label}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: l.color, marginTop: 2 }}>{l.value}</div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.12}>
            <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 26 }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ fontSize: 36, marginBottom: 14, letterSpacing: 4 }}>😂 🤣 😆</div>
                  <p style={{ fontFamily: "monospace", fontSize: 13, color: T.text, lineHeight: 1.7, marginBottom: 18 }}>
                    // am kidding! if you want to message me, send an email to or find me at:
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
                    {links.map((l, i) => (
                      <motion.a key={i} href={l.href} target="_blank" rel="noopener noreferrer" whileHover={{ x: 4 }} style={{ background: T.input, border: `1px solid ${T.border}`, borderRadius: 5, padding: "10px 14px", textDecoration: "none", display: "flex", gap: 10, alignItems: "center" }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: l.color, flexShrink: 0 }} />
                        <div>
                          <span style={{ fontFamily: "monospace", fontSize: 10, color: T.muted }}>{l.label}: </span>
                          <span style={{ fontFamily: "monospace", fontSize: 11, color: l.color }}>{l.value}</span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 18 }}>// send_message()</p>
                  {[
                    { key: "name", type: "text" },
                    { key: "email", type: "email" },
                    { key: "message", type: "textarea" },
                  ].map(f => (
                    <div key={f.key} style={{ marginBottom: 14 }}>
                      <label style={{ display: "block", fontFamily: "monospace", fontSize: 10, color: T.muted, marginBottom: 5 }}>{f.key}:</label>
                      {f.type === "textarea"
                        ? <textarea rows={4} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ ...inputStyle, resize: "vertical" }} />
                        : <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle} />
                      }
                    </div>
                  ))}
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => setSent(true)} style={{ width: "100%", padding: 11, borderRadius: 5, background: T.cyan + "18", border: `1px solid ${T.cyan}50`, color: T.cyan, fontFamily: "monospace", fontSize: 12, fontWeight: 700, cursor: "pointer", marginTop: 4 }}>
                    send() →
                  </motion.button>
                </>
              )}
            </div>
          </FadeUp>
        </div>
      </Wrap>
    </Sec>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: T.sidebar, borderTop: `1px solid ${T.border}`, padding: "28px 24px" }}>
      <Wrap>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <span style={{ fontFamily: "monospace", fontSize: 12, color: T.faint }}>
            <span style={{ color: T.blue }}>const</span> <span style={{ color: T.ltBlue }}>year</span> = <span style={{ color: T.orange }}>{new Date().getFullYear()}</span>
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: T.faint }}>// built with React + Framer Motion</span>
          <div style={{ display: "flex", gap: 10 }}>
            {[T.ltBlue, T.yellow, T.cyan].map((c, i) => (
              <motion.button key={i} whileHover={{ scale: 1.15 }} style={{ background: T.elevated, border: `1px solid ${T.border}`, borderRadius: 4, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />
              </motion.button>
            ))}
          </div>
        </div>
      </Wrap>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { background: #1e1e1e; color: #cccccc; font-family: 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace; }
        ::selection { background: #264f78; color: #d4d4d4; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #1e1e1e; }
        ::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #4ec9b0; }
        button { font-family: inherit; }
        textarea, input { font-family: inherit; color: #cccccc; }
        textarea::placeholder, input::placeholder { color: #5a5a5a; }
        .nav-mobile { display: none; }
        .project-cover:hover .project-cover-play { opacity: 1 !important; }
        .media-strip {
          display: flex;
          gap: 6px;
          overflow-x: auto;
          padding-bottom: 2px;
          scrollbar-width: thin;
          scrollbar-color: #424242 transparent;
        }
        .media-strip::-webkit-scrollbar { height: 4px; }
        .media-strip::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
        .video-stage-wrap {
          flex: 1;
          min-height: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          padding: clamp(8px, 2vw, 16px);
        }
        .video-stage {
          width: min(100%, calc((100vh - 140px) * 16 / 9));
          max-height: calc(100vh - 140px);
          aspect-ratio: 16 / 9;
          background: #000;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid #2a2a2a;
          box-shadow: inset 0 0 0 1px rgba(255,255,255,0.03);
        }
        .video-player {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: contain;
          background: #000;
          outline: none;
        }
        .video-player::-webkit-media-controls-enclosure {
          border-radius: 0;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
        }
        @media(max-width:680px) {
          .video-stage {
            width: 100%;
            max-height: calc(100vh - 120px);
          }
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
        }
      `}</style>
      <Nav />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Architecture />
      <Resume />
      <Contact />
      <Footer />
    </>
  );
}
