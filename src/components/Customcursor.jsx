import { useEffect, useState } from "react";
import { motion } from "motion/react";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => setPos({ x: e.clientX, y: e.clientY });
    const over = (e) => {
      if (e.target.closest("a, button, [data-cursor='hover']")) {
        setHover(true);
      } else {
        setHover(false);
      }
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
    };
  }, []);

  // Only show on desktop
  return (
    <motion.div
      className="fixed top-0 left-0 z-[200] pointer-events-none hidden md:block"
      animate={{
        x: pos.x - (hover ? 20 : 6),
        y: pos.y - (hover ? 20 : 6),
        width: hover ? 40 : 12,
        height: hover ? 40 : 12,
        opacity: pos.x === -100 ? 0 : 1,
      }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      style={{
        borderRadius: "9999px",
        border: "1px solid rgba(255,255,255,0.5)",
        mixBlendMode: "difference",
      }}
    />
  );
}