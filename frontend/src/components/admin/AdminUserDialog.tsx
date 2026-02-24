import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useCreateAdminUser, useUpdateAdminUser } from '../../hooks/useAdminUsers';
import { toast } from 'sonner';
import type { AdminUser } from '../../types/local';
import { UserRole } from '../../backend';

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
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    } else {
      setFormData({
        name: '',
        email: '',
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEdit) {
        await updateUser.mutateAsync(user);
        toast.success('Admin user berhasil diperbarui');
      } else {
        // Backend now uses msg.caller as principal automatically
        await createUser.mutateAsync({
          name: formData.name,
          email: formData.email,
          role: UserRole.admin,
        });
        toast.success('Admin user berhasil ditambahkan');
      }
      onClose();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error?.message || 'Terjadi kesalahan');
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
              <Label>Principal ID</Label>
              <div className="text-sm text-muted-foreground">
                Otomatis menggunakan principal ID Anda yang sedang login
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label>Role</Label>
            <div className="text-sm text-muted-foreground">
              {isEdit ? user.role : 'Admin pertama otomatis menjadi super_admin'}
            </div>
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
