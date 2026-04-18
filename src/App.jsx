import { ReactLenis } from 'lenis/react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import FeaturesChess from "./components/FeaturesChess";
import FeaturesGrid from "./components/FeaturesGrid";
import Stats from "./components/Stats";
import ProjectsSection from "./components/ProjectsSection";
import Testimonials from "./components/Testimonials";
import ContactSection from "./components/ContactSection";
import CtaFooter from "./components/CtaFooter";
import ScrollProgress from "./components/ScrollProgress";
import CustomCursor from "./components/CustomCursor";

export default function App() {
  // --- CẤU HÌNH VẬT LÝ CHO LENIS (CINEMATIC SCROLL) ---
  const lenisOptions = {
    lerp: 0.06, // Nội suy tuyến tính: 0.06 tạo cảm giác cuộn đầm, lả lướt (mặc định 0.1)
    wheelMultiplier: 1, // Giữ nguyên gia tốc cuộn chuột tiêu chuẩn
    smoothWheel: true,
    touchMultiplier: 1.5, // Tăng nhẹ tốc độ vuốt trên màn hình cảm ứng để tránh cảm giác bị rít
    infinite: false,
  };

  return (
    // Thuộc tính `root` cực kỳ quan trọng: nó báo cho Lenis chiếm quyền thanh cuộn mặc định của window
    <ReactLenis root options={lenisOptions}>
      <div 
        // Bổ sung selection:bg-white/30 để khi bôi đen text sẽ có màu highlight mờ sang trọng
        className="bg-black min-h-screen text-white selection:bg-white/20 selection:text-white" 
        style={{ cursor: "none" }}
      >
        {/* Các component trôi nổi độc lập (Fixed/Absolute) */}
        <CustomCursor />
        <ScrollProgress />

        {/* Khối nội dung chính */}
        <div className="relative z-10 flex flex-col">
          <Navbar />
          <Hero />
          
          {/* Mình đã xóa thẻ <div className="bg-black"> bọc ngoài các section này ở code cũ của bạn.
              Vì thẻ div cha đã có bg-black rồi, việc bọc thêm chỉ làm sâu cây DOM, giảm hiệu năng render. */}
          <AboutSection />
          <FeaturesChess />
          <FeaturesGrid />
          <Stats />
          <ProjectsSection />
          <Testimonials />
          <ContactSection />
          <CtaFooter />
        </div>
      </div>
    </ReactLenis>
  );
}