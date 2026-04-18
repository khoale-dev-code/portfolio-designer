import { motion, useMotionValue, useSpring, useTransform, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

const projects = [
  {
    number: "01",
    title: "Key Visual Sự Kiện Khoa",
    category: "Graphic Design · Event",
    description:
      "Thiết kế bộ nhận diện truyền thông cho sự kiện cấp Khoa tại HUFI — bao gồm poster, backdrop, banner và các ấn phẩm in ấn đồng bộ.",
    tags: ["Illustrator", "Photoshop"],
    accent: "#3b82f6",
    accentRgb: "59,130,246",
    year: "2024",
  },
  {
    number: "02",
    title: "UI Design App Học Phần",
    category: "UI/UX · Mobile",
    description:
      "Thiết kế giao diện ứng dụng học phần cho sinh viên — wireframe, design system, prototype hoàn chỉnh với Figma.",
    tags: ["Figma", "UI/UX"],
    accent: "#a855f7",
    accentRgb: "168,85,247",
    year: "2024",
  },
  {
    number: "03",
    title: "Thiết Kế Menu Nhà Hàng",
    category: "Graphic Design · Print",
    description:
      "Menu và bộ nhận diện thương hiệu cho quán tại Y-Mart — typography tinh tế, màu sắc nhất quán, in offset chất lượng cao.",
    tags: ["Illustrator", "Photoshop"],
    accent: "#10b981",
    accentRgb: "16,185,129",
    year: "2023",
  },
  {
    number: "04",
    title: "Đồ Họa Social Media",
    category: "Graphic Design · Digital",
    description:
      "Bộ template và content đồ họa cho mạng xã hội tại TAGO ĐÌ ZAI NƠ — nhất quán thương hiệu, tối ưu engagement.",
    tags: ["Photoshop", "CapCut"],
    accent: "#f97316",
    accentRgb: "249,115,22",
    year: "2023",
  },
];

/* ── Scanline overlay ── */
function ScanlineOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.025]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)",
      }}
    />
  );
}

/* ── Floating noise grain ── */
function FilmGrain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 opacity-[0.06] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: "repeat",
        backgroundSize: "128px 128px",
      }}
      animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
      transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ── Magnetic cursor blob ── */
function CursorBlob() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const springX = useSpring(x, { stiffness: 60, damping: 20 });
  const springY = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const move = (e) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed z-30 rounded-full mix-blend-screen"
      style={{
        width: 500,
        height: 500,
        left: springX,
        top: springY,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)",
      }}
    />
  );
}

/* ── Animated counter ── */
function Counter({ value, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = parseInt(value, 10);
    const duration = 800;
    const step = (duration / end);
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start >= end) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span>{String(count).padStart(2, "0")}</span>;
}

