import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGetAllMediaAssets } from '@/hooks/useMediaAssets';
import type { MediaAsset } from '@/types/local';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { createBlobUrlFromData } from '@/utils/blobUrl';

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
  const [blobUrls, setBlobUrls] = useState<Map<string, string>>(new Map());

  // Filter assets that are images and contain "banner" in filename
  const bannerAssets = (allAssets as MediaAsset[] || []).filter(
    (asset) =>
      asset.mimeType.startsWith('image/') &&
      asset.filename.toLowerCase().includes('banner')
  );

  // Create blob URLs from persistent canister storage data
  useEffect(() => {
    if (!bannerAssets || bannerAssets.length === 0) return;

    const newBlobUrls = new Map<string, string>();
    
    bannerAssets.forEach((asset) => {
      if (asset.data) {
        const blobUrl = createBlobUrlFromData(asset.data, asset.mimeType);
        newBlobUrls.set(asset.id.toString(), blobUrl);
      }
    });

    setBlobUrls(newBlobUrls);

    // Cleanup function to revoke old blob URLs
    return () => {
      blobUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerAssets]);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Pilih Gambar {bannerType === 'main' ? 'Main Banner' : 'CTA Banner'}
          </DialogTitle>
        </DialogHeader>

        {bannerAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada gambar banner. Upload gambar dengan nama yang mengandung "banner".
          </div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="grid grid-cols-2 gap-4">
                {bannerAssets.map((asset) => {
                  const assetIdStr = asset.id.toString();
                  const imageUrl = blobUrls.get(assetIdStr);

                  return (
                    <div
                      key={assetIdStr}
                      className={`border rounded-lg p-2 cursor-pointer transition-colors ${
                        selectedId === assetIdStr
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedId(assetIdStr)}
                    >
                      <div className="flex items-start gap-2">
                        <RadioGroupItem value={assetIdStr} id={assetIdStr} />
                        <Label htmlFor={assetIdStr} className="flex-1 cursor-pointer">
                          <div className="space-y-2">
                            {imageUrl && (
                              <div className="aspect-video bg-gray-100 rounded overflow-hidden">
                                <img
                                  src={imageUrl}
                                  alt={asset.filename}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-sm font-medium">{asset.filename}</p>
                            <p className="text-xs text-gray-500">
                              ID: {assetIdStr}
                            </p>
                          </div>
                        </Label>
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
              <Button onClick={handleConfirm} disabled={!selectedId}>
                Pilih Gambar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
