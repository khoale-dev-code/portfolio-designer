import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import BlurText from "./BlurText";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailto = `mailto:dinhquocbao1402@gmail.com?subject=Liên hệ từ ${form.name}&body=${encodeURIComponent(form.message)}%0A%0ATừ: ${form.name}%0AEmail: ${form.email}`;
    window.location.href = mailto;
    setSent(true);
  };

  const contacts = [
    { icon: Mail, label: "Email", value: "dinhquocbao1402@gmail.com", href: "mailto:dinhquocbao1402@gmail.com" },
    { icon: Phone, label: "Điện thoại", value: "037.2816.874", href: "tel:0372816874" },
    { icon: MapPin, label: "Địa điểm", value: "Quận 6, TPHCM", href: null },
  ];

  return (
    <section id="contact-form" className="relative py-32 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative z-20">
        
        {/* ================= LEFT COLUMN: INFO ================= */}
        <div className="flex-1 flex flex-col gap-10">
          
          {/* Header Area */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-md bg-white/5 border border-white/10 shadow-lg self-start rounded-full px-4 py-1.5 text-[10px] md:text-xs font-semibold text-white/90 uppercase tracking-[0.2em]"
            >
              Get In Touch
            </motion.div>
            
            <BlurText
              text="Hãy cùng tạo ra điều gì đó tuyệt vời."
              delay={80}
              className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white tracking-tighter leading-[1.05] drop-shadow-md"
              animateBy="words"
            />
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-white/70 font-body font-light text-base md:text-lg leading-[1.8] max-w-lg"
            >
              Dù là dự án freelance, hợp tác dài hạn hay chỉ muốn trao đổi ý tưởng — mình luôn
              sẵn sàng lắng nghe và phản hồi sớm nhất có thể.
            </motion.p>
          </div>

          {/* Contact Details List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col gap-6"
          >
            {contacts.map((c, i) => (
              <div key={i} className="group flex items-start gap-5">
                <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-full w-12 h-12 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-white/10 group-hover:scale-110">
                  <c.icon strokeWidth={1.5} className="text-white/80 w-5 h-5 transition-colors group-hover:text-white" />
                </div>
                <div className="flex flex-col justify-center min-h-[3rem]">
                  <p className="text-white/40 font-body text-[10px] uppercase tracking-widest font-semibold mb-1">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-white/90 font-body font-medium text-base hover:text-white transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white/90 font-body font-medium text-base">{c.value}</p>
                  )}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Education Block - Refined to look like a timeline/card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-md bg-gradient-to-br from-white/5 to-transparent border border-white/10 rounded-3xl p-8 mt-4"
          >
            <p className="text-white/40 font-body text-[10px] uppercase tracking-[0.2em] font-semibold mb-6">Học vấn & Chứng chỉ</p>
            <div className="flex flex-col gap-6 relative">
              {/* Vertical Timeline Line */}
              <div className="absolute left-[5px] top-2 bottom-2 w-px bg-white/10"></div>
              
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white/20 border-2 border-[#0a0a0a]"></div>
                <p className="text-white font-body font-medium text-base">Đại học Ngoại Ngữ - Tin Học TPHCM</p>
                <p className="text-white/50 font-body font-light text-sm mt-1">Công Nghệ Thông Tin (UX/UI Design) · 2021 – 2025</p>
              </div>
              
              <div className="relative pl-6">
                <div className="absolute left-0 top-1.5 w-3 h-3 rounded-full bg-white/20 border-2 border-[#0a0a0a]"></div>
                <p className="text-white font-body font-medium text-base">Coursera Google</p>
                <p className="text-white/50 font-body font-light text-sm mt-1">Google AI Essentials · 2025</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ================= RIGHT COLUMN: FORM ================= */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex-1 flex flex-col justify-center"
        >
          {/* Bao bọc bằng AnimatePresence để tạo hiệu ứng mượt khi chuyển trạng thái Form -> Sent */}
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px] shadow-2xl"
              >
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center text-4xl mb-2">✨</div>
                <p className="text-white font-heading italic text-3xl md:text-4xl">Cảm ơn bạn!</p>
                <p className="text-white/60 font-body font-light text-base leading-relaxed max-w-xs">
                  Trình duyệt mail đã được mở. Mình sẽ kiểm tra và phản hồi bạn sớm nhất có thể.
                </p>
              </motion.div>
            ) : (
              <motion.form 
                key="form"
                exit={{ opacity: 0, y: -20 }}
                onSubmit={handleSubmit} 
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-[2rem] p-8 md:p-10 flex flex-col gap-6 shadow-2xl"
              >
                <div className="flex flex-col gap-2.5 group">
                  <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors group-focus-within:text-white/90">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Nguyễn Văn A"
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-body text-base placeholder-white/20 outline-none focus:bg-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col gap-2.5 group">
                  <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors group-focus-within:text-white/90">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="hello@example.com"
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3.5 text-white font-body text-base placeholder-white/20 outline-none focus:bg-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 transition-all duration-300"
                  />
                </div>

                <div className="flex flex-col gap-2.5 group">
                  <label className="text-white/50 font-body text-[10px] uppercase tracking-[0.15em] font-semibold transition-colors group-focus-within:text-white/90">
                    Nội dung
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Mô tả sơ lược về dự án hoặc yêu cầu của bạn..."
                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white font-body text-base placeholder-white/20 outline-none focus:bg-white/10 focus:border-white/40 focus:ring-4 focus:ring-white/5 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="group relative overflow-hidden backdrop-blur-md bg-white/10 border border-white/20 rounded-xl px-6 py-4 text-white font-body font-medium text-base flex items-center justify-center gap-3 hover:bg-white/20 hover:border-white/40 hover:shadow-lg transition-all duration-300 mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                >
                  <span>Gửi tin nhắn</span>
                  <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}   