import MainBanner from '@/components/public/MainBanner';
import HighlightMobilKeluarga from '@/components/public/HighlightMobilKeluarga';
import HighlightMobilNiaga from '@/components/public/HighlightMobilNiaga';
import CTABanner from '@/components/public/CTABanner';
import TentangKami from '@/components/public/TentangKami';
import SpecialFeatures from '@/components/public/SpecialFeatures';
import SearchProduk from '@/components/public/SearchProduk';
import ArtikelTerbaru from '@/components/public/ArtikelTerbaru';
import ProdukUnggulan from '@/components/public/ProdukUnggulan';

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
