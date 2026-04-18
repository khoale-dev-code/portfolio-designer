import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import BlurText from "./BlurText";

const rows = [
  {
    title: "Thiết kế đồ họa chuyên nghiệp.",
    body: "Key visual truyền thông, menu, poster, standee — mọi ấn phẩm đều được thực hiện với sự tỉ mỉ và sáng tạo. Từ ý tưởng đến thành phẩm, tôi đảm bảo chất lượng tối ưu nhất.",
    cta: "Xem tác phẩm",
    gif: "https://motionsites.ai/assets/hero-finlytic-preview-CV9g0FHP.gif",
    reverse: false,
    accent: "80,140,255",
    tag: "01 — Graphic Design",
  },
  {
    title: "UI/UX — Trải nghiệm người dùng tối ưu.",
    body: "Giao diện đẹp không chỉ để nhìn. Mỗi màn hình được thiết kế có chủ đích — từ luồng người dùng, hệ thống màu sắc đến từng chi tiết nhỏ nhất, tất cả phục vụ cho trải nghiệm liền mạch.",
    cta: "Xem cách làm việc",
    gif: "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    reverse: true,
    accent: "180,100,255",
    tag: "02 — UI/UX Design",
  },
];

/* ── Image frame with parallax inner scroll ── */
function MediaFrame({ gif, accent, reverse, inView }) {
  const frameRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgSpring = useSpring(imgY, { stiffness: 50, damping: 20 });

  const [loaded, setLoaded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={frameRef}
      className="flex-1 w-full relative"
      initial={{ opacity: 0, x: reverse ? -60 : 60, filter: "blur(16px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none -z-10 transition-opacity duration-500"
        style={{ boxShadow: `0 32px 80px -20px rgba(${accent},0.28)` }}
        animate={{ opacity: hovered ? 1 : 0.4 }}
      />

      {/* Frame border */}
      <div
        className="absolute inset-0 rounded-3xl pointer-events-none z-20"
        style={{
          border: `1px solid rgba(${accent}, ${hovered ? 0.3 : 0.12})`,
          transition: "border-color 0.5s ease",
          borderRadius: "1.5rem",
        }}
      />

      {/* Corner accents */}
      {[
        "top-0 left-0",
        "top-0 right-0 rotate-90",
        "bottom-0 left-0 -rotate-90",
        "bottom-0 right-0 rotate-180",
      ].map((pos, i) => (
        <div key={i} className={`absolute ${pos} w-5 h-5 z-30 pointer-events-none`}>
          <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: `rgba(${accent},0.7)` }} />
          <div className="absolute top-0 left-0 w-[1px] h-full" style={{ background: `rgba(${accent},0.7)` }} />
        </div>
      ))}

      {/* Image with inner parallax */}
      <div className="rounded-3xl overflow-hidden relative" style={{ aspectRatio: "16/10" }}>
        {/* Scanline overlay */}
        <div
          aria-hidden
          className="absolute inset-0 z-10 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.15) 3px, rgba(255,255,255,0.15) 4px)",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)" }}
        />

        {/* Hover color tint */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-500"
          style={{ background: `rgba(${accent},0.06)` }}
          animate={{ opacity: hovered ? 1 : 0 }}
        />

        {/* Parallax image */}
        <motion.div style={{ y: imgSpring }} className="absolute inset-[-10%] w-[120%] h-[120%]">
          <img
            src={gif}
            alt=""
            onLoad={() => setLoaded(true)}
            className="w-full h-full object-cover"
            style={{
              filter: loaded ? "none" : "blur(10px)",
              transition: "filter 1s ease",
            }}
          />
        </motion.div>

        {/* Loading shimmer */}
        {!loaded && (
          <div
            className="absolute inset-0 z-20"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.03) 50%, rgba(255,255,255,0) 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 2s linear infinite",
            }}
          />
        )}
      </div>

      {/* Floating label badge */}
      <motion.div
        className="absolute -bottom-3 left-6 z-30"
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div
          className="px-3 py-1.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-widest"
          style={{
            background: `rgba(${accent},0.1)`,
            border: `1px solid rgba(${accent},0.25)`,
            color: `rgba(${accent},0.9)`,
            backdropFilter: "blur(12px)",
          }}
        >
          Live Preview
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Text block ── */
function TextBlock({ row, inView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="flex-1 flex flex-col gap-6"
      initial={{ opacity: 0, x: row.reverse ? 60 : -60, filter: "blur(12px)" }}
      animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Row tag */}
      <motion.span
        className="text-[10px] font-mono uppercase tracking-[0.22em]"
        style={{ color: `rgba(${row.accent},0.6)` }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.15 }}
      >
        {row.tag}
      </motion.span>

      {/* Accent line */}
      <motion.div
        className="h-[1px] w-0"
        style={{ background: `linear-gradient(90deg, rgba(${row.accent},0.6), transparent)` }}
        animate={inView ? { width: "48px" } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Title */}
      <div className="overflow-hidden">
        <motion.h3
          className="text-3xl md:text-4xl lg:text-5xl font-heading italic text-white leading-tight tracking-tight"
          initial={{ y: 70 }}
          animate={inView ? { y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {row.title}
        </motion.h3>
      </div>

      {/* Body */}
      <motion.p
        className="text-white/55 font-body font-light text-sm md:text-base leading-[1.85] max-w-lg"
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.35, duration: 0.8 }}
      >
        {row.body}
      </motion.p>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <motion.a
          href="#contact"
          className="group relative overflow-hidden self-start inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-body font-medium"
          style={{
            background: `rgba(${row.accent},0.08)`,
            border: `1px solid rgba(${row.accent},0.2)`,
            color: `rgba(${row.accent},0.9)`,
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Shine sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `linear-gradient(105deg, transparent 30%, rgba(${row.accent},0.12) 50%, transparent 70%)`,
            }}
            initial={{ x: "-100%" }}
            animate={hovered ? { x: "100%" } : { x: "-100%" }}
            transition={{ duration: 0.5 }}
          />
          <span className="relative z-10">{row.cta}</span>
          <motion.span
            animate={hovered ? { x: 2, y: -2 } : { x: 0, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ArrowUpRight size={14} className="relative z-10" />
          </motion.span>
        </motion.a>
      </motion.div>
    </motion.div>
  );
}

