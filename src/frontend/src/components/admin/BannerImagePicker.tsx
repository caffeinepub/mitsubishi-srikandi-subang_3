import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import type { MediaAsset } from '@/types/local';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createBlobUrlFromData } from '@/utils/blobUrl';
import { Skeleton } from '@/components/ui/skeleton';

interface BannerImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageId: bigint) => void;
  value?: bigint;
  bannerType: 'main' | 'cta';
}

export default function BannerImagePicker({
  open,
  onOpenChange,
  onSelect,
  value,
  bannerType,
}: BannerImagePickerProps) {
  const { data: allAssets, isLoading } = useGetAllMediaAssets();
  const [selectedId, setSelectedId] = useState<string>(value?.toString() || '');

  // Update selected ID when value prop changes
  useEffect(() => {
    console.log('[BannerImagePicker] Value prop changed:', value);
    setSelectedId(value?.toString() || '');
  }, [value]);

  // Filter images (only show image types)
  const imageAssets = allAssets?.filter((asset) =>
    asset.mimeType.startsWith('image/')
  ) || [];

  console.log('[BannerImagePicker] Rendering with:', {
    bannerType,
    value: value?.toString(),
    selectedId,
    imageCount: imageAssets.length,
  });

  const handleSelect = () => {
    if (selectedId) {
      console.log('[BannerImagePicker] Selecting image:', selectedId);
      onSelect(BigInt(selectedId));
    }
  };

  const handleValueChange = (newValue: string) => {
    console.log('[BannerImagePicker] Radio selection changed:', newValue);
    setSelectedId(newValue);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pilih {bannerType === 'main' ? 'Main Banner' : 'CTA Banner'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : imageAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada gambar yang tersedia. Silakan upload gambar terlebih dahulu di Media Manager.
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={selectedId} onValueChange={handleValueChange}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {imageAssets.map((asset) => {
                  const imageUrl = createBlobUrlFromData(asset.data, asset.mimeType);
                  const assetIdString = asset.id.toString();

                  return (
                    <div
                      key={assetIdString}
                      className={`border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedId === assetIdString
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleValueChange(assetIdString)}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value={assetIdString} id={`asset-${assetIdString}`} />
                        <div className="flex-1">
                          <Label
                            htmlFor={`asset-${assetIdString}`}
                            className="cursor-pointer"
                          >
                            <div className="space-y-2">
                              <img
                                src={imageUrl}
                                alt={asset.filename}
                                className="w-full h-32 object-cover rounded"
                                onLoad={() => URL.revokeObjectURL(imageUrl)}
                              />
                              <div className="text-sm">
                                <p className="font-medium truncate">{asset.filename}</p>
                                <p className="text-xs text-gray-500">
                                  ID: {assetIdString} • {(Number(asset.size) / 1024).toFixed(1)} KB
                                </p>
                              </div>
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleSelect} disabled={!selectedId}>
                Pilih Gambar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
