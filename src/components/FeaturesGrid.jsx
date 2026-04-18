import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { Zap, Palette, BarChart3, Shield } from "lucide-react";
import BlurText from "./BlurText";

const cards = [
  {
    icon: Palette,
    title: "Adobe Suite",
    pct: 80,
    body: "Thành thạo Illustrator, Photoshop, Figma với tốc độ và độ chính xác cao trong từng dự án.",
    accent: "80,140,255",
  },
  {
    icon: Zap,
    title: "Triển khai nhanh",
    pct: 92,
    body: "Ý tưởng thành phẩm trong thời gian ngắn nhất. Không chờ đợi — không trì hoãn.",
    accent: "255,200,80",
  },
  {
    icon: BarChart3,
    title: "Thiết kế chiến lược",
    pct: 75,
    body: "Mỗi quyết định thiết kế đều có lý do. Phân tích và triển khai dự án hiệu quả.",
    accent: "80,220,160",
  },
  {
    icon: Shield,
    title: "Đáng tin cậy",
    pct: 97,
    body: "Luôn phối hợp chặt chẽ với khách hàng và team. Cam kết chất lượng cao nhất.",
    accent: "200,130,255",
  },
];

const skills = [
  { name: "Illustrator", pct: 80, color: "255,120,60" },
  { name: "Photoshop",   pct: 80, color: "50,160,255" },
  { name: "Figma",       pct: 80, color: "160,100,255" },
  { name: "CapCut",      pct: 60, color: "255,80,120" },
];

/* ── Animated radial arc (replaces flat bar) ── */
function ArcProgress({ pct, color, size = 56, stroke = 3.5 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div ref={ref} style={{ width: size, height: size }} className="relative flex-shrink-0">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`rgba(${color},0.12)`}
          strokeWidth={stroke}
        />
        {/* Fill */}
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none"
          stroke={`rgba(${color},0.85)`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={inView ? { strokeDashoffset: circ - dash } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 4px rgba(${color},0.6))` }}
        />
      </svg>
      {/* Percent label */}
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold"
        style={{ color: `rgba(${color},0.9)` }}
      >
        {pct}
      </span>
    </div>
  );
}

/* ── 3D tilt card ── */
function SkillCard({ card, i }) {
  const [hovered, setHovered] = useState(false);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const cardRef = useRef(null);
  const inView = useInView(cardRef, { once: true, margin: "-60px" });

  const rx = useSpring(0, { stiffness: 180, damping: 22 });
  const ry = useSpring(0, { stiffness: 180, damping: 22 });

  const handleMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rx.set(ny * -8);
    ry.set(nx * 8);
  };

  const handleLeave = () => {
    rx.set(0);
    ry.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, filter: "blur(12px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.85, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 800 }}
      className="group"
    >
      <motion.div
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        className="relative rounded-3xl overflow-hidden cursor-default h-full"
      >
        {/* Border beam */}
        <motion.div
          className="absolute inset-[-150%] z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(from 0deg, transparent 70%, rgba(${card.accent},0.5), transparent)`,
          }}
        />

        {/* Card surface */}
        <div
          className="relative z-10 p-[1px] rounded-3xl h-full"
          style={{
            background: hovered
              ? `linear-gradient(135deg, rgba(${card.accent},0.25), rgba(${card.accent},0.04))`
              : "rgba(255,255,255,0.04)",
          }}
        >
          <div
            className="rounded-[calc(1.5rem-1px)] p-7 flex flex-col gap-5 h-full transition-colors duration-500"
            style={{
              background: "#0a0a0f",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Icon + Arc side by side */}
            <div className="flex items-center justify-between">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                style={{
                  background: `rgba(${card.accent},0.1)`,
                  border: `1px solid rgba(${card.accent},0.2)`,
                  boxShadow: hovered ? `0 0 20px rgba(${card.accent},0.2)` : "none",
                }}
              >
                <card.icon
                  strokeWidth={1.5}
                  size={22}
                  style={{ color: `rgba(${card.accent},0.9)` }}
                />
              </div>
              <ArcProgress pct={card.pct} color={card.accent} size={52} stroke={3} />
            </div>

            {/* Text */}
            <div className="flex flex-col gap-2 flex-1">
              <h4
                className="font-body font-semibold text-base"
                style={{ color: `rgba(${card.accent},0.95)` }}
              >
                {card.title}
              </h4>
              <p className="text-white/50 font-body font-light text-sm leading-[1.75]">
                {card.body}
              </p>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className="h-[1px] w-0 group-hover:w-full transition-all duration-700"
              style={{ background: `linear-gradient(90deg, rgba(${card.accent},0.5), transparent)` }}
            />
          </div>
        </div>

        {/* Glow drop shadow */}
        <div
          className="absolute inset-0 rounded-3xl -z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ boxShadow: `0 24px 60px -12px rgba(${card.accent},0.2)` }}
        />
      </motion.div>
    </motion.div>
  );
}

