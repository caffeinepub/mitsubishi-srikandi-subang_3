import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetAllTestimonials } from "@/hooks/useTestimonials";
import type { Testimonial } from "@/types/local";
import { Pencil, Trash2 } from "lucide-react";

interface TestimonialListProps {
  onEdit: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

export default function TestimonialList({
  onEdit,
  onDelete,
}: TestimonialListProps) {
  const { data: testimonials, isLoading } = useGetAllTestimonials();

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada testimoni. Klik tombol "Tambah Testimoni" untuk menambahkan.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama Pelanggan</TableHead>
          <TableHead>Konten</TableHead>
          <TableHead>Rating</TableHead>
          <TableHead className="text-right">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {testimonials.map((testimonial) => (
          <TableRow key={testimonial.id.toString()}>
            <TableCell className="font-medium">
              {testimonial.customerName}
            </TableCell>
            <TableCell className="max-w-md truncate">
              {testimonial.content}
            </TableCell>
            <TableCell>{"⭐".repeat(Number(testimonial.rating))}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(testimonial)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(testimonial)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
