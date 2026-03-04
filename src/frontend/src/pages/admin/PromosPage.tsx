import PromoDialog from "@/components/admin/PromoDialog";
import PromoList from "@/components/admin/PromoList";
import { Button } from "@/components/ui/button";
import type { Promotion } from "@/types/local";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function PromosPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const handleAdd = () => {
    setSelectedPromo(null);
    setDialogOpen(true);
  };

  const handleEdit = (promo: Promotion) => {
    setSelectedPromo(promo);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Promo</h1>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Promo
        </Button>
      </div>

      <PromoList onEdit={handleEdit} />

      <PromoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        promo={selectedPromo}
      />
    </div>
  );
}
