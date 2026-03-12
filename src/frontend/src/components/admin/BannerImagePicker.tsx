import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllMediaAssets } from "@/hooks/useMediaAssets";
import { createBlobUrlFromData } from "@/utils/blobUrl";
import { Film } from "lucide-react";
import { useEffect, useState } from "react";

interface BannerImagePickerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (imageId: bigint) => void;
  value?: bigint;
  bannerType: "main" | "cta";
  /** Filter assets shown in the picker. Default: "image" */
  mediaType?: "image" | "video";
}

export default function BannerImagePicker({
  open,
  onOpenChange,
  onSelect,
  value,
  bannerType,
  mediaType = "image",
}: BannerImagePickerProps) {
  const { data: allAssets, isLoading } = useGetAllMediaAssets();
  const [selectedId, setSelectedId] = useState<string>(value?.toString() || "");

  useEffect(() => {
    setSelectedId(value?.toString() || "");
  }, [value]);

  const filteredAssets =
    allAssets?.filter((asset) =>
      mediaType === "video"
        ? asset.mimeType.startsWith("video/")
        : asset.mimeType.startsWith("image/"),
    ) || [];

  const handleSelect = () => {
    if (selectedId) {
      onSelect(BigInt(selectedId));
    }
  };

  const pickerTitle =
    mediaType === "video"
      ? "Pilih Video Banner"
      : bannerType === "main"
        ? "Pilih Main Banner"
        : "Pilih CTA Banner";

  const emptyMessage =
    mediaType === "video"
      ? "Belum ada video yang tersedia. Silakan upload file MP4 terlebih dahulu di Media Manager."
      : "Belum ada gambar yang tersedia. Silakan upload gambar terlebih dahulu di Media Manager.";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{pickerTitle}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{emptyMessage}</div>
        ) : (
          <div className="space-y-4">
            <RadioGroup value={selectedId} onValueChange={setSelectedId}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAssets.map((asset) => {
                  const assetIdString = asset.id.toString();
                  const isVideo = asset.mimeType.startsWith("video/");
                  const previewUrl = createBlobUrlFromData(
                    asset.data,
                    asset.mimeType,
                  );

                  return (
                    <label
                      key={assetIdString}
                      htmlFor={`asset-${assetIdString}`}
                      className={`block border rounded-lg p-3 cursor-pointer transition-all ${
                        selectedId === assetIdString
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem
                          value={assetIdString}
                          id={`asset-${assetIdString}`}
                        />
                        <div className="flex-1">
                          <div className="space-y-2">
                            {isVideo ? (
                              <div className="relative w-full h-32 bg-gray-900 rounded overflow-hidden flex items-center justify-center">
                                <video
                                  src={previewUrl}
                                  className="w-full h-full object-cover"
                                  muted
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                  <Film className="h-8 w-8 text-white" />
                                </div>
                              </div>
                            ) : (
                              <img
                                src={previewUrl}
                                alt={asset.filename}
                                className="w-full h-32 object-cover rounded"
                                onLoad={() => URL.revokeObjectURL(previewUrl)}
                              />
                            )}
                            <div className="text-sm">
                              <p className="font-medium truncate">
                                {asset.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                ID: {assetIdString} ·{" "}
                                {(Number(asset.size) / 1024 / 1024).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </RadioGroup>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button onClick={handleSelect} disabled={!selectedId}>
                {mediaType === "video" ? "Pilih Video" : "Pilih Gambar"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
