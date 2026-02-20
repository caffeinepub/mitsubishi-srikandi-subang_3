import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Vehicle } from '@/types/local';
import { useCreateVehicle, useUpdateVehicle } from '@/hooks/useVehicles';

interface PassengerVehicleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle | null;
}

export default function PassengerVehicleDialog({
  open,
  onOpenChange,
  vehicle,
}: PassengerVehicleDialogProps) {
  const [formData, setFormData] = useState({
    vehicleName: '',
    description: '',
    basePrice: '',
  });

  const createVehicle = useCreateVehicle();
  const updateVehicle = useUpdateVehicle();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicleName: vehicle.vehicleName || '',
        description: vehicle.description || '',
        basePrice: vehicle.basePrice ? vehicle.basePrice.toString() : '',
      });
    } else {
      setFormData({
        vehicleName: '',
        description: '',
        basePrice: '',
      });
    }
  }, [vehicle, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData: Vehicle = {
      id: vehicle?.id || BigInt(0),
      vehicleName: formData.vehicleName,
      description: formData.description,
      basePrice: BigInt(formData.basePrice || 0),
      publishStatus: vehicle?.publishStatus || false,
    };

    if (vehicle) {
      updateVehicle.mutate(vehicleData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      createVehicle.mutate(vehicleData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = createVehicle.isPending || updateVehicle.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {vehicle ? 'Edit Kendaraan' : 'Tambah Kendaraan Baru'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="vehicleName">Nama Kendaraan *</Label>
              <Input
                id="vehicleName"
                value={formData.vehicleName}
                onChange={(e) =>
                  setFormData({ ...formData, vehicleName: e.target.value })
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
            <div className="grid gap-2">
              <Label htmlFor="basePrice">Harga Dasar (IDR) *</Label>
              <Input
                id="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={(e) =>
                  setFormData({ ...formData, basePrice: e.target.value })
                }
                required
                min="0"
                disabled={isLoading}
              />
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
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
