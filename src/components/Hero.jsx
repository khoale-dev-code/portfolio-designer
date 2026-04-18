import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "motion/react";
import { ArrowUpRight, Play, Mouse } from "lucide-react";
import BlurText from "./BlurText";

/* ── Deep Space Particle Canvas ── */
function DeepSpaceCanvas() {
  const canvasRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    /* Star layers for parallax depth */
    const layers = [
      { count: 180, speed: 0.015, size: [0.3, 0.7], opacity: [0.2, 0.5] },
      { count: 80,  speed: 0.03,  size: [0.5, 1.2], opacity: [0.3, 0.7] },
      { count: 30,  speed: 0.06,  size: [1.0, 2.0], opacity: [0.5, 1.0] },
    ];

    const stars = layers.flatMap((l) =>
      Array.from({ length: l.count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        size: l.size[0] + Math.random() * (l.size[1] - l.size[0]),
        opacity: l.opacity[0] + Math.random() * (l.opacity[1] - l.opacity[0]),
        speed: l.speed,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.005 + Math.random() * 0.015,
      }))
    );

    /* Dust particles */
    const dust = Array.from({ length: 60 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.08,
      size: 1 + Math.random() * 3,
      opacity: 0.02 + Math.random() * 0.06,
      color: Math.random() > 0.5 ? "120,180,255" : "200,160,255",
    }));

    /* Nebula blobs */
    const nebulae = [
      { x: W * 0.2, y: H * 0.3, r: 300, color: "30,60,120", opacity: 0.025 },
      { x: W * 0.8, y: H * 0.7, r: 250, color: "80,30,100", opacity: 0.03 },
      { x: W * 0.5, y: H * 0.5, r: 400, color: "10,40,80",  opacity: 0.02 },
    ];

    let mouseX = W / 2;
    let mouseY = H / 2;
    const onMove = (e) => { mouseX = e.clientX; mouseY = e.clientY; };
    window.addEventListener("mousemove", onMove);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    let frame = 0;

    function draw() {
      animRef.current = requestAnimationFrame(draw);
      frame++;

      ctx.clearRect(0, 0, W, H);

      /* Nebulae */
      nebulae.forEach((n) => {
        const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
        grd.addColorStop(0, `rgba(${n.color},${n.opacity})`);
        grd.addColorStop(1, `rgba(${n.color},0)`);
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
      });

      /* Stars with twinkle & parallax */
      const offsetX = (mouseX / W - 0.5) * 0.5;
      const offsetY = (mouseY / H - 0.5) * 0.5;

      stars.forEach((s) => {
        s.twinkle += s.twinkleSpeed;
        const twinkleFactor = 0.6 + Math.sin(s.twinkle) * 0.4;
        const px = ((s.x + offsetX * s.speed * W * 12) % W + W) % W;
        const py = ((s.y + offsetY * s.speed * H * 12) % H + H) % H;

        ctx.beginPath();
        ctx.arc(px, py, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${s.opacity * twinkleFactor})`;
        ctx.fill();

        /* Star glow for larger stars */
        if (s.size > 1.2) {
          const grd = ctx.createRadialGradient(px, py, 0, px, py, s.size * 4);
          grd.addColorStop(0, `rgba(180,210,255,${0.1 * twinkleFactor})`);
          grd.addColorStop(1, "rgba(180,210,255,0)");
          ctx.fillStyle = grd;
          ctx.fillRect(px - s.size * 4, py - s.size * 4, s.size * 8, s.size * 8);
        }
      });

      /* Dust */
      dust.forEach((d) => {
        d.x = (d.x + d.vx + W) % W;
        d.y = (d.y + d.vy + H) % H;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${d.color},${d.opacity})`;
        ctx.fill();
      });

      /* Shooting star every ~400 frames */
      if (frame % 400 < 2) {
        const sx = Math.random() * W;
        const sy = Math.random() * H * 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 80, sy + 30);
        const g = ctx.createLinearGradient(sx, sy, sx + 80, sy + 30);
        g.addColorStop(0, "rgba(255,255,255,0.8)");
        g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0 pointer-events-none"
    />
  );
}

