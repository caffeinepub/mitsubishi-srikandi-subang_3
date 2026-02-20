import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import { Skeleton } from '@/components/ui/skeleton';

export default function CTABanner() {
  const { data: mediaAssets, isLoading, error } = useGetAllMediaAssets();

  // Find the CTA Banner image by filename
  const ctaBannerAsset = mediaAssets?.find(
    (asset) => asset.filename === 'CTA Banner.png' || asset.filename.toLowerCase().includes('cta banner')
  );

  if (isLoading) {
    return (
      <section className="w-full bg-[#262729] py-8">
        <div className="container mx-auto px-4">
          <Skeleton className="w-full aspect-[1920/400]" />
        </div>
      </section>
    );
  }

  // Use the asset ID to construct the direct URL for streaming if available
  // Otherwise fallback to generated static image
  const imageUrl = ctaBannerAsset 
    ? `/api/v2/canister/${ctaBannerAsset.assetId}`
    : '/assets/generated/cta-banner.dim_1920x400.png';

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
