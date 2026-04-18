import { useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from "motion/react";
import { ArrowUp } from "lucide-react"; // Sử dụng Lucide icon cho đồng bộ với dự án

export default function ScrollProgress() {
  const [showTop, setShowTop] = useState(false);

  // 1. Lấy giá trị cuộn trực tiếp từ Framer Motion (không gây re-render component)
  const { scrollYProgress, scrollY } = useScroll();

  // 2. Thêm hiệu ứng vật lý (Spring) để thanh progress trượt mượt mà, có độ trễ nhẹ kiểu điện ảnh
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3. Lắng nghe thay đổi của scrollY để hiện/ẩn nút (tối ưu hơn useEffect)
  useMotionValueEvent(scrollY, "change", (latest) => {
    setShowTop(latest > 600);
  });

  return (
    <>
      {/* --- PROGRESS BAR --- */}
      {/* Lớp nền mờ của thanh progress */}
      <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-white/5 backdrop-blur-sm pointer-events-none">
        {/* Lớp màu chạy */}
        <motion.div
          className="h-full w-full bg-gradient-to-r from-white/40 via-white/80 to-white origin-left will-change-transform"
          style={{ scaleX }} // Dùng scaleX tối ưu GPU hơn rất nhiều so với dùng width
        />
      </div>

      {/* --- BACK TO TOP BUTTON --- */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            // Thêm micro-interactions khi hover/tap
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="group fixed bottom-8 right-8 z-50 liquid-glass-strong rounded-full w-12 h-12 flex items-center justify-center text-white hover:bg-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
            aria-label="Cuộn lên đầu trang"
          >
            <ArrowUp 
              size={20} 
              className="opacity-70 group-hover:opacity-100 transition-transform duration-300 group-hover:-translate-y-1" 
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}