import type { backendInterface } from "@/backend";
import SafeImage from "@/components/SafeImage";
import { useActor } from "@/hooks/useActor";
import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { useEffect, useState } from "react";

type PublicActor = backendInterface & {
  getPublicMediaAssetById?: (
    id: bigint,
  ) => Promise<{ data: Uint8Array; mimeType: string } | null>;
};

function fetchPublicMedia(
  actor: PublicActor,
  id: bigint,
): Promise<{ data: Uint8Array; mimeType: string } | null> {
  if (typeof actor.getPublicMediaAssetById === "function") {
    return actor.getPublicMediaAssetById(id);
  }
  return actor.getMediaAssetById(id);
}

export default function CTABanner() {
  const { data: settings } = useGetWebsiteSettings();
  const { actor } = useActor();
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const bannerImageId = settings?.ctaBannerImageId ?? null;

  useEffect(() => {
    if (!bannerImageId || !actor) {
      return;
    }

    let cancelled = false;
    fetchPublicMedia(actor as PublicActor, bannerImageId)
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
  }, [bannerImageId, actor]);

  const imageSrc = bannerUrl || "/assets/uploads/CTA_Banner-1.png";

  return (
    <section className="w-full my-0">
      <div className="container px-0">
        <SafeImage
          src={imageSrc}
          alt="CTA Banner"
          className="w-full h-auto"
          placeholderClassName="w-full h-[200px] bg-gray-100"
        />
      </div>
    </section>
  );
}
