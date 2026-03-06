import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { data: settings } = useGetWebsiteSettings();

  const siteName = settings?.siteName || "Mitsubishi Srikandi Subang";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);

  const menuItems = [
    { label: "Beranda", href: "/" },
    { label: "Mobil Keluarga", href: "/mobil-keluarga" },
    { label: "Mobil Niaga", href: "/mobil-niaga" },
    { label: "Promo", href: "/promo" },
    { label: "Testimoni", href: "/testimoni" },
    { label: "Blog", href: "/blog" },
    { label: "Hubungi Kami", href: "/kontak" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#262729] shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Site Title */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src="/assets/logomitsubishi-1.png"
              alt="Mitsubishi Srikandi Subang Logo"
              className="h-10"
            />
            <span className="text-white font-bold text-base md:text-lg">
              {siteName}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-white hover:text-[#C90010] font-medium transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-[#262729] border-t border-gray-700 animate-in slide-in-from-top absolute left-0 right-0 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block py-2 text-white hover:text-[#C90010] font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
