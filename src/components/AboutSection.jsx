import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import BlurText from "./BlurText";
import HLSVideo from "./HLSVideo";

/* ── Floating stat card ── */
function StatCard({ value, label, accent = "255,255,255", delay = 0 }) {
  const [counted, setCounted] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const end = parseInt(value);
    const duration = 1200;
    const steps = 40;
    const inc = end / steps;
    let cur = 0;
    const timer = setInterval(() => {
      cur = Math.min(cur + inc, end);
      setCounted(Math.round(cur));
      if (cur >= end) clearInterval(timer);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="relative overflow-hidden rounded-2xl px-6 py-5 cursor-default"
      style={{
        background: `rgba(${accent},0.04)`,
        border: `1px solid rgba(${accent},0.12)`,
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Corner accent */}
      <div
        className="absolute top-0 left-0 w-8 h-[1px]"
        style={{ background: `rgba(${accent},0.5)` }}
      />
      <div
        className="absolute top-0 left-0 w-[1px] h-8"
        style={{ background: `rgba(${accent},0.5)` }}
      />

      <p
        className="text-4xl font-black italic leading-none mb-1"
        style={{ color: `rgba(${accent},0.9)` }}
      >
        {counted}+
      </p>
      <p className="text-xs font-body uppercase tracking-widest text-white/40">{label}</p>
    </motion.div>
  );
}

/* ── Floating orb that follows scroll ── */
function ScrollOrb({ xFactor = 1, yFactor = 1, color = "59,130,246" }) {
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 800], [0, 80 * xFactor]);
  const y = useTransform(scrollY, [0, 800], [0, 60 * yFactor]);
  const sx = useSpring(x, { stiffness: 40, damping: 20 });
  const sy = useSpring(y, { stiffness: 40, damping: 20 });

  return (
    <motion.div
      style={{ x: sx, y: sy }}
      className="absolute rounded-full pointer-events-none"
      animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.55, 0.3] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className="w-[500px] h-[500px] rounded-full blur-[100px]"
        style={{ background: `rgba(${color},0.07)` }}
      />
    </motion.div>
  );
}

/* ── Horizontal reveal line ── */
function RevealLine({ delay = 0, width = "60%" }) {
  return (
    <motion.div
      className="h-[1px]"
      style={{
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        width,
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
    />
  );
}

/* ── Cinematic CTA with ripple ── */
function CinematicCTA({ href, children }) {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((r) => [...r, { x, y, id }]);
    setTimeout(() => setRipples((r) => r.filter((ri) => ri.id !== id)), 800);
  };

  return (
    <motion.a
      href={href}
      onClick={addRipple}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden liquid-glass-strong border border-white/20 rounded-full px-10 py-4 text-white font-body font-medium text-sm md:text-base transition-all duration-500 hover:border-white/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] focus:outline-none"
    >
      {/* Ripple effects */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute rounded-full bg-white/15 pointer-events-none"
          style={{ left: r.x, top: r.y, translateX: "-50%", translateY: "-50%" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={{ width: 300, height: 300, opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      ))}

      {/* Sweep shine */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.06) 50%, transparent 60%)",
        }}
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />

      <span className="relative z-10">{children}</span>
    </motion.a>
  );
}

export default function AboutSection() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  /* Parallax layers */
  const videoY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.12, 1.05]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const vigY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const videoSpring = useSpring(videoY, { stiffness: 50, damping: 20 });
  const contentSpring = useSpring(contentY, { stiffness: 50, damping: 20 });

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative flex items-center justify-center min-h-[90dvh] py-32 px-6 overflow-hidden"
    >
      {/* ── Video BG with parallax ── */}
      <motion.div
        style={{ y: videoSpring, scale: videoScale }}
        className="absolute inset-0 z-0 origin-center"
      >
        <HLSVideo
          src="https://stream.mux.com/9JXDljEVWYwWu01PUkAemafDugK89o01BR6zqJ3aS9u00A.m3u8"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* ── Atmosphere layers ── */}
      <div className="absolute inset-0 bg-black/55 z-[1] pointer-events-none" />

      {/* Vignette */}
      <motion.div
        style={{ y: vigY }}
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 70% at center, transparent 0%, rgba(0,0,0,0.75) 100%)",
          y: vigY,
        }}
      />

      {/* Gradient fades */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/95 via-black/50 to-transparent z-[2] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/95 via-black/50 to-transparent z-[2] pointer-events-none" />

      {/* Chromatic aberration edge */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ boxShadow: "inset 0 0 120px rgba(0,0,30,0.4)" }} />

      {/* Scroll-parallax orbs */}
      <div className="absolute top-1/4 -left-40 z-[1]">
        <ScrollOrb xFactor={0.8} yFactor={-0.5} color="80,120,220" />
      </div>
      <div className="absolute bottom-1/4 -right-40 z-[1]">
        <ScrollOrb xFactor={-0.6} yFactor={0.4} color="120,60,180" />
      </div>

      {/* ── Scanline texture ── */}
      <div
        aria-hidden
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 4px)",
        }}
      />

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentSpring }}
        className="relative z-20 max-w-4xl w-full mx-auto flex flex-col items-center text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-2 text-[10px] md:text-xs font-semibold text-white/80 uppercase tracking-[0.25em] mb-8 flex items-center gap-2"
        >
          <motion.span
            className="w-1 h-1 rounded-full bg-white/60"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          About Me
        </motion.div>

        <RevealLine delay={0.1} width="40%" />
        <div className="my-8">
          <BlurText
            text="1 năm kinh nghiệm. Vô số câu chuyện thiết kế."
            delay={70}
            className="text-4xl md:text-6xl lg:text-[4.8rem] font-heading italic text-white tracking-tighter leading-[1.05] max-w-3xl drop-shadow-xl"
            animateBy="words"
          />
        </div>
        <RevealLine delay={0.3} width="30%" />

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 md:gap-5 w-full max-w-lg my-10">
          <StatCard value="4" label="Projects" accent="120,180,255" delay={0.2} />
          <StatCard value="1" label="Years Exp" accent="180,130,255" delay={0.35} />
          <StatCard value="3" label="Clients" accent="100,220,180" delay={0.5} />
        </div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.9 }}
          className="text-white/60 font-body font-light text-base md:text-[1.1rem] max-w-2xl leading-[1.9] mb-10"
        >
          Với 1 năm kinh nghiệm trong lĩnh vực thiết kế, tôi có khả năng linh hoạt trong mọi công việc,
          triển khai dự án hiệu quả và luôn hướng đến tối ưu trải nghiệm người dùng. Tôi luôn đề cao
          tinh thần hợp tác và phối hợp chặt chẽ để tạo ra những sản phẩm chất lượng và sáng tạo nhất.
        </motion.p>

        {/* Tool tags */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.45 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {["Illustrator", "Photoshop", "Figma", "CapCut", "UI/UX"].map((tool, i) => (
            <motion.span
              key={tool}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + i * 0.07 }}
              whileHover={{ scale: 1.07, y: -1 }}
              className="text-xs font-mono px-3.5 py-1.5 rounded-full text-white/60 border border-white/10 bg-white/[0.04] backdrop-blur-sm cursor-default"
            >
              {tool}
            </motion.span>
          ))}
        </motion.div>

        <CinematicCTA href="#contact">Get Started</CinematicCTA>
      </motion.div>
    </section>
  );
}