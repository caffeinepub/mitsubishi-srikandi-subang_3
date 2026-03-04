import {
  Car,
  FileText,
  Home,
  MessageSquare,
  Phone,
  Tag,
  Truck,
} from "lucide-react";

interface HeroSectionProps {
  pathname: string;
}

export default function HeroSection({ pathname }: HeroSectionProps) {
  const getHeroConfig = () => {
    if (pathname === "/") {
      return { title: "Beranda", icon: Home, bg: "#C90010", subtext: "" };
    }
    if (
      pathname === "/mobil-keluarga" ||
      pathname.startsWith("/mobil-keluarga/")
    ) {
      return {
        title: "Mobil Keluarga",
        icon: Car,
        bg: "#C90010",
        subtext:
          "Pilihan sempurna untuk keluarga Indonesia dengan kenyamanan, keamanan dan efisiensi terbaik.",
      };
    }
    if (pathname === "/mobil-niaga") {
      return {
        title: "Mobil Niaga",
        icon: Truck,
        bg: "#F1C40F",
        subtext:
          "Memilih Mitsubishi FUSO adalah keputusan tepat yang akan menjadikan usaha berkembang pesat.",
      };
    }
    if (pathname === "/mobil-niaga/light-duty") {
      return {
        title: "Light Duty",
        icon: Truck,
        bg: "#F1C40F",
        subtext:
          "Kendaraan Ringan dengan efisiensi tinggi, cocok untuk distribusi urban dan pengiriman barang ringan hingga menengah.",
      };
    }
    if (pathname === "/mobil-niaga/medium-duty") {
      return {
        title: "Medium Duty",
        icon: Truck,
        bg: "#F1C40F",
        subtext:
          "Kendaraan niaga kelas menengah yang tangguh, andal untuk pengiriman jarak jauh dan beban berat.",
      };
    }
    if (pathname === "/mobil-niaga/tractor-head") {
      return {
        title: "Tractor Head",
        icon: Truck,
        bg: "#F1C40F",
        subtext:
          "Solusi ideal untuk truk trailer, kuat, efisien, dan siap menaklukkan perjalanan panjang.",
      };
    }
    if (pathname.startsWith("/promo")) {
      return {
        title: "Promo",
        icon: Tag,
        bg: "#C90010",
        subtext:
          "Dapatkan penawaran menarik, diskon, dan paket spesial untuk semua tipe Mitsubishi.",
      };
    }
    if (pathname.startsWith("/testimoni")) {
      return {
        title: "Testimoni",
        icon: MessageSquare,
        bg: "#C90010",
        subtext: "Kepuasan pelanggan adalah prioritas utama kami.",
      };
    }
    if (pathname.startsWith("/blog")) {
      return {
        title: "Blog & Artikel",
        icon: FileText,
        bg: "#C90010",
        subtext: "Tips dan informasi seputar Mitsubishi serta dunia otomotif.",
      };
    }
    if (pathname.startsWith("/kontak")) {
      return {
        title: "Hubungi Kami",
        icon: Phone,
        bg: "#C90010",
        subtext: "Hubungi kami untuk konsultasi dan informasi lebih lanjut.",
      };
    }
    if (pathname.startsWith("/simulasi-kredit")) {
      return {
        title: "Simulasi Kredit",
        icon: Car,
        bg: "#C90010",
        subtext:
          "Hitung cicilan dan rencanakan pembelian mobil Mitsubishi sesuai kemampuan finansial kamu.",
      };
    }
    return { title: "Beranda", icon: Home, bg: "#C90010", subtext: "" };
  };

  const config = getHeroConfig();
  const Icon = config.icon;

  // Check if current page is Mobil Niaga or any of its subpages
  const isMobilNiagaPage = pathname.startsWith("/mobil-niaga");
  const textColor = isMobilNiagaPage ? "text-black" : "text-white";

  return (
    <div
      className="h-auto py-8 flex items-center justify-center"
      style={{ backgroundColor: config.bg }}
    >
      <div className="container mx-auto px-4 flex flex-col items-center justify-center text-center space-y-3">
        <div className="flex items-center justify-center space-x-4">
          <Icon className={textColor} size={32} />
          <h1 className={`${textColor} text-3xl md:text-4xl font-bold`}>
            {config.title}
          </h1>
        </div>
        {config.subtext && (
          <p className={`${textColor} text-base md:text-lg max-w-3xl`}>
            {config.subtext}
          </p>
        )}
      </div>
    </div>
  );
}
