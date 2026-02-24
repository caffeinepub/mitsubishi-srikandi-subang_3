import { useGetWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useGetMediaAssetById } from '@/hooks/useMediaAssets';
import { createBlobUrlFromData } from '@/utils/blobUrl';
import { useEffect, useState } from 'react';

export default function MainBanner() {
  const { data: settings } = useGetWebsiteSettings();
  // Convert undefined to null so useGetMediaAssetById accepts it
  const bannerImageId = settings?.mainBannerImageId ?? null;
  const { data: bannerAsset } = useGetMediaAssetById(bannerImageId);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bannerAsset?.data) {
      try {
        const url = createBlobUrlFromData(bannerAsset.data, bannerAsset.mimeType);
        setBannerUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('[MainBanner] Error creating blob URL:', error);
        setBannerUrl(null);
      }
    } else {
      setBannerUrl(null);
    }
  }, [bannerAsset]);

  const imageSrc = bannerUrl || '/assets/generated/main-banner.dim_1920x600.png';

  return (
    <section className="relative w-full h-[400px] md:h-[600px] overflow-hidden">
      <img
        src={imageSrc}
        alt="Main Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Mitsubishi Srikandi Subang
          </h1>
          <p className="text-lg md:text-2xl drop-shadow-md">
            Dealer Resmi Mitsubishi di Subang
          </p>
        </div>
      </div>
    </section>
  );
}
