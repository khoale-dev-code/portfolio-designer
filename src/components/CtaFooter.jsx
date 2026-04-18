import { motion } from "motion/react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import HLSVideo from "./HLSVideo";
import BlurText from "./BlurText";

export default function CtaFooter() {
  return (
    <section 
      id="contact" 
      // Đổi thành min-h-dvh để Footer chiếm trọn màn hình cuối, đẩy phần copyright xuống đáy
      className="relative flex flex-col justify-end min-h-[90dvh] pt-40 pb-8 px-6 md:px-12 overflow-hidden"
    >
      {/* 1. Background Video */}
      <HLSVideo
        src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />

      {/* --- XỬ LÝ OVERLAY (TƯƠNG PHẢN & CHIỀU SÂU) --- */}
      {/* Lớp nền tối cơ bản dìm video xuống */}
      <div className="absolute inset-0 bg-black/50 z-10 pointer-events-none mix-blend-multiply" />
      {/* Radial gradient tối dần về viền để tập trung mắt vào giữa */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] z-10 pointer-events-none" />
      
      {/* Chuyển đổi inline styles sang Tailwind thuần */}
      <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#000] via-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-[#000] via-black/80 to-transparent pointer-events-none z-10" />

      {/* --- NỘI DUNG CHÍNH (CTA) --- */}
      <div className="relative z-20 flex flex-col items-center text-center max-w-4xl mx-auto w-full flex-1 justify-center mt-10">
        
        {/* Sub-badge mồi nhử */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[10px] md:text-xs font-semibold text-white/80 uppercase tracking-[0.2em] mb-8 shadow-lg"
        >
          Sẵn sàng bắt đầu?
        </motion.div>

        <BlurText
          text="Dự án tiếp theo của bạn bắt đầu từ đây."
          delay={80}
          // Tinh chỉnh font chữ, drop-shadow để tạo khối
          className="text-5xl md:text-6xl lg:text-[5.5rem] font-heading italic text-white leading-[1.05] tracking-tighter mb-8 drop-shadow-2xl"
          animateBy="words"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-white/70 font-body font-light text-base md:text-lg max-w-xl mb-12 leading-[1.8]"
        >
          Liên hệ để trao đổi về dự án của bạn. Không cam kết, không áp lực. 
          Chỉ là những khả năng tuyệt vời đang chờ đợi phía trước.
        </motion.p>

        {/* --- KHU VỰC NÚT BẤM (AUTOMATION & INTERACTIONS) --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          {/* Nút Phụ (Gửi Email) - Hiệu ứng Glass */}
          <motion.a
            href="mailto:dinhquocbao1402@gmail.com"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group liquid-glass-strong rounded-full px-8 py-4 text-white font-body font-medium text-sm md:text-base flex items-center gap-2 hover:bg-white/10 transition-colors w-full sm:w-auto justify-center"
          >
            <span>Gửi Email</span>
            <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 opacity-70 group-hover:opacity-100" />
          </motion.a>

          {/* Nút Chính (Gọi Ngay) - Có Automation (Animation tự động) thở nhẹ để thu hút sự chú ý */}
          <motion.a
            href="tel:0372816874"
            // Hiệu ứng Automation: Nút tự động scale nhẹ liên tục
            animate={{ boxShadow: ["0px 0px 0px 0px rgba(255,255,255,0.4)", "0px 0px 0px 15px rgba(255,255,255,0)"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.9)" }}
            whileTap={{ scale: 0.95 }}
            className="group bg-white text-black rounded-full px-8 py-4 font-body font-semibold text-sm md:text-base transition-colors flex items-center gap-2 w-full sm:w-auto justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            <span>Gọi Ngay</span>
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.a>
        </motion.div>
      </div>

      {/* --- FOOTER BAR --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 1 }}
        className="relative z-20 mt-24 pt-8 border-t border-white/10 w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6"
      >
        <p className="text-white/40 text-xs md:text-sm font-body tracking-wide">
          © {new Date().getFullYear()} Đinh Quốc Bảo. All rights reserved.
        </p>
        
        {/* Biến đổi các thông tin liên hệ thành các link có thể click được (UX tốt hơn) */}
        <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3">
          <span className="text-white/40 text-xs md:text-sm font-body flex items-center gap-2">
            Quận 6, TPHCM
          </span>
          <a href="tel:0372816874" className="text-white/40 hover:text-white/80 transition-colors text-xs md:text-sm font-body">
            037.2816.874
          </a>
          <a href="mailto:dinhquocbao1402@gmail.com" className="text-white/40 hover:text-white/80 transition-colors text-xs md:text-sm font-body">
            dinhquocbao1402@gmail.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}