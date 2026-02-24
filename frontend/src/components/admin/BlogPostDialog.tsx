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
import type { BlogPost } from '@/types/local';
import { useCreateBlogPost, useUpdateBlogPost } from '@/hooks/useBlogPosts';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import { toast } from 'sonner';

interface BlogPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blogPost?: BlogPost | null;
  onSuccess?: () => void;
}

export default function BlogPostDialog({
  open,
  onOpenChange,
  blogPost,
  onSuccess,
}: BlogPostDialogProps) {
  const { identity } = useInternetIdentity();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
  });

  const createBlogPost = useCreateBlogPost();
  const updateBlogPost = useUpdateBlogPost();

  useEffect(() => {
    if (blogPost) {
      setFormData({
        title: blogPost.title || '',
        excerpt: blogPost.excerpt || '',
        content: blogPost.content || '',
      });
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
      });
    }
  }, [blogPost, open]);

  const validateTokenAndRefresh = async (): Promise<boolean> => {
    console.log('[BlogPostDialog] Starting token validation');
    
    if (!identity) {
      console.log('[BlogPostDialog] No identity found');
      toast.error('Anda harus login terlebih dahulu');
      return false;
    }

    // Check if identity is a DelegationIdentity with expiration
    if (identity instanceof DelegationIdentity) {
      const delegation = identity.getDelegation();
      const expiration = delegation.delegations[0]?.delegation.expiration;
      
      if (expiration) {
        const expiryTime = Number(expiration) / 1000000; // Convert to milliseconds
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;
        
        console.log('[BlogPostDialog] Token validation:', {
          expiryTime: new Date(expiryTime).toISOString(),
          currentTime: new Date(currentTime).toISOString(),
          timeUntilExpiry: `${Math.floor(timeUntilExpiry / 1000 / 60)} minutes`,
          isValid: isDelegationValid(delegation)
        });

        // Check if token is expired or expiring within 5 minutes
        if (!isDelegationValid(delegation) || timeUntilExpiry < (5 * 60 * 1000)) {
          console.log('[BlogPostDialog] Token expired or expiring soon');
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          return false;
        }
      }
    }

    console.log('[BlogPostDialog] Token validation successful');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[BlogPostDialog] Form submission initiated at', new Date().toISOString());

    // Validate token before proceeding
    const isTokenValid = await validateTokenAndRefresh();
    if (!isTokenValid) {
      console.log('[BlogPostDialog] Submission aborted due to invalid token');
      return;
    }

    if (!identity) {
      alert('Anda harus login terlebih dahulu');
      return;
    }

    const now = BigInt(Date.now() * 1000000);

    const blogPostData: BlogPost = {
      id: blogPost?.id || BigInt(0),
      title: formData.title,
      excerpt: formData.excerpt,
      content: formData.content,
      authorId: identity.getPrincipal(),
      imageId: blogPost?.imageId,
      published: blogPost?.published || false,
      publishedAt: blogPost?.publishedAt,
      createdAt: blogPost?.createdAt || now,
      updatedAt: now,
    };

    console.log('[BlogPostDialog] Attempting backend save:', {
      isUpdate: !!blogPost,
      title: blogPostData.title,
      id: blogPost?.id?.toString()
    });

    try {
      if (blogPost) {
        await updateBlogPost.mutateAsync(blogPostData);
        console.log('[BlogPostDialog] Update successful');
      } else {
        await createBlogPost.mutateAsync(blogPostData);
        console.log('[BlogPostDialog] Create successful');
      }
      
      console.log('[BlogPostDialog] Closing dialog');
      onOpenChange(false);
      
      // Trigger cache invalidation callback
      if (onSuccess) {
        console.log('[BlogPostDialog] Triggering cache invalidation');
        onSuccess();
      }
    } catch (error) {
      console.error('[BlogPostDialog] Save failed:', error);
    }
  };

  const isLoading = createBlogPost.isPending || updateBlogPost.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {blogPost ? 'Edit Artikel' : 'Tambah Artikel Baru'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Judul Artikel *</Label>
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
              <Label htmlFor="excerpt">Ringkasan *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                rows={2}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Konten Artikel *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                rows={10}
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
