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
import { useGetAllVehicles, useDeleteVehicle, useToggleVehiclePublishStatus } from '@/hooks/useVehicles';
import type { Vehicle } from '@/types/local';
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

interface PassengerVehicleListProps {
  onEdit: (vehicle: Vehicle) => void;
}

export default function PassengerVehicleList({ onEdit }: PassengerVehicleListProps) {
  const { data: vehicles, isLoading } = useGetAllVehicles();
  const deleteVehicle = useDeleteVehicle();
  const togglePublishStatus = useToggleVehiclePublishStatus();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (vehicleToDelete) {
      deleteVehicle.mutate(vehicleToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setVehicleToDelete(null);
        },
      });
    }
  };

  const handleTogglePublish = (vehicleId: bigint) => {
    togglePublishStatus.mutate(vehicleId);
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

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada kendaraan. Klik tombol "Tambah Kendaraan" untuk menambahkan.
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Kendaraan</TableHead>
            <TableHead>Harga Dasar</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id.toString()}>
              <TableCell className="font-medium">{vehicle.vehicleName}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                }).format(Number(vehicle.basePrice))}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={vehicle.publishStatus}
                    onCheckedChange={() => handleTogglePublish(vehicle.id)}
                    disabled={togglePublishStatus.isPending}
                  />
                  <span className="text-sm">
                    {vehicle.publishStatus ? 'Dipublikasi' : 'Draft'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(vehicle)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(vehicle)}
                    disabled={deleteVehicle.isPending}
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
              Apakah Anda yakin ingin menghapus kendaraan "{vehicleToDelete?.vehicleName}"?
              <br />
              <br />
              <strong>Peringatan:</strong> Menghapus kendaraan ini juga akan menghapus semua data terkait
              termasuk varian, warna, gambar, spesifikasi, dan fitur.
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