/* ── Cinematic skill bar ── */
function SkillBar({ s, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3 group cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex justify-between items-end">
        <motion.span
          className="font-body font-medium text-sm md:text-base transition-colors duration-300"
          style={{ color: hovered ? `rgba(${s.color},0.95)` : "rgba(255,255,255,0.85)" }}
        >
          {s.name}
        </motion.span>
        <motion.span
          className="font-mono text-xs font-medium transition-colors duration-300"
          style={{ color: hovered ? `rgba(${s.color},0.8)` : "rgba(255,255,255,0.3)" }}
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.9 + i * 0.15 }}
        >
          {s.pct}%
        </motion.span>
      </div>

      {/* Track */}
      <div
        className="h-[3px] w-full rounded-full relative overflow-hidden"
        style={{ background: `rgba(${s.color},0.08)` }}
      >
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{
            background: `linear-gradient(90deg, rgba(${s.color},0.4), rgba(${s.color},1))`,
            boxShadow: hovered ? `0 0 12px rgba(${s.color},0.7)` : "none",
            transition: "box-shadow 0.3s ease",
          }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${s.pct}%` } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.15 }}
        />

        {/* Shimmer sweep */}
        {inView && (
          <motion.div
            className="absolute top-0 h-full w-8 rounded-full pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
            }}
            initial={{ left: "-2rem" }}
            animate={{ left: `${s.pct}%` }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.15 }}
          />
        )}

        {/* Tip glow */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
          style={{
            background: `rgba(${s.color},1)`,
            boxShadow: `0 0 8px 2px rgba(${s.color},0.8)`,
          }}
          initial={{ left: 0, opacity: 0 }}
          animate={inView ? { left: `calc(${s.pct}% - 4px)`, opacity: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.7 + i * 0.15 }}
        />
      </div>
    </div>
  );
}

export default function FeaturesGrid() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const bgSpring = useSpring(bgY, { stiffness: 40, damping: 18 });

  return (
    <section ref={sectionRef} id="skills" className="relative py-28 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden">

      {/* ── Ambient parallax orbs ── */}
      <motion.div
        style={{ y: bgSpring }}
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden
      >
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
          style={{ background: "rgba(80,120,255,0.04)" }} />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px]"
          style={{ background: "rgba(160,80,255,0.04)" }} />
      </motion.div>

      {/* ── Header ── */}
      <div className="flex flex-col items-center text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex items-center gap-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] md:text-xs font-semibold text-white/80 uppercase tracking-[0.22em] mb-8"
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full bg-white/50"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Why Me
        </motion.div>

        <BlurText
          text="Sự khác biệt nằm ở mọi chi tiết."
          delay={75}
          className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tighter leading-[1.02] max-w-3xl drop-shadow-xl justify-center"
          animateBy="words"
        />

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 h-[1px] w-32 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)" }}
        />
      </div>

      {/* ── 3D Cards grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
        {cards.map((card, i) => (
          <SkillCard key={i} card={card} i={i} />
        ))}
      </div>

      {/* ── Software skill bars panel ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative rounded-[2rem] overflow-hidden"
      >
        {/* Panel bg */}
        <div
          className="absolute inset-0"
          style={{
            background: "rgba(8,8,14,0.95)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "2rem",
          }}
        />

        {/* Scanline texture inside panel */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-[0.018] rounded-[2rem]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)",
          }}
        />

        {/* Ambient corner glows */}
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "rgba(100,80,200,0.08)" }} />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[80px] pointer-events-none"
          style={{ background: "rgba(60,120,200,0.06)" }} />

        <div className="relative z-10 p-8 md:p-12">
          {/* Label */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex gap-1.5">
              {["rgba(255,80,80,0.7)", "rgba(255,180,0,0.7)", "rgba(60,200,100,0.7)"].map((c, i) => (
                <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <p className="text-white/35 text-[10px] font-mono uppercase tracking-[0.25em]">
              proficiency.skill_map
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
            {skills.map((s, i) => (
              <SkillBar key={s.name} s={s} i={i} />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}