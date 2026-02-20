import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { createBlobUrlFromData } from '@/utils/blobUrl';

export default function CTABanner() {
  const { data: mediaAssets, isLoading } = useGetAllMediaAssets();
  const [imageUrl, setImageUrl] = useState<string>('/assets/generated/cta-banner.dim_1920x400.png');

  // Find the CTA Banner image by filename
  const ctaBannerAsset = mediaAssets?.find(
    (asset) => asset.filename === 'CTA Banner.png' || asset.filename.toLowerCase().includes('cta banner')
  );

  useEffect(() => {
    if (ctaBannerAsset && ctaBannerAsset.data) {
      // Create blob URL from persistent canister storage data
      const blobUrl = createBlobUrlFromData(ctaBannerAsset.data, ctaBannerAsset.mimeType);
      setImageUrl(blobUrl);

      // Cleanup blob URL on unmount
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      // Fallback to generated static image
      setImageUrl('/assets/generated/cta-banner.dim_1920x400.png');
    }
  }, [ctaBannerAsset]);

  if (isLoading) {
    return (
      <section className="w-full bg-[#262729] py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="w-full aspect-[1920/400]" />
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-[#262729] py-8">
      <div className="container mx-auto px-4">
        <div className="w-full aspect-[1920/400] relative overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt="CTA Banner"
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to generated asset if the dynamic URL fails
              const target = e.target as HTMLImageElement;
              if (target.src !== '/assets/generated/cta-banner.dim_1920x400.png') {
                target.src = '/assets/generated/cta-banner.dim_1920x400.png';
              }
            }}
          />
        </div>
      </div>
    </section>
  );
}
