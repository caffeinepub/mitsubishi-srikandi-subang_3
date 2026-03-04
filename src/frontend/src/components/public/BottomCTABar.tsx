import { Link } from "@tanstack/react-router";
import { Calculator, Menu, MessageCircle, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function BottomCTABar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Mobil Keluarga", href: "/mobil-keluarga" },
    { label: "Mobil Niaga", href: "/mobil-niaga" },
    { label: "Promo", href: "/promo" },
    { label: "Testimoni", href: "/testimoni" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/kontak" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      {/* Dropdown Menu - positioned above the blue button */}
      {menuOpen && (
        <div className="absolute bottom-[50px] right-0 w-64 mb-1">
          <div
            ref={menuRef}
            className="bg-white border shadow-lg rounded-t-lg animate-in slide-in-from-bottom"
          >
            <div className="max-h-[300px] overflow-y-auto">
              {menuItems.map((item, index) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                    index < menuItems.length - 1 ? "border-b" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CTA Bar */}
      <div className="bg-white border-t shadow-lg h-[50px] flex items-center">
        <button
          type="button"
          onClick={() => {
            window.location.href = "tel:0260123456";
          }}
          className="flex-1 h-full flex flex-col items-center justify-center bg-[#C90010] text-white hover:bg-[#A00008] transition-colors"
        >
          <Phone size={18} />
          <span className="text-xs mt-1">Call</span>
        </button>
        <button
          type="button"
          onClick={() => window.open("https://wa.me/6281234567890", "_blank")}
          className="flex-1 h-full flex flex-col items-center justify-center bg-[#398E3D] text-white hover:bg-[#2d7230] transition-colors"
        >
          <MessageCircle size={18} />
          <span className="text-xs mt-1">WhatsApp</span>
        </button>
        <Link
          to="/simulasi-kredit"
          className="flex-1 h-full flex flex-col items-center justify-center bg-[#FEA500] text-white hover:bg-[#e59400] transition-colors"
        >
          <Calculator size={18} />
          <span className="text-xs mt-1">Simulasi</span>
        </Link>
        <button
          type="button"
          ref={buttonRef}
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex-1 h-full flex flex-col items-center justify-center bg-[#0166C0] text-white hover:bg-[#0154a3] transition-colors"
        >
          <Menu size={18} />
          <span className="text-xs mt-1">Menu</span>
        </button>
      </div>
    </div>
  );
}
