import type { backendInterface } from "@/backend";
import SafeImage from "@/components/SafeImage";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useGetWebsiteSettings } from "@/hooks/useWebsiteSettings";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { useEffect, useRef, useState } from "react";

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

export default function MainBanner() {
  const { data: settings, isLoading: settingsLoading } =
    useGetWebsiteSettings();
  const { actor } = useActor();

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [banner2Url, setBanner2Url] = useState<string | null>(null);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [flipping, setFlipping] = useState(false);
  const sliderTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const videoId = settings?.mainBannerVideoId ?? null;
  const imageId = settings?.mainBannerImageId ?? null;
  const imageId2 = settings?.mainBannerImageId2 ?? null;

  // Load video asset
  useEffect(() => {
    if (!videoId || !actor) {
      setVideoUrl(null);
      return;
    }
    let cancelled = false;
    fetchPublicMedia(actor as PublicActor, videoId)
      .then((asset) => {
        if (cancelled || !asset?.data) return;
        try {
          setVideoUrl(createBlobUrlFromData(asset.data, asset.mimeType));
        } catch {
          setVideoUrl(null);
        }
      })
      .catch(() => {
        if (!cancelled) setVideoUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [videoId, actor]);

  // Load image 1
  useEffect(() => {
    if (!imageId || !actor) {
      setBannerUrl(null);
      return;
    }
    let cancelled = false;
    fetchPublicMedia(actor as PublicActor, imageId)
      .then((asset) => {
        if (cancelled || !asset?.data) return;
        try {
          setBannerUrl(createBlobUrlFromData(asset.data, asset.mimeType));
        } catch {
          setBannerUrl(null);
        }
      })
      .catch(() => {
        if (!cancelled) setBannerUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [imageId, actor]);

  // Load image 2
  useEffect(() => {
    if (!imageId2 || !actor) {
      setBanner2Url(null);
      return;
    }
    let cancelled = false;
    fetchPublicMedia(actor as PublicActor, imageId2)
      .then((asset) => {
        if (cancelled || !asset?.data) return;
        try {
          setBanner2Url(createBlobUrlFromData(asset.data, asset.mimeType));
        } catch {
          setBanner2Url(null);
        }
      })
      .catch(() => {
        if (!cancelled) setBanner2Url(null);
      });
    return () => {
      cancelled = true;
    };
  }, [imageId2, actor]);

  // Determine display mode based on homepageBannerMode
  const mode = settings?.homepageBannerMode ?? "1 image";

  const resolveMode = () => {
    if (mode === "video") {
      if (videoUrl) return "video";
      if (bannerUrl) return "static";
      return "empty";
    }
    if (mode === "2 image") {
      if (bannerUrl && banner2Url) return "slider";
      if (bannerUrl) return "static";
      if (videoUrl) return "video";
      return "empty";
    }
    // "1 image" or default
    if (bannerUrl) return "static";
    return "empty";
  };

  const displayMode = resolveMode();
  const sliderImages = [bannerUrl, banner2Url].filter(Boolean) as string[];
  const isSlider = displayMode === "slider";

  // Slider auto-advance
  useEffect(() => {
    if (!isSlider) {
      if (sliderTimer.current) clearInterval(sliderTimer.current);
      return;
    }
    sliderTimer.current = setInterval(() => {
      setFlipping(true);
      setTimeout(() => {
        setSliderIndex((i) => (i + 1) % sliderImages.length);
        setFlipping(false);
      }, 500);
    }, 5000);
    return () => {
      if (sliderTimer.current) clearInterval(sliderTimer.current);
    };
  }, [isSlider, sliderImages.length]);

  if (settingsLoading) {
    return <Skeleton className="w-full h-[150px] md:h-[600px]" />;
  }

  const overlayText = (
    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
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
  );

  return (
    <section className="relative w-full h-[150px] md:h-[600px] overflow-hidden">
      {/* VIDEO MODE */}
      {displayMode === "video" && (
        <>
          <video
            key={videoUrl}
            src={videoUrl!}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {overlayText}
        </>
      )}

      {/* SLIDER MODE (2 images) */}
      {displayMode === "slider" && (
        <>
          <div
            className={`absolute inset-0 transition-all duration-500 ${
              flipping
                ? "-translate-y-full opacity-0"
                : "translate-y-0 opacity-100"
            }`}
            style={{ transitionTimingFunction: "ease-in-out" }}
          >
            <SafeImage
              src={sliderImages[sliderIndex]}
              alt="Main Banner"
              className="w-full h-full object-cover object-center"
              placeholderClassName="w-full h-full bg-[#C90010]"
            />
          </div>
          {overlayText}
        </>
      )}

      {/* STATIC IMAGE MODE */}
      {displayMode === "static" && (
        <>
          <SafeImage
            src={bannerUrl!}
            alt="Main Banner"
            className="absolute inset-0 w-full h-full object-cover object-center"
            placeholderClassName="w-full h-full bg-[#C90010]"
          />
          {overlayText}
        </>
      )}

      {/* EMPTY FALLBACK */}
      {displayMode === "empty" && (
        <>
          <div className="absolute inset-0 bg-black" />
          {overlayText}
        </>
      )}
    </section>
  );
}
