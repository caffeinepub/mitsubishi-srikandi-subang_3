import { SiFacebook, SiInstagram, SiTiktok, SiYoutube, SiX } from 'react-icons/si';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';
import { useGetVisitorStats } from '@/hooks/useVisitorStats';
import { Skeleton } from '@/components/ui/skeleton';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'mitsubishi-srikandi-subang';
  
  const { data: visitorStats, isLoading } = useGetVisitorStats();

  const formatNumber = (num: bigint | undefined): string => {
    if (num === undefined) return '0';
    return Number(num).toLocaleString('id-ID');
  };

  return (
    <footer className="bg-[#262729] text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <img
              src="/assets/logomitsubishi-1.png"
              alt="Mitsubishi Motors Logo"
              className="h-16 mb-4"
            />
            <p className="text-gray-300 text-sm leading-relaxed">
              Dealer resmi Mitsubishi di Subang, Jawa Barat. Melayani penjualan mobil keluarga dan niaga dengan layanan terbaik.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hubungi Kami</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Phone size={18} className="mt-0.5 flex-shrink-0 text-[#C90010]" />
                <span>0852-1234-0778</span>
              </div>
              <div className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0 text-[#C90010]" />
                <span>fuadmitsubishi2025@gmail.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="mt-0.5 flex-shrink-0 text-[#C90010]" />
                <span>Jl. Otto Iskandardinata No.314, Subang, Jawa Barat 41211</span>
              </div>
            </div>
          </div>

          {/* Social Media & Hours */}
          <div>
            <h3 className="text-lg font-bold mb-4">Ikuti Kami</h3>
            <div className="flex space-x-3 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] hover:bg-[#A00008] flex items-center justify-center transition-colors"
              >
                <SiFacebook size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] hover:bg-[#A00008] flex items-center justify-center transition-colors"
              >
                <SiInstagram size={20} />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] hover:bg-[#A00008] flex items-center justify-center transition-colors"
              >
                <SiX size={20} />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] hover:bg-[#A00008] flex items-center justify-center transition-colors"
              >
                <SiTiktok size={20} />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-[#C90010] hover:bg-[#A00008] flex items-center justify-center transition-colors"
              >
                <SiYoutube size={20} />
              </a>
            </div>
            <div className="text-sm text-gray-300">
              <p className="font-semibold mb-1">Jam Operasional:</p>
              <p>Senin - Sabtu: 08:30 - 16:00</p>
            </div>
          </div>
        </div>

        {/* Visitor Stats */}
        <div className="border-t border-gray-700 pt-8 mb-8">
          <h3 className="text-lg font-bold mb-6 text-center">Statistik Pengunjung</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-20 mx-auto mb-2 bg-gray-700" />
              ) : (
                <div className="text-2xl font-bold text-[#C90010] mb-1">
                  {formatNumber(visitorStats?.totalVisitors)}
                </div>
              )}
              <div className="text-sm text-gray-400">Total Pengunjung</div>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-20 mx-auto mb-2 bg-gray-700" />
              ) : (
                <div className="text-2xl font-bold text-[#C90010] mb-1">
                  {formatNumber(visitorStats?.weeklyVisitors)}
                </div>
              )}
              <div className="text-sm text-gray-400">Pengguna Aktif</div>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-20 mx-auto mb-2 bg-gray-700" />
              ) : (
                <div className="text-2xl font-bold text-[#C90010] mb-1">
                  {formatNumber(visitorStats?.pageViews)}
                </div>
              )}
              <div className="text-sm text-gray-400">Tampilan Halaman</div>
            </div>
            <div className="text-center">
              {isLoading ? (
                <Skeleton className="h-8 w-20 mx-auto mb-2 bg-gray-700" />
              ) : (
                <div className="text-2xl font-bold text-[#C90010] mb-1">
                  {formatNumber(visitorStats?.dailyVisitors)}
                </div>
              )}
              <div className="text-sm text-gray-400">Trafik Hari Ini</div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p className="mb-2">
            © {currentYear} Mitsubishi Srikandi Subang. All rights reserved.
          </p>
          <p className="flex items-center justify-center space-x-1">
            <span>Built with</span>
            <Heart size={14} className="text-[#C90010] fill-current" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C90010] hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
