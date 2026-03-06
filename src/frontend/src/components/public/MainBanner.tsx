import { useActor } from "@/hooks/useActor";
import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { useEffect, useState } from "react";

export default function MainBanner() {
  const { data: settings } = useGetWebsiteSettings();
  const { actor, isFetching } = useActor();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const bannerImageId = settings?.mainBannerImageId ?? null;

  useEffect(() => {
    if (!bannerImageId || !actor || isFetching) {
      return;
    }

    let cancelled = false;
    actor
      .getMediaAssetById(bannerImageId)
      .then((asset) => {
        if (cancelled) return;
        if (asset?.data) {
          try {
            const url = createBlobUrlFromData(asset.data, asset.mimeType);
            setBannerUrl(url);
          } catch {
            setBannerUrl(null);
          }
        }
      })
      .catch(() => {
        if (!cancelled) setBannerUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [bannerImageId, actor, isFetching]);

  const imageSrc =
    bannerUrl || "/assets/generated/main-banner.dim_1920x600.png";

  return (
    <section className="relative w-full h-[150px] md:h-[600px] overflow-hidden">
      <img
        src={imageSrc}
        alt="Main Banner"
        className="w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-2xl md:text-5xl font-bold mb-1 md:mb-3 drop-shadow-lg">
            Selamat Datang di Website
          </h1>
          <h2 className="text-xl md:text-4xl font-bold mb-1 md:mb-3 drop-shadow-lg text-[#C90010]">
            Mitsubishi Srikandi Subang
          </h2>
          <p className="text-sm md:text-xl drop-shadow-md">
            Dealer resmi mobil Mitsubishi di Subang
          </p>
        </div>
      </div>
    </section>
  );
}
