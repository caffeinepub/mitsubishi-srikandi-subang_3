import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useDeleteMediaAsset,
  useGetAllMediaAssets,
} from "@/hooks/useMediaAssets";
import type { MediaAsset } from "@/types/local";
import {
  createBlobUrlFromData,
  isImageMimeType,
  isPdfMimeType,
} from "@/utils/blobUrl";
import { validateDelegationIdentity } from "@/utils/validation";
import { Car, Copy, FileText, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function MediaAssetGrid() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const { data: assets, isLoading, error } = useGetAllMediaAssets();
  const deleteAsset = useDeleteMediaAsset();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(
    new Set(),
  );
  const [blobUrls, setBlobUrls] = useState<Map<string, string>>(new Map());

  // Create blob URLs from persistent canister storage data
  useEffect(() => {
    if (!assets) return;

    const newBlobUrls = new Map<string, string>();

    for (const asset of assets) {
      if (isImageMimeType(asset.mimeType) && asset.data) {
        const blobUrl = createBlobUrlFromData(asset.data, asset.mimeType);
        newBlobUrls.set(asset.id.toString(), blobUrl);
      }
    }

    setBlobUrls(newBlobUrls);

    // Cleanup function to revoke blob URLs created in this effect run
    return () => {
      for (const url of newBlobUrls.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, [assets]);

  const handleCopyId = (assetId: bigint) => {
    navigator.clipboard.writeText(assetId.toString());
    toast.success("ID asset berhasil disalin");
  };

  const handleDeleteClick = (asset: MediaAsset) => {
    console.log("[MediaAssetGrid] Delete clicked for asset:", asset.id);
    console.log("[MediaAssetGrid] Actor available:", !!actor);
    console.log("[MediaAssetGrid] Identity available:", !!identity);

    // Validate actor is ready
    if (!actor) {
      console.error("[MediaAssetGrid] Actor not available");
      toast.error("Sistem belum siap. Silakan tunggu sebentar dan coba lagi.");
      return;
    }

    // Validate delegation identity before opening delete dialog
    const validationError = validateDelegationIdentity(identity);
    if (validationError) {
      console.error(
        "[MediaAssetGrid] Delegation validation failed:",
        validationError,
      );
      toast.error(validationError);
      return;
    }

    console.log(
      "[MediaAssetGrid] All validations passed, opening delete dialog",
    );
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!assetToDelete) return;

    console.log(
      "[MediaAssetGrid] Confirming delete for asset:",
      assetToDelete.id,
    );

    // Final validation: Check actor is still available
    if (!actor) {
      console.error("[MediaAssetGrid] Actor not available at confirm");
      toast.error("Sistem belum siap. Silakan tunggu sebentar dan coba lagi.");
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
      return;
    }

    // Final validation: Validate delegation identity again before actual delete
    const validationError = validateDelegationIdentity(identity);
    if (validationError) {
      console.error(
        "[MediaAssetGrid] Delegation validation failed at confirm:",
        validationError,
      );
      toast.error(validationError);
      setDeleteDialogOpen(false);
      setAssetToDelete(null);
      return;
    }

    console.log(
      "[MediaAssetGrid] All final validations passed, executing delete mutation",
    );

    // Execute delete mutation - the authenticated actor will be used
    deleteAsset.mutate(assetToDelete.id, {
      onSuccess: () => {
        console.log("[MediaAssetGrid] Delete successful, closing dialog");
        setDeleteDialogOpen(false);
        setAssetToDelete(null);
      },
      onError: (error) => {
        console.error("[MediaAssetGrid] Delete failed:", error);
        setDeleteDialogOpen(false);
        setAssetToDelete(null);
      },
    });
  };

  const handleImageError = (assetId: string) => {
    console.error("[MediaAssetGrid] Image load error for asset ID:", assetId);
    setImageLoadErrors((prev) => new Set(prev).add(assetId));
  };

  // Show loading state while actor is initializing or data is loading
  if (isLoading || actorFetching) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton placeholders never reorder
          <Skeleton key={`skeleton-${i}`} className="aspect-square" />
        ))}
      </div>
    );
  }

  // Show error state if there's an error (but not auth errors which return empty array)
  if (error && !error.message?.includes("Actor not available")) {
    console.error("[MediaAssetGrid] Error loading media assets:", error);
    return (
      <div className="text-center py-8 text-red-500">
        Gagal memuat media. Silakan coba lagi.
      </div>
    );
  }

  if (!assets || assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada media. Upload file untuk menambahkan.
      </div>
    );
  }

  // Actor is ready when it exists and is not fetching
  const isActorReady = !!actor && !actorFetching;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map((asset) => {
          const isImage = isImageMimeType(asset.mimeType);
          const isPdf = isPdfMimeType(asset.mimeType);
          const assetIdStr = asset.id.toString();
          const hasLoadError = imageLoadErrors.has(assetIdStr);
          const imageUrl = blobUrls.get(assetIdStr) || "";

          return (
            <div key={assetIdStr} className="border rounded-lg overflow-hidden">
              {/* Asset Preview Section */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {isPdf ? (
                  <div className="text-gray-400 text-center p-4">
                    <FileText className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{asset.filename}</p>
                    <p className="text-xs">PDF Document</p>
                  </div>
                ) : isImage && !hasLoadError && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={asset.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(assetIdStr)}
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <Car className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{asset.filename}</p>
                    <p className="text-xs">
                      {hasLoadError
                        ? "Gagal memuat gambar"
                        : "File tidak didukung"}
                    </p>
                  </div>
                )}
              </div>

              {/* Asset Actions Section */}
              <div className="p-3 bg-white border-t">
                <p
                  className="text-sm font-medium truncate mb-2"
                  title={asset.filename}
                >
                  {asset.filename}
                </p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyId(asset.id)}
                    className="w-full"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy ID
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(asset)}
                    disabled={!isActorReady || deleteAsset.isPending}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {deleteAsset.isPending && assetToDelete?.id === asset.id
                      ? "Menghapus..."
                      : "Hapus"}
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus file "{assetToDelete?.filename}
              "? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setAssetToDelete(null);
              }}
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
