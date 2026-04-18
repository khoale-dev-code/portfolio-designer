import { motion } from "motion/react";
import BlurText from "./BlurText";

const testimonials = [
  {
    quote: "Quốc Bảo thiết kế poster sự kiện Khoa trong 2 ngày. Chất lượng vượt xa kỳ vọng — chuyên nghiệp và sáng tạo.",
    name: "Nguyễn Minh Tuấn",
    role: "Chủ nhiệm CLB, HUFI",
  },
  {
    quote: "Giao diện UI app học phần do Bảo thiết kế rất trực quan. Sinh viên trong nhóm đều ấn tượng với sự tỉ mỉ trong từng màn hình.",
    name: "Trần Thị Lan",
    role: "Giảng viên, HUFI",
  },
  {
    quote: "Làm việc cùng Bảo rất dễ dàng. Anh hiểu brief nhanh và luôn đưa ra giải pháp sáng tạo vượt mong đợi.",
    name: "Lê Hoàng Nam",
    role: "Khách hàng Freelance",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 md:px-16 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium text-white font-body mb-6"
        >
          What They Say
        </motion.div>
        <BlurText
          text="Đừng chỉ nghe tôi nói."
          delay={100}
          className="text-4xl md:text-5xl font-heading italic text-white tracking-tight leading-[0.9] max-w-xl"
          animateBy="words"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="liquid-glass rounded-2xl p-8 flex flex-col gap-5"
          >
            <p className="text-white/80 font-body font-light text-sm italic leading-relaxed flex-1">
              "{t.quote}"
            </p>
            <div>
              <p className="text-white font-body font-medium text-sm">{t.name}</p>
              <p className="text-white/50 font-body font-light text-xs">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}