import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import type { MediaAsset } from '@/types/local';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface BannerImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageId: string) => void;
  currentImageId?: string;
  bannerType: 'main' | 'cta';
}

export default function BannerImagePicker({
  open,
  onOpenChange,
  onSelect,
  currentImageId,
  bannerType,
}: BannerImagePickerProps) {
  const { data: allAssets } = useGetAllMediaAssets();
  const [selectedId, setSelectedId] = useState<string>(currentImageId || '');

  // Filter assets that are images and contain "banner" in filename
  const bannerAssets = (allAssets as MediaAsset[] || []).filter(
    (asset) =>
      asset.mimeType.startsWith('image/') &&
      asset.filename.toLowerCase().includes('banner')
  );

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
      onOpenChange(false);
    }
  };

  const dimensionText =
    bannerType === 'main'
      ? 'Rekomendasi: 1920x600px'
      : 'Rekomendasi: 1920x400px';

  const getImageUrl = (blobId: string): string => {
    return `/api/blob/${blobId}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pilih Banner Image</DialogTitle>
          <p className="text-sm text-gray-500">{dimensionText}</p>
        </DialogHeader>
        <div className="py-4">
          {bannerAssets.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              Tidak ada gambar banner. Upload gambar dengan nama yang mengandung "banner".
            </p>
          ) : (
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="grid grid-cols-2 gap-4">
                {bannerAssets.map((asset) => (
                  <div
                    key={asset.id.toString()}
                    className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
                      selectedId === asset.blobId
                        ? 'ring-2 ring-primary'
                        : 'hover:border-primary'
                    }`}
                    onClick={() => setSelectedId(asset.blobId)}
                  >
                    <div className="aspect-[16/5] bg-gray-100">
                      <img
                        src={getImageUrl(asset.blobId)}
                        alt={asset.filename}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3 flex items-center gap-2">
                      <RadioGroupItem value={asset.blobId} id={asset.blobId} />
                      <Label
                        htmlFor={asset.blobId}
                        className="text-sm font-medium cursor-pointer flex-1"
                      >
                        {asset.filename}
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            Pilih
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
