import ArtikelTerbaru from "@/components/public/ArtikelTerbaru";
import CTABanner from "@/components/public/CTABanner";
import HighlightMobilKeluarga from "@/components/public/HighlightMobilKeluarga";
import HighlightMobilNiaga from "@/components/public/HighlightMobilNiaga";
import MainBanner from "@/components/public/MainBanner";
import ProdukUnggulan from "@/components/public/ProdukUnggulan";
import SearchProduk from "@/components/public/SearchProduk";
import SpecialFeatures from "@/components/public/SpecialFeatures";
import TentangKami from "@/components/public/TentangKami";

export default function BerandaPage() {
  return (
    <div className="pb-16 md:pb-0">
      <MainBanner />
      <HighlightMobilKeluarga />
      <HighlightMobilNiaga />
      <CTABanner />
      <TentangKami />
      <SpecialFeatures />
      <SearchProduk />
      <ProdukUnggulan />
      <ArtikelTerbaru />
    </div>
  );
}
