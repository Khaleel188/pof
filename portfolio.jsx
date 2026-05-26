import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { jsPDF } from "jspdf";

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

const RESUME = {
  name: "Khaleel Hanafie",
  title: "Full-Stack Software Developer",
  email: "khaleelhanafie188@gmail.com",
  phone: "+27 61 646 4116",
  github: "github.com/khaleel188",
  linkedin: "linkedin.com/in/khaleel-hanafie-a857b040b",
  linkedinUrl: "https://www.linkedin.com/in/khaleel-hanafie-a857b040b/",
  location: "South Africa",
  summary: "Software developer with 2+ years of experience building full-stack web and mobile applications, real-time systems, scalable backend services, and business platforms. Proficient across React, React Native, Node.js, Django, and cloud-native infrastructure.",
  experience: [
    {
      period: "2023 – Present",
      role: "Full-Stack Developer",
      org: "Independent / Contract",
      points: [
        "Built production web and mobile applications with real-time features and role-based access control.",
        "Delivered cross-platform solutions using React, React Native, Expo, Node.js, and Django.",
        "Designed scalable architectures with Redis, Docker, Kubernetes, and PostgreSQL.",
      ],
    },
    {
      period: "2023",
      role: "Software Developer",
      org: "Project Work",
      points: [
        "Developed work tracking, education, and invoicing platforms end-to-end.",
        "Implemented JWT authentication, Socket.IO live updates, and multi-portal workflows.",
      ],
    },
  ],
  projects: PROJECTS.map(p => ({
    title: p.title,
    desc: p.desc,
    tech: p.tech.slice(0, 6).join(" · "),
  })),
};

function downloadResumePdf() {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const w = doc.internal.pageSize.getWidth();
  const m = 16;
  const contentW = w - m * 2;
  let y = m;

  const rule = (yy) => {
    doc.setDrawColor(220, 220, 220);
    doc.line(m, yy, w - m, yy);
  };

  const ensureSpace = (need) => {
    if (y + need > 285) { doc.addPage(); y = m; }
  };

  const sectionTitle = (title) => {
    ensureSpace(14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(title.toUpperCase(), m, y);
    y += 2;
    rule(y);
    y += 6;
  };

  const bodyText = (text, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, contentW - indent);
    ensureSpace(lines.length * 5 + 2);
    doc.text(lines, m + indent, y);
    y += lines.length * 5 + 3;
  };

  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(20, 20, 20);
  doc.text(RESUME.name, m, y);
  y += 9;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(0, 120, 100);
  doc.text(RESUME.title, m, y);
  y += 7;

  doc.setFontSize(9);
  doc.setTextColor(90, 90, 90);
  doc.text(`${RESUME.email}  |  ${RESUME.phone}  |  ${RESUME.github}  |  ${RESUME.linkedin}`, m, y);
  y += 8;
  rule(y);
  y += 8;

  sectionTitle("Professional Summary");
  bodyText(RESUME.summary);

  sectionTitle("Experience");
  RESUME.experience.forEach((job) => {
    ensureSpace(28);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    doc.setTextColor(30, 30, 30);
    doc.text(job.role, m, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 120, 100);
    doc.text(job.period, w - m, y, { align: "right" });
    y += 5;
    doc.setFontSize(9.5);
    doc.setTextColor(100, 100, 100);
    doc.text(job.org, m, y);
    y += 6;
    job.points.forEach((pt) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const lines = doc.splitTextToSize(`• ${pt}`, contentW - 4);
      ensureSpace(lines.length * 4.8 + 1);
      doc.text(lines, m + 2, y);
      y += lines.length * 4.8 + 1.5;
    });
    y += 3;
  });

  sectionTitle("Featured Projects");
  RESUME.projects.forEach((p) => {
    ensureSpace(16);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(p.title, m, y);
    y += 5;
    bodyText(p.desc, 0);
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(110, 110, 110);
    ensureSpace(5);
    doc.text(p.tech, m, y);
    y += 7;
  });

  sectionTitle("Technical Skills");
  SKILLS.forEach((g) => {
    ensureSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text(`${g.category}:`, m, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text(g.items.join(", "), m + 28, y);
    y += 6;
  });

  doc.save("Khaleel-Hanafie-Resume.pdf");
}

