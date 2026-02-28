import { useGetWebsiteSettings } from '@/hooks/useWebsiteSettings';
import { useGetMediaAssetById } from '@/hooks/useMediaAssets';
import { createBlobUrlFromData } from '@/utils/blobUrl';
import { useEffect, useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';

export default function CTABanner() {
  const { data: settings } = useGetWebsiteSettings();
  const { identity } = useInternetIdentity();

  // Only attempt to load media asset if user is authenticated
  // (getMediaAssetById requires #user permission)
  const isAuthenticated = !!identity;
  const bannerImageId = isAuthenticated ? (settings?.ctaBannerImageId ?? null) : null;
  const { data: bannerAsset } = useGetMediaAssetById(bannerImageId);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    if (bannerAsset?.data) {
      try {
        const url = createBlobUrlFromData(bannerAsset.data, bannerAsset.mimeType);
        setBannerUrl(url);
        return () => URL.revokeObjectURL(url);
      } catch {
        setBannerUrl(null);
      }
    } else {
      setBannerUrl(null);
    }
  }, [bannerAsset]);

  const imageSrc = bannerUrl || '/assets/generated/cta-banner.dim_1920x400.png';

  // Build WhatsApp link from settings
  const waNumber = settings?.contactWhatsapp
    ? settings.contactWhatsapp.replace(/\D/g, '')
    : '6281234567890';
  const waLink = `https://wa.me/${waNumber}`;

  return (
    <section className="relative w-full h-[300px] md:h-[400px] overflow-hidden my-12">
      <img
        src={imageSrc}
        alt="CTA Banner"
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Dapatkan Penawaran Terbaik
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Hubungi kami sekarang untuk promo spesial
          </p>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-full transition-colors"
          >
            Hubungi via WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