/* ── Parallax scroll layer ── */
function ParallaxLayer({ children, speed = 0.3, className = "" }) {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 800 * speed]);
  const springY = useSpring(y, { stiffness: 80, damping: 30 });

  return (
    <motion.div ref={ref} style={{ y: springY }} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Magnetic button ── */
function MagneticBtn({ children, className = "", href = "#", strength = 0.3 }) {
  const btnRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e) => {
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  return (
    <motion.a
      ref={btnRef}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

/* ── Glitch text ── */
function GlitchBadge({ children }) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitching(true);
      setTimeout(() => setGlitching(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span
      className={`relative inline-block transition-all duration-75 ${
        glitching ? "translate-x-[1px] translate-y-[-1px]" : ""
      }`}
      style={{
        textShadow: glitching
          ? "1px 0 rgba(0,200,255,0.8), -1px 0 rgba(255,0,100,0.8)"
          : "none",
      }}
    >
      {children}
    </span>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const videoOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const contentY = useTransform(scrollY, [0, 500], [0, -80]);
  const contentSpring = useSpring(contentY, { stiffness: 60, damping: 20 });

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center min-h-[100dvh] overflow-hidden pt-20 pb-10"
    >
      {/* ── Deep space background ── */}
      <div className="absolute inset-0 bg-[#020408] z-0" />
      <DeepSpaceCanvas />

      {/* ── Video overlay with parallax ── */}
      <ParallaxLayer speed={0.15} className="absolute inset-0 z-[1]">
        <motion.div style={{ opacity: videoOpacity }} className="absolute inset-0">
          <video
            autoPlay loop muted playsInline
            poster="/images/hero_bg.jpeg"
            className="absolute inset-0 w-full h-full object-cover scale-110"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
              type="video/mp4"
            />
          </video>
          {/* Film burn overlay */}
          <div className="absolute inset-0 mix-blend-multiply bg-gradient-to-br from-[#0a0a1a]/60 via-transparent to-[#1a0a0a]/40" />
        </motion.div>
      </ParallaxLayer>

      {/* ── Depth layers ── */}
      <div className="absolute inset-0 bg-black/50 z-[2] mix-blend-multiply pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.85)_100%)] z-[2] pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-black via-black/60 to-transparent z-[2] pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-black via-black/70 to-transparent z-[2] pointer-events-none" />

      {/* ── Lens flare ── */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[3]"
        animate={{ opacity: [0.04, 0.09, 0.04], scale: [1, 1.08, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(160,200,255,0.15) 0%, transparent 65%)" }} />
      </motion.div>

      {/* ── Main content ── */}
      <motion.div
        style={{ y: contentSpring }}
        className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mt-auto"
      >
        {/* Availability badge */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="liquid-glass rounded-full p-1.5 pr-5 flex items-center gap-3 mb-8 shadow-2xl border border-white/10"
        >
          <span className="bg-white text-black rounded-full px-3 py-1 text-[10px] md:text-xs font-bold font-body uppercase tracking-wider flex items-center gap-2">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-green-400"
              animate={{ opacity: [1, 0.2, 1], scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Available
          </span>
          <GlitchBadge>
            <span className="text-white/80 text-[10px] md:text-xs font-body font-medium tracking-wide">
              Open for freelance & full-time
            </span>
          </GlitchBadge>
        </motion.div>

        {/* Heading with blur reveal */}
        <BlurText
          text="Graphic Designer & UI/UX Creator"
          delay={55}
          className="text-[clamp(1.8rem,5vw,6.5rem)] justify-center w-full font-heading italic text-white leading-[0.88] tracking-tighter mb-8 drop-shadow-2xl"
          animateBy="words"
        />

        {/* Horizontal rule with glow */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-[1px] mb-8 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        />

        {/* Subtext */}
        <motion.p
          initial={{ filter: "blur(12px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.6 }}
          className="text-base md:text-lg text-white/60 font-body font-light leading-[1.8] max-w-2xl mb-10"
        >
          Thiết kế đồ họa, UI/UX và tối ưu trải nghiệm người dùng. Biến tầm nhìn của
          bạn thành hiện thực thông qua những giao diện sáng tạo và tinh tế.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.9 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <MagneticBtn
            href="#work"
            strength={0.4}
            className="group liquid-glass-strong rounded-full px-8 py-3.5 text-white font-body font-medium text-sm md:text-base flex items-center gap-2 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all duration-500"
          >
            <span>View My Work</span>
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </MagneticBtn>

          <MagneticBtn
            href="#showreel"
            strength={0.3}
            className="group flex items-center gap-3 text-white/70 font-body font-light text-sm md:text-base hover:text-white transition-colors"
          >
            <motion.div
              className="w-10 h-10 rounded-full backdrop-blur-md bg-white/8 border border-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.15, backgroundColor: "rgba(255,255,255,0.15)" }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Play size={13} fill="currentColor" className="ml-0.5" />
            </motion.div>
            Play Showreel
          </MagneticBtn>
        </motion.div>
      </motion.div>

      {/* ── Tool stack ── */}
      <div className="relative z-10 w-full mt-auto pt-14 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3 }}
          className="flex flex-col items-center gap-5 w-full max-w-4xl"
        >
          <div className="flex items-center gap-4 w-full px-6">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/8" />
            <span className="text-white/30 text-[10px] md:text-xs font-body uppercase tracking-[0.2em] whitespace-nowrap">
              Proficient With
            </span>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/8" />
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14 px-6">
            {["Illustrator", "Photoshop", "Figma", "CapCut"].map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5 + i * 0.1 }}
                whileHover={{ color: "rgba(255,255,255,0.95)", y: -2 }}
                className="text-xl md:text-2xl font-heading italic text-white/35 cursor-default transition-colors duration-300"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-10 mb-6 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="text-white/25"
          >
            <Mouse size={22} strokeWidth={1} />
          </motion.div>
          <motion.span
            className="text-[9px] uppercase tracking-[0.25em] text-white/20"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            Scroll
          </motion.span>
        </motion.div>
      </div>
    </section>
  );
}