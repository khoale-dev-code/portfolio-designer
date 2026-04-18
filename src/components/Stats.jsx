import { motion } from "motion/react";
import HLSVideo from "./HLSVideo";

const stats = [
  { value: "1+", label: "Năm kinh nghiệm" },
  { value: "80%", label: "Adobe Suite" },
  { value: "3+", label: "Vị trí thực tế" },
  { value: "2025", label: "Tốt nghiệp HUFI" },
];

export default function Stats() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <HLSVideo
        src="https://stream.mux.com/NcU3HlHeF7CUL86azTTzpy3Tlb00d6iF3BmCdFslMJYM.m3u8"
        className="absolute inset-0 w-full h-full object-cover"
        desaturate
      />

      <div className="absolute top-0 left-0 right-0 pointer-events-none z-10" style={{ height: "200px", background: "linear-gradient(to bottom, black, transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10" style={{ height: "200px", background: "linear-gradient(to top, black, transparent)" }} />

      <div className="relative z-20 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="liquid-glass rounded-3xl p-12 md:p-16"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center gap-2"
              >
                <span className="text-4xl md:text-5xl lg:text-6xl font-heading italic text-white">
                  {s.value}
                </span>
                <span className="text-white/60 font-body font-light text-sm">{s.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Experience timeline */}
          <div className="mt-12 border-t border-white/10 pt-10">
            <p className="text-white/40 text-xs font-body uppercase tracking-widest mb-8 text-center">Kinh nghiệm làm việc</p>
            <div className="flex flex-col gap-6">
              {[
                { period: "T9/2025 – Hiện tại", role: "Freelance — Thiết kế đồ họa tại TAGO ĐÌ ZAI NƠ" },
                { period: "T3/2025 – T8/2025", role: "Nhân viên phục vụ kiêm thiết kế tại Y-Mart" },
                { period: "T3/2024 – T9/2024", role: "Thực tập sinh — Thiết kế tại FBI Pro Services & UI tại QB Software" },
                { period: "2021 – 2025", role: "Cộng tác viên — Truyền thông & Thiết kế sự kiện Khoa" },
              ].map((exp, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6"
                >
                  <span className="text-white/40 font-body text-xs w-36 shrink-0">{exp.period}</span>
                  <div className="hidden md:block h-px flex-1 bg-white/10" />
                  <span className="text-white/80 font-body font-light text-sm">{exp.role}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}