function DownloadResumeButton({ full, style }) {
  const [loading, setLoading] = useState(false);
  const handleClick = () => {
    setLoading(true);
    try { downloadResumePdf(); }
    finally { setTimeout(() => setLoading(false), 600); }
  };
  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      disabled={loading}
      style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: full ? "100%" : "auto",
        padding: full ? "13px 20px" : "9px 18px",
        borderRadius: 6,
        background: loading ? T.elevated : T.cyan + "18",
        border: `1px solid ${T.cyan}55`,
        color: T.cyan,
        fontFamily: "monospace",
        fontSize: full ? 13 : 12,
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
        opacity: loading ? 0.7 : 1,
        ...style,
      }}
    >
      {loading ? "// generating..." : full ? "↓  download resume.pdf" : "resume.download()"}
    </motion.button>
  );
}

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
              { label: "view projects()",   color: T.cyan,   action: "projects" },
              { label: "contact.me()",      color: T.yellow, action: "contact" },
              { label: "resume.download()", color: T.purple, action: "download" },
            ].map((b, i) => (
              <motion.button key={i} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => b.action === "download" ? downloadResumePdf() : document.getElementById(b.action)?.scrollIntoView({ behavior: "smooth" })}
                style={{
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
        padding: "max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right)) max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left))",
      }}
      className="modal-overlay modal-overlay--video"
    >
      <motion.div
        initial={{ scale: 0.96, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 16 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={e => e.stopPropagation()}
        className="modal-panel modal-panel--video"
        style={{
          width: "min(960px, 100%)",
          maxHeight: "calc(100dvh - 24px)",
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
  if (item.type === "image") {
    return (
      <img
        className={large ? "media-preview-img media-preview-img--large" : "media-preview-img"}
        src={item.src}
        alt={`${p.title} — ${item.label}`}
        loading="lazy"
        decoding="async"
      />
    );
  }
  return (
    <button
      type="button"
      className={large ? "media-preview-video media-preview-video--large" : "media-preview-video"}
      onClick={onPlayVideo}
      aria-label={`Play ${p.title} demo video`}
    >
      {poster && <img src={poster} alt="" className="media-preview-video-poster" loading="lazy" />}
      <div className="media-preview-video-overlay">
        <span className="media-play-btn" style={{ background: p.color + "dd" }}>▶</span>
        {large && <span className="media-preview-video-label">// {item.label}</span>}
      </div>
    </button>
  );
}

function ProjectMediaStrip({ items, active, color, poster, onSelect }) {
  return (
    <div className="media-strip-wrap">
      <div className="media-strip-fade media-strip-fade--left" aria-hidden />
      <div className="media-strip" role="tablist" aria-label="Project media">
        {items.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-label={item.type === "video" ? `Play ${item.label} video` : `View ${item.label}`}
            onClick={() => onSelect(i)}
            className={`media-thumb${active === i ? " media-thumb--active" : ""}`}
            style={{ "--thumb-accent": color }}
          >
            {item.type === "image" ? (
              <img src={item.src} alt="" className="media-thumb-img" loading="lazy" />
            ) : (
              <>
                {poster && <img src={poster} alt="" className="media-thumb-img media-thumb-img--dim" loading="lazy" />}
                <div className="media-thumb-video-badge">
                  <span>▶</span>
                  <span className="media-thumb-label">video</span>
                </div>
              </>
            )}
          </button>
        ))}
      </div>
      <div className="media-strip-fade media-strip-fade--right" aria-hidden />
    </div>
  );
}

function ProjectMediaGallery({ p, active, onSelect, onPlayVideo, large }) {
  if (!p.media?.items?.length) return null;
  const poster = projectPoster(p);
  const item = p.media.items[active] ?? p.media.items[0];
  return (
    <div className="media-gallery">
      <div className={`media-gallery-frame${large ? " media-gallery-frame--large" : ""}`}>
        <ProjectMediaPreview item={item} p={p} poster={poster} onPlayVideo={onPlayVideo} large={large} />
      </div>
      <ProjectMediaStrip items={p.media.items} active={active} color={p.color} poster={poster} onSelect={onSelect} />
      <p className="media-gallery-meta">
        // {item.label} · {active + 1}/{p.media.items.length}
        {item.type === "video" ? " · tap ▶ to play" : ""}
      </p>
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
            <div className="project-media-block">
              <div className="project-cover media-gallery-frame">
                <ProjectMediaPreview
                  item={p.media.items[activeMedia]}
                  p={p}
                  poster={projectPoster(p)}
                  onPlayVideo={playVideo}
                />
              </div>
              <div className="project-media-strip-bar">
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "4px 12px", marginBottom: 16 }}>
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
          <motion.div className="modal-overlay modal-overlay--details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDetails(false)}>
            <motion.div className="modal-panel modal-panel--details" initial={{ scale: 0.93, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.93 }} onClick={e => e.stopPropagation()}>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))", gap: 20 }}>
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
  const contactItems = [
    { label: "email", value: RESUME.email, href: `mailto:${RESUME.email}`, color: T.ltBlue },
    { label: "phone", value: RESUME.phone, href: `tel:${RESUME.phone.replace(/\s/g, "")}`, color: T.yellow },
    { label: "github", value: RESUME.github, href: `https://${RESUME.github}`, color: T.cyan },
    { label: "linkedin", value: RESUME.linkedin, href: RESUME.linkedinUrl, color: T.blue },
    { label: "location", value: RESUME.location, color: T.purple },
  ];

  return (
    <Sec id="resume" alt>
      <Wrap>
        <SecHead title="Resume" sub="experience · skills · download" />

        {/* Profile header card */}
        <FadeUp>
          <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 10, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ background: T.sidebar, padding: "10px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#f44747" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.yellow }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: T.cyan }} />
              <span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, marginLeft: 6 }}>Khaleel-Hanafie-Resume.pdf</span>
            </div>
            <div className="resume-header-grid" style={{ padding: "28px 28px 24px", display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center" }}>
              <div style={{ width: 72, height: 72, borderRadius: 10, background: `linear-gradient(135deg, ${T.cyan}33, ${T.purple}33)`, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: T.cyan, flexShrink: 0 }}>
                KH
              </div>
              <div style={{ minWidth: 0 }}>
                <h3 style={{ fontFamily: "monospace", fontSize: "clamp(1.2rem,2.5vw,1.6rem)", fontWeight: 700, color: T.textBright, margin: "0 0 4px" }}>{RESUME.name}</h3>
                <p style={{ fontFamily: "monospace", fontSize: 13, color: T.cyan, margin: "0 0 14px" }}>{RESUME.title}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {contactItems.map((c, i) => (
                    c.href ? (
                      <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "monospace", fontSize: 10, color: c.color, background: c.color + "12", border: `1px solid ${c.color}35`, borderRadius: 4, padding: "4px 10px", textDecoration: "none" }}>
                        {c.label}: {c.value}
                      </a>
                    ) : (
                      <span key={i} style={{ fontFamily: "monospace", fontSize: 10, color: c.color, background: c.color + "12", border: `1px solid ${c.color}35`, borderRadius: 4, padding: "4px 10px" }}>
                        {c.label}: {c.value}
                      </span>
                    )
                  ))}
                </div>
              </div>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 8, alignItems: "stretch" }}>
                <DownloadResumeButton />
                <button type="button" onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })} style={{ padding: "9px 18px", borderRadius: 6, background: "transparent", border: `1px solid ${T.border}`, color: T.muted, fontFamily: "monospace", fontSize: 11, cursor: "pointer" }}>
                  contact.me()
                </button>
              </div>
            </div>
          </div>
        </FadeUp>

        <div className="resume-columns" style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1fr)", gap: 24 }}>
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <FadeUp delay={0.05}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24 }}>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 12 }}>// professional_summary</p>
                <p style={{ fontFamily: "monospace", fontSize: 13, color: T.text, lineHeight: 1.85, margin: 0 }}>{RESUME.summary}</p>
              </div>
            </FadeUp>

            <FadeUp delay={0.1}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 14 }}>// experience[]</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {RESUME.experience.map((e, i) => (
                    <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.cyan}`, borderRadius: "0 8px 8px 0", padding: "20px 22px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                        <div style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 700, color: T.textBright }}>{e.role}</div>
                        <div style={{ fontFamily: "monospace", fontSize: 10, color: T.cyan, background: T.cyan + "12", border: `1px solid ${T.cyan}30`, borderRadius: 4, padding: "3px 8px", flexShrink: 0 }}>{e.period}</div>
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, marginBottom: 12 }}>{e.org}</div>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                        {e.points.map((pt, pi) => (
                          <li key={pi} style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, lineHeight: 1.65, display: "flex", gap: 8 }}>
                            <span style={{ color: T.cyan, flexShrink: 0 }}>›</span>{pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>

            <FadeUp delay={0.15}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 14 }}>// featured_projects[]</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {RESUME.projects.map((p, i) => (
                    <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 18px" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 13, fontWeight: 700, color: PROJECTS[i]?.color ?? T.ltBlue, marginBottom: 4 }}>{p.title}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 11, color: T.muted, lineHeight: 1.65, marginBottom: 8 }}>{p.desc}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: T.faint }}>{p.tech}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeUp>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <FadeUp delay={0.08}>
              <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: 24, position: "sticky", top: 80 }}>
                <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 16 }}>// technical_skills[]</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {SKILLS.map((g, i) => (
                    <div key={i}>
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: g.color, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 8 }}>{g.category.toUpperCase()}</div>
                      <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                        {g.items.map((item, ii) => <Chip key={ii} label={item} color={g.color} />)}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
                  <p style={{ fontFamily: "monospace", fontSize: 10, color: T.green, marginBottom: 12 }}>// highlights</p>
                  {STATS.map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < STATS.length - 1 ? `1px solid ${T.border}` : "none" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: T.muted }}>{s.label}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: s.color }}>{s.v}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 24 }}>
                  <DownloadResumeButton full />
                  <p style={{ fontFamily: "monospace", fontSize: 9, color: T.faint, textAlign: "center", marginTop: 10 }}>
                    PDF · A4 · print-ready
                  </p>
                </div>
              </div>
            </FadeUp>
          </div>
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
    { label: "github",   value: "github.com/khaleel188",                         color: T.cyan,   href: "https://github.com/khaleel188" },
    { label: "linkedin", value: "linkedin.com/in/khaleel-hanafie-a857b040b",     color: T.blue,   href: "https://www.linkedin.com/in/khaleel-hanafie-a857b040b/" },
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

        /* ── Project media ── */
        .project-media-block {
          border-bottom: 1px solid #3e3e42;
          background: #0d0d0d;
        }
        .project-media-strip-bar {
          padding: 10px 12px 12px;
          background: #1e1e1e;
        }
        .media-gallery { width: 100%; }
        .media-gallery-frame {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          min-height: 160px;
          background: #0a0a0a;
          overflow: hidden;
        }
        .media-gallery-frame--large {
          border-radius: 8px;
          border: 1px solid #3e3e42;
          margin-bottom: 12px;
        }
        .media-preview-img,
        .media-preview-video {
          width: 100%;
          height: 100%;
          display: block;
        }
        .media-preview-img {
          object-fit: contain;
          object-position: center;
          background: #0a0a0a;
        }
        .media-preview-video {
          position: relative;
          padding: 0;
          border: none;
          cursor: pointer;
          background: #0a0a0a;
        }
        .media-preview-video-poster {
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          opacity: 0.5;
          display: block;
        }
        .media-preview-video-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(0,0,0,0.4);
        }
        .media-play-btn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #1e1e1e;
          box-shadow: 0 4px 20px rgba(0,0,0,0.45);
        }
        .media-preview-video--large .media-play-btn {
          width: 56px;
          height: 56px;
          font-size: 20px;
        }
        .media-preview-video-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: #d4d4d4;
        }
        .media-gallery-meta {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: #5a5a5a;
          text-align: center;
          margin: 10px 0 0;
          padding: 0 4px;
        }
        .media-strip-wrap {
          position: relative;
        }
        .media-strip {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          touch-action: pan-x;
          scroll-snap-type: x mandatory;
          scroll-padding: 12px;
          padding: 4px 12px 6px;
          scrollbar-width: thin;
          scrollbar-color: #424242 transparent;
        }
        .media-strip::-webkit-scrollbar { height: 5px; }
        .media-strip::-webkit-scrollbar-thumb { background: #424242; border-radius: 4px; }
        .media-strip-fade {
          position: absolute;
          top: 0;
          bottom: 6px;
          width: 20px;
          pointer-events: none;
          z-index: 1;
        }
        .media-strip-fade--left {
          left: 0;
          background: linear-gradient(90deg, #1e1e1e 0%, transparent 100%);
        }
        .media-strip-fade--right {
          right: 0;
          background: linear-gradient(270deg, #1e1e1e 0%, transparent 100%);
        }
        .project-media-strip-bar .media-strip-fade--left {
          background: linear-gradient(90deg, #1e1e1e 0%, transparent 100%);
        }
        .project-media-strip-bar .media-strip-fade--right {
          background: linear-gradient(270deg, #1e1e1e 0%, transparent 100%);
        }
        .media-thumb {
          flex: 0 0 auto;
          scroll-snap-align: start;
          width: 88px;
          height: 58px;
          min-width: 88px;
          padding: 0;
          border: 2px solid #3e3e42;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          background: #0a0a0a;
          position: relative;
          transition: border-color 0.15s, transform 0.15s;
          -webkit-tap-highlight-color: transparent;
        }
        .media-thumb:active { transform: scale(0.96); }
        .media-thumb--active {
          border-color: var(--thumb-accent, #4ec9b0);
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--thumb-accent, #4ec9b0) 40%, transparent);
        }
        .media-thumb-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top center;
          display: block;
        }
        .media-thumb-img--dim { opacity: 0.35; }
        .media-thumb-video-badge {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          background: rgba(0,0,0,0.5);
          font-size: 14px;
          color: var(--thumb-accent, #4ec9b0);
        }
        .media-thumb-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 8px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          opacity: 0.9;
        }

        /* ── Modals ── */
        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: max(16px, env(safe-area-inset-top)) max(16px, env(safe-area-inset-right)) max(16px, env(safe-area-inset-bottom)) max(16px, env(safe-area-inset-left));
        }
        .modal-overlay--details { background: rgba(0,0,0,0.8); }
        .modal-panel--details {
          background: #2d2d2d;
          border: 1px solid #3e3e42;
          border-radius: 10px;
          padding: 28px;
          max-width: 680px;
          width: 100%;
          max-height: min(90dvh, 900px);
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
        }

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
          width: min(100%, calc((100dvh - 140px) * 16 / 9));
          max-height: calc(100dvh - 140px);
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

        @media (max-width: 680px) {
          .media-gallery-frame { min-height: 200px; aspect-ratio: 16 / 10; }
          .media-thumb {
            width: 76px;
            height: 52px;
            min-width: 76px;
            min-height: 48px;
          }
          .media-play-btn { width: 48px; height: 48px; }
          .project-media-strip-bar { padding: 10px 8px 12px; }
          .modal-overlay--details {
            align-items: flex-end;
            padding: 0;
          }
          .modal-panel--details {
            max-height: 92dvh;
            border-radius: 12px 12px 0 0;
            padding: 20px 16px max(20px, env(safe-area-inset-bottom));
            border-bottom: none;
          }
          .modal-overlay--video { padding: 0; align-items: stretch; }
          .modal-panel--video {
            width: 100% !important;
            max-height: 100dvh !important;
            height: 100dvh;
            border-radius: 0 !important;
            border: none !important;
          }
          .video-stage-wrap { padding: 8px; flex: 1; }
          .video-stage {
            width: 100%;
            max-height: none;
            flex: 1;
            aspect-ratio: auto;
            min-height: 0;
            border-radius: 4px;
          }
          .video-player { max-height: calc(100dvh - 100px); }
          .resume-header-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          .resume-header-grid > div:first-child { margin: 0 auto; }
          .resume-header-grid > div:last-child { width: 100%; }
          .resume-columns { grid-template-columns: 1fr !important; }
          .nav-desktop { display: none !important; }
          .nav-mobile { display: block !important; }
        }

        @media (max-width: 400px) {
          .media-gallery-frame { min-height: 180px; }
          .media-thumb { width: 68px; height: 48px; min-width: 68px; }
          .media-gallery-meta { font-size: 9px; }
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