/* ── Horizontal marquee on hover ── */
function HoverMarquee({ text, accent }) {
  const [hovered, setHovered] = useState(false);
  const items = Array(6).fill(text);
  return (
    <div
      className="overflow-hidden h-5 relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={hovered ? { x: "-50%" } : { x: 0 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        style={{ color: accent }}
      >
        {[...items, ...items].map((t, i) => (
          <span key={i} className="text-[10px] font-semibold uppercase tracking-widest opacity-70">
            {t} ·
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ── Individual Project Card ── */
function ProjectCard({ p, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [hovered, setHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), { stiffness: 150, damping: 20 });

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }
  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    setHovered(false);
  }

  /* Stagger clip-path reveal */
  const clipReveal = {
    hidden: { clipPath: "inset(0 100% 0 0)", opacity: 0 },
    visible: {
      clipPath: "inset(0 0% 0 0)",
      opacity: 1,
      transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 },
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={clipReveal}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      style={{ perspective: 1000 }}
      className="group relative"
    >
      {/* ── Ghost number (parallax) ── */}
      <motion.span
        className="absolute -left-4 -top-6 select-none font-black text-[7rem] leading-none pointer-events-none z-0"
        style={{
          color: `rgba(${p.accentRgb},0.04)`,
          rotateX,
          rotateY,
          translateZ: -60,
        }}
      >
        {p.number}
      </motion.span>

      {/* ── Main card ── */}
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative cursor-pointer"
      >
        {/* Glowing border */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none z-0"
          style={{
            background: `linear-gradient(135deg, rgba(${p.accentRgb},0.4), transparent 60%)`,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
            padding: 1,
            borderRadius: "1.5rem",
          }}
        />

        <div
          className="relative z-10 rounded-3xl overflow-hidden"
          style={{
            background: "rgba(8,8,8,0.9)",
            border: `1px solid rgba(${p.accentRgb}, ${hovered ? 0.35 : 0.08})`,
            transition: "border-color 0.4s ease",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Spotlight sweep on hover */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 50% 50%, rgba(${p.accentRgb},0.08) 0%, transparent 65%)`,
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Horizontal accent line top */}
          <motion.div
            className="absolute top-0 left-0 h-[1px]"
            style={{ background: `rgba(${p.accentRgb},0.7)` }}
            initial={{ width: 0 }}
            animate={inView ? { width: "30%" } : { width: 0 }}
            transition={{ duration: 0.8, delay: i * 0.12 + 0.4, ease: [0.16, 1, 0.3, 1] }}
          />

          <div className="p-7 md:p-10">
            {/* ── Top row ── */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                {/* Animated number */}
                <span
                  className="font-black text-5xl md:text-6xl leading-none tabular-nums"
                  style={{ color: `rgba(${p.accentRgb}, ${hovered ? 0.9 : 0.25})`, transition: "color 0.4s" }}
                >
                  <Counter value={p.number} inView={inView} />
                </span>

                {/* Vertical divider */}
                <motion.div
                  className="w-[1px] self-stretch"
                  style={{ background: `rgba(${p.accentRgb},0.2)` }}
                  initial={{ scaleY: 0 }}
                  animate={inView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 + 0.3 }}
                />

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] mb-1"
                    style={{ color: `rgba(${p.accentRgb},0.6)` }}>
                    {p.category}
                  </p>
                  <HoverMarquee text={p.category} accent={`rgba(${p.accentRgb},0.5)`} />
                </div>
              </div>

              {/* Year badge */}
              <span
                className="text-[10px] font-mono font-semibold px-2 py-1 rounded-md border"
                style={{
                  color: `rgba(${p.accentRgb},0.7)`,
                  borderColor: `rgba(${p.accentRgb},0.2)`,
                  background: `rgba(${p.accentRgb},0.06)`,
                }}
              >
                {p.year}
              </span>
            </div>

            {/* ── Title ── */}
            <div className="mb-5 overflow-hidden">
              <motion.h3
                className="text-2xl md:text-4xl font-black italic text-white leading-tight tracking-tight"
                initial={{ y: 60 }}
                animate={inView ? { y: 0 } : { y: 60 }}
                transition={{ duration: 0.7, delay: i * 0.12 + 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                {p.title}
              </motion.h3>
            </div>

            {/* ── Bottom row ── */}
            <div className="flex flex-col md:flex-row md:items-end gap-5 md:gap-10">
              <motion.p
                className="text-white/50 text-sm md:text-base font-light leading-relaxed flex-1 max-w-2xl"
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.12 + 0.45 }}
              >
                {p.description}
              </motion.p>

              <div className="flex items-center gap-3 flex-shrink-0">
                {/* Tags */}
                {p.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-3 py-1.5 rounded-full"
                    style={{
                      color: `rgba(${p.accentRgb},0.8)`,
                      background: `rgba(${p.accentRgb},0.08)`,
                      border: `1px solid rgba(${p.accentRgb},0.15)`,
                    }}
                  >
                    {tag}
                  </span>
                ))}

                {/* Arrow CTA */}
                <motion.div
                  className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                  style={{
                    background: hovered ? `rgba(${p.accentRgb},1)` : "rgba(255,255,255,0.05)",
                    border: `1px solid rgba(${p.accentRgb}, ${hovered ? 1 : 0.2})`,
                    transition: "background 0.4s ease, border-color 0.4s ease",
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={hovered ? { x: [0, 20, -20, 0], y: [0, -20, 20, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <ArrowUpRight
                      size={18}
                      className="transition-colors duration-300"
                      style={{ color: hovered ? "#000" : "#fff" }}
                    />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Glowing drop shadow ── */}
      <motion.div
        className="absolute inset-0 rounded-3xl -z-10 pointer-events-none"
        style={{
          boxShadow: `0 32px 80px -20px rgba(${p.accentRgb},0.25)`,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      />
    </motion.div>
  );
}

/* ── Header word reveal ── */
function CinematicTitle({ text }) {
  const words = text.split(" ");
  return (
    <h2 className="text-4xl md:text-5xl lg:text-7xl font-black italic text-white tracking-tight leading-[0.88] flex flex-wrap gap-x-4">
      {words.map((word, i) => (
        <span key={i} className="overflow-hidden inline-block">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", rotate: 3 }}
            whileInView={{ y: 0, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}

/* ── Progress bar ── */
function ScrollProgressBar() {
  const [prog, setProg] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop / (el.scrollHeight - el.clientHeight);
      setProg(Math.min(scrolled * 100, 100));
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/5">
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"
        style={{ width: `${prog}%` }}
      />
    </div>
  );
}

/* ── Main Export ── */
export default function ProjectsSection() {
  return (
    <>
      <ScanlineOverlay />
      <FilmGrain />
      <CursorBlob />
      <ScrollProgressBar />

      <section id="projects" className="relative py-28 px-6 md:px-16 max-w-6xl mx-auto">
        {/* Ambient background orbs */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
          <motion.div
            className="absolute rounded-full blur-[120px]"
            style={{ width: 600, height: 600, top: -100, left: -200, background: "rgba(59,130,246,0.04)" }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute rounded-full blur-[120px]"
            style={{ width: 500, height: 500, bottom: -100, right: -100, background: "rgba(168,85,247,0.04)" }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
        </div>

        {/* ── Section Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-20">
          <div className="flex flex-col gap-5">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="self-start flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5"
            >
              {/* Blinking dot */}
              <motion.span
                className="w-1.5 h-1.5 rounded-full bg-white"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white">
                Selected Work
              </span>
            </motion.div>

            <CinematicTitle text="Tác phẩm tiêu biểu." />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:max-w-xs"
          >
            <p className="text-white/40 font-light text-sm leading-relaxed">
              Dấu ấn sáng tạo qua từng dự án thực tế.
            </p>
            {/* Thin accent line */}
            <motion.div
              className="mt-3 h-[1px] bg-gradient-to-r from-white/20 to-transparent"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </motion.div>
        </div>

        {/* ── Project Cards ── */}
        <div className="flex flex-col gap-6">
          {projects.map((p, i) => (
            <ProjectCard key={i} p={p} i={i} />
          ))}
        </div>

        {/* ── Footer line ── */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="mt-20 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-left"
        />
      </section>
    </>
  );
}