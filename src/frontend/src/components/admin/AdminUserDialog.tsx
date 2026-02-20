import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useCreateAdminUser, useUpdateAdminUser } from '../../hooks/useAdminUsers';
import { toast } from 'sonner';
import type { AdminUser } from '../../types/local';
import { Principal } from '@dfinity/principal';

interface AdminUserDialogProps {
  open: boolean;
  onClose: () => void;
  user: AdminUser | null;
}

export default function AdminUserDialog({ open, onClose, user }: AdminUserDialogProps) {
  const isEdit = user !== null;
  const createUser = useCreateAdminUser();
  const updateUser = useUpdateAdminUser();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    principalId: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        principalId: user.principal.toString(),
      });
    } else {
      setFormData({
        name: '',
        email: '',
        principalId: '',
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userData: AdminUser = {
        principal: isEdit ? user.principal : Principal.fromText(formData.principalId),
        name: formData.name,
        email: formData.email,
        role: 'admin',
        createdAt: user?.createdAt || BigInt(Date.now() * 1000000),
      };

      if (isEdit) {
        await updateUser.mutateAsync(userData);
        toast.success('Admin user berhasil diperbarui');
      } else {
        await createUser.mutateAsync(userData);
        toast.success('Admin user berhasil ditambahkan');
      }
      onClose();
    } catch (error) {
      toast.error('Gagal menyimpan admin user');
    }
  };

  const isPending = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Admin User' : 'Tambah Admin User Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          {!isEdit && (
            <div className="space-y-2">
              <Label htmlFor="principalId">Principal ID</Label>
              <Input
                id="principalId"
                value={formData.principalId}
                onChange={(e) => setFormData({ ...formData, principalId: e.target.value })}
                required
                placeholder="xxxxx-xxxxx-xxxxx-xxxxx-xxx"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Role</Label>
            <div className="text-sm text-muted-foreground">super_admin (fixed)</div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