/* ── Row with scroll-linked parallax ── */
function CapabilityRow({ row, i }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const sectionY = useTransform(scrollYProgress, [0, 1], ["3%", "-3%"]);
  const sectionSpring = useSpring(sectionY, { stiffness: 40, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ y: sectionSpring }}
      className={`flex flex-col md:flex-row gap-12 md:gap-16 items-center ${
        row.reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      <TextBlock row={row} inView={inView} />
      <MediaFrame gif={row.gif} accent={row.accent} reverse={row.reverse} inView={inView} />
    </motion.div>
  );
}

export default function FeaturesChess() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const bgSpring = useSpring(bgY, { stiffness: 40, damping: 18 });

  return (
    <section ref={sectionRef} id="work" className="relative py-28 px-6 md:px-16 max-w-6xl mx-auto overflow-hidden">

      {/* ── Ambient orbs ── */}
      <motion.div
        style={{ y: bgSpring }}
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden
      >
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: "rgba(60,100,255,0.04)" }} />
        <div className="absolute bottom-1/4 -right-32 w-[400px] h-[400px] rounded-full blur-[110px]"
          style={{ background: "rgba(160,60,255,0.04)" }} />
      </motion.div>

      {/* ── Section Header ── */}
      <div className="flex flex-col items-center text-center mb-24">
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
          Capabilities
        </motion.div>

        <BlurText
          text="Dịch vụ tôi cung cấp. Không phức tạp."
          delay={75}
          className="text-4xl md:text-5xl font-heading italic text-white tracking-tighter leading-[0.92] max-w-2xl justify-center"
          animateBy="words"
        />

        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-6 h-[1px] w-28 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)" }}
        />
      </div>

      {/* ── Rows ── */}
      <div className="flex flex-col gap-28">
        {rows.map((row, i) => (
          <CapabilityRow key={i} row={row} i={i} />
        ))}
      </div>

      {/* ── Divider ── */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="mt-28 h-[1px] origin-left"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)" }}
      />
    </section>
  );
}   