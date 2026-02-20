import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import { Skeleton } from '@/components/ui/skeleton';

export default function MainBanner() {
  const { data: mediaAssets, isLoading, error } = useGetAllMediaAssets();

  // Find the Main Banner image by filename
  const mainBannerAsset = mediaAssets?.find(
    (asset) => asset.filename === 'Main Banner.png' || asset.filename.toLowerCase().includes('main banner')
  );

  if (isLoading) {
    return (
      <section className="w-full">
        <Skeleton className="w-full aspect-[1920/600]" />
      </section>
    );
  }

  // Use the asset ID to construct the direct URL for streaming if available
  // Otherwise fallback to generated static image
  const imageUrl = mainBannerAsset 
    ? `/api/v2/canister/${mainBannerAsset.assetId}`
    : '/assets/generated/main-banner.dim_1920x600.png';

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
