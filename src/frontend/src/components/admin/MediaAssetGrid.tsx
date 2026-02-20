import { useState } from 'react';
import { Copy, Trash2, FileText, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllMediaAssets, useDeleteMediaAsset } from '@/hooks/useMediaAssets';
import type { MediaAsset } from '@/types/local';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getBlobUrl, isImageMimeType, isPdfMimeType } from '@/utils/blobUrl';

export default function MediaAssetGrid() {
  const { data: assets, isLoading } = useGetAllMediaAssets();
  const deleteAsset = useDeleteMediaAsset();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assetToDelete, setAssetToDelete] = useState<MediaAsset | null>(null);
  const [imageLoadErrors, setImageLoadErrors] = useState<Set<string>>(new Set());

  const handleCopyId = (assetId: bigint) => {
    navigator.clipboard.writeText(assetId.toString());
    toast.success('ID asset berhasil disalin');
  };

  const handleDeleteClick = (asset: MediaAsset) => {
    setAssetToDelete(asset);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (assetToDelete) {
      deleteAsset.mutate(assetToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setAssetToDelete(null);
        },
      });
    }
  };

  const handleImageError = (blobId: string) => {
    console.error('[MediaAssetGrid] Image load error for blobId:', blobId);
    setImageLoadErrors((prev) => new Set(prev).add(blobId));
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="aspect-square" />
        ))}
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {assets.map((asset) => {
          const isImage = isImageMimeType(asset.mimeType);
          const isPdf = isPdfMimeType(asset.mimeType);
          const hasLoadError = imageLoadErrors.has(asset.blobId);
          const imageUrl = isImage ? getBlobUrl(asset.blobId) : '';

          return (
            <div key={asset.id.toString()} className="border rounded-lg overflow-hidden">
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {isPdf ? (
                  <div className="text-gray-400 text-center p-4">
                    <FileText className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{asset.filename}</p>
                    <p className="text-xs">PDF Document</p>
                  </div>
                ) : isImage && !hasLoadError ? (
                  <img
                    src={imageUrl}
                    alt={asset.filename}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={() => handleImageError(asset.blobId)}
                  />
                ) : (
                  <div className="text-gray-400 text-center p-4">
                    <Car className="h-16 w-16 mx-auto mb-2" />
                    <p className="text-sm font-medium">{asset.filename}</p>
                    <p className="text-xs">
                      {hasLoadError ? 'Gagal memuat gambar' : 'File tidak didukung'}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-2 space-y-2">
                <p className="text-sm font-medium truncate" title={asset.filename}>
                  {asset.filename}
                </p>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleCopyId(asset.id)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy ID
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(asset)}
                    disabled={deleteAsset.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus "{assetToDelete?.filename}"?
              <br />
              <br />
              <strong>Peringatan:</strong> Media yang sedang digunakan di konten lain akan menjadi tidak tersedia.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
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
