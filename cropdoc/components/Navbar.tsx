"use client";

interface NavbarProps {
  onNavigate: (page: "landing" | "diagnose") => void;
  onToggleChat: () => void;
  chatBadge: boolean;
}

export default function Navbar({ onNavigate, onToggleChat, chatBadge }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 border-b border-green-600/10"
      style={{ background: "rgba(250,250,247,.88)", backdropFilter: "blur(14px) saturate(160%)" }}>
      <div className="max-w-[1100px] mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => onNavigate("landing")}
          className="flex items-center gap-2 font-serif text-[22px] text-green-700 tracking-tight no-underline"
        >
          <div className="w-[34px] h-[34px] rounded-[50%_50%_50%_10%] bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-[17px] shadow-[0_2px_8px_rgba(22,163,74,.3)] animate-leaf-sway">
            🌿
          </div>
          CropDoc
        </button>

        {/* Right buttons */}
        <div className="flex items-center gap-2.5">
          {/* Ask CropDoc chat button */}
          <button
            onClick={onToggleChat}
            className="relative inline-flex items-center gap-1.5 font-sans font-semibold text-sm px-[22px] py-[10px] rounded-lg bg-white text-green-700 border-[1.5px] border-green-300 shadow-sm hover:bg-green-50 hover:border-green-500 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(22,163,74,.15)] transition-all duration-200"
          >
            💬 Ask CropDoc
            {chatBadge && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center border-2 border-white">
                1
              </span>
            )}
          </button>

          {/* Diagnose button */}
          <button
            onClick={() => onNavigate("diagnose")}
            className="inline-flex items-center gap-1.5 font-sans font-semibold text-sm px-[22px] py-[10px] rounded-lg bg-gradient-to-br from-green-600 to-green-700 text-white shadow-[0_2px_8px_rgba(22,163,74,.3)] hover:from-green-500 hover:to-green-600 hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(22,163,74,.35)] transition-all duration-200"
          >
            Diagnose My Crop
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
