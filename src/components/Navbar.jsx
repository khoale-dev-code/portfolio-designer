import { ArrowUpRight } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="fixed top-4 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-3">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="h-10 w-10 rounded-full bg-white/10 liquid-glass flex items-center justify-center">
          <span className="font-heading italic text-white text-lg">QB</span>
        </div>
        <span className="font-body font-medium text-white text-sm hidden sm:block">Quốc Bảo</span>
      </div>

      {/* Center nav links */}
      <div className="hidden md:flex items-center liquid-glass rounded-full px-1.5 py-1 gap-1">
        {["Home", "About", "Work", "Skills", "Contact"].map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className="px-3 py-2 text-sm font-medium text-white/90 font-body hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            {item}
          </a>
        ))}
        <a
          href="#contact"
          className="flex items-center gap-1 bg-white text-black rounded-full px-3.5 py-1.5 text-sm font-body font-medium hover:bg-white/90 transition-colors"
        >
          Hire Me <ArrowUpRight size={14} />
        </a>
      </div>

      {/* Mobile hire me */}
      <a
        href="#contact"
        className="md:hidden flex items-center gap-1 bg-white text-black rounded-full px-3.5 py-1.5 text-sm font-body font-medium"
      >
        Hire Me <ArrowUpRight size={14} />
      </a>
    </nav>
  );
}