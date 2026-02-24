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
import type { Testimonial } from '@/types/local';
import { useCreateTestimonial, useUpdateTestimonial } from '@/hooks/useTestimonials';

interface TestimonialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  testimonial?: Testimonial | null;
}

export default function TestimonialDialog({
  open,
  onOpenChange,
  testimonial,
}: TestimonialDialogProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    content: '',
    rating: '5',
  });

  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();

  useEffect(() => {
    if (testimonial) {
      setFormData({
        customerName: testimonial.customerName || '',
        content: testimonial.content || '',
        rating: testimonial.rating ? testimonial.rating.toString() : '5',
      });
    } else {
      setFormData({
        customerName: '',
        content: '',
        rating: '5',
      });
    }
  }, [testimonial, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ratingValue = parseInt(formData.rating);
    if (ratingValue < 1 || ratingValue > 5) {
      alert('Rating harus antara 1 dan 5');
      return;
    }

    const testimonialData: Testimonial = {
      id: testimonial?.id || BigInt(0),
      customerName: formData.customerName,
      content: formData.content,
      rating: BigInt(ratingValue),
      vehicleId: testimonial?.vehicleId,
      imageId: testimonial?.imageId,
      approved: testimonial?.approved || true,
      timestamp: testimonial?.timestamp || BigInt(Date.now() * 1000000),
    };

    if (testimonial) {
      updateTestimonial.mutate(testimonialData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    } else {
      createTestimonial.mutate(testimonialData, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isLoading = createTestimonial.isPending || updateTestimonial.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {testimonial ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="customerName">Nama Pelanggan *</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Konten Testimoni *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={4}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="rating">Rating (1-5) *</Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                required
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
