import { useActor } from "@/hooks/useActor";
import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { useEffect, useState } from "react";

export default function CTABanner() {
  const { data: settings } = useGetWebsiteSettings();
  const { actor, isFetching } = useActor();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const bannerImageId = settings?.ctaBannerImageId ?? null;

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

  const imageSrc = bannerUrl || "/assets/uploads/CTA_Banner-1.png";

  return (
    <section className="w-full my-0">
      <div className="container px-0">
        <img src={imageSrc} alt="CTA Banner" className="w-full h-auto" />
      </div>
    </section>
  );
}
