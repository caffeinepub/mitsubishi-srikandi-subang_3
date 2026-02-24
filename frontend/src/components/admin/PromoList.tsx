import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllPromotions, useDeletePromotion, useTogglePromoActiveStatus } from '@/hooks/usePromotions';
import type { Promotion } from '@/types/local';
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
import { Switch } from '@/components/ui/switch';

interface PromoListProps {
  onEdit: (promo: Promotion) => void;
}

export default function PromoList({ onEdit }: PromoListProps) {
  const { data: promotions, isLoading } = useGetAllPromotions();
  const deletePromotion = useDeletePromotion();
  const toggleActiveStatus = useTogglePromoActiveStatus();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState<Promotion | null>(null);

  const handleDeleteClick = (promo: Promotion) => {
    setPromoToDelete(promo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (promoToDelete) {
      deletePromotion.mutate(Number(promoToDelete.id), {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPromoToDelete(null);
        },
      });
    }
  };

  const handleToggleActive = (promoId: bigint, currentActive: boolean) => {
    toggleActiveStatus.mutate({ promoId: Number(promoId), active: !currentActive });
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!promotions || promotions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada promo. Klik tombol "Tambah Promo" untuk menambahkan.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Judul</TableHead>
            <TableHead>Periode</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promo) => (
            <TableRow key={promo.id.toString()}>
              <TableCell className="font-medium">{promo.title}</TableCell>
              <TableCell>
                {new Date(Number(promo.startDate) / 1000000).toLocaleDateString('id-ID')} -{' '}
                {new Date(Number(promo.endDate) / 1000000).toLocaleDateString('id-ID')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={promo.active}
                    onCheckedChange={() => handleToggleActive(promo.id, promo.active)}
                    disabled={toggleActiveStatus.isPending}
                  />
                  <span className="text-sm">
                    {promo.active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(promo)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(promo)}
                    disabled={deletePromotion.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus promo "{promoToDelete?.title}"?
              Tindakan ini tidak dapat dibatalkan.
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
