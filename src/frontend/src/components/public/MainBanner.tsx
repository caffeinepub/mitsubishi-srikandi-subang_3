import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { createBlobUrlFromData } from '@/utils/blobUrl';

export default function MainBanner() {
  const { data: mediaAssets, isLoading } = useGetAllMediaAssets();
  const [imageUrl, setImageUrl] = useState<string>('/assets/generated/main-banner.dim_1920x600.png');

  // Find the Main Banner image by filename
  const mainBannerAsset = mediaAssets?.find(
    (asset) => asset.filename === 'Main Banner.png' || asset.filename.toLowerCase().includes('main banner')
  );

  useEffect(() => {
    if (mainBannerAsset && mainBannerAsset.data) {
      // Create blob URL from persistent canister storage data
      const blobUrl = createBlobUrlFromData(mainBannerAsset.data, mainBannerAsset.mimeType);
      setImageUrl(blobUrl);

      // Cleanup blob URL on unmount
      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } else {
      // Fallback to generated static image
      setImageUrl('/assets/generated/main-banner.dim_1920x600.png');
    }
  }, [mainBannerAsset]);

  if (isLoading) {
    return (
      <section className="w-full">
        <Skeleton className="w-full aspect-[1920/600]" />
      </section>
    );
  }

  return (
    <section className="w-full">
      <div className="w-full aspect-[1920/600] relative overflow-hidden">
        <img
          src={imageUrl}
          alt="Main Banner"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to generated asset if the dynamic URL fails
            const target = e.target as HTMLImageElement;
            if (target.src !== '/assets/generated/main-banner.dim_1920x600.png') {
              target.src = '/assets/generated/main-banner.dim_1920x600.png';
            }
          }}
        />
      </div>
    </section>
  );
}
