import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreatePromotion, useUpdatePromotion } from "@/hooks/usePromotions";
import type { Promotion } from "@/types/local";
import { useEffect, useState } from "react";

interface PromoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo?: Promotion | null;
}

export default function PromoDialog({
  open,
  onOpenChange,
  promo,
}: PromoDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });

  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();

  useEffect(() => {
    if (promo) {
      const startDate = new Date(Number(promo.startDate) / 1000000);
      const endDate = new Date(Number(promo.endDate) / 1000000);

      setFormData({
        title: promo.title || "",
        description: promo.description || "",
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        startDate: "",
        endDate: "",
      });
    }
  }, [promo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const startDateNs = BigInt(
      new Date(formData.startDate).getTime() * 1000000,
    );
    const endDateNs = BigInt(new Date(formData.endDate).getTime() * 1000000);

    const promoData: Promotion = {
      id: promo?.id || BigInt(0),
      title: formData.title,
      description: formData.description,
      imageId: promo?.imageId,
      startDate: startDateNs,
      endDate: endDateNs,
      active: promo?.active || false,
    };

    if (promo) {
      updatePromotion.mutate(promoData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      createPromotion.mutate(promoData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = createPromotion.isPending || updatePromotion.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {promo ? "Edit Promo" : "Tambah Promo Baru"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Promo *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Tanggal Mulai *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="endDate">Tanggal Berakhir *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  required
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
