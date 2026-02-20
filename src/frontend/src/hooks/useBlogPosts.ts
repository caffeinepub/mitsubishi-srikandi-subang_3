import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { BlogPost } from '../types/local';
import { toast } from 'sonner';

// Enhanced helper function to check if error is authentication-related
function isAuthError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  const isAuth = (
    errorMessage.includes('unauthorized') ||
    errorMessage.includes('not authenticated') ||
    errorMessage.includes('authentication required') ||
    errorMessage.includes('session expired') ||
    errorMessage.includes('invalid session') ||
    errorMessage.includes('login required') ||
    errorMessage.includes('permission denied') ||
    errorString.includes('unauthorized')
  );
  
  console.log('[useBlogPosts] Error classification:', {
    message: error?.message,
    isAuthError: isAuth
  });
  
  return isAuth;
}

function isNetworkError(error: any): boolean {
  const errorMessage = error?.message?.toLowerCase() || '';
  const errorString = String(error).toLowerCase();
  
  return (
    errorMessage.includes('network') ||
    errorMessage.includes('fetch') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('timeout') ||
    errorString.includes('networkerror') ||
    errorString.includes('failed to fetch')
  );
}

export function useGetAllBlogPosts() {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost[]>({
    queryKey: ['blogPosts'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useGetAllBlogPosts] Fetching blog posts');
      const posts = await actor.getBlogPosts(BigInt(0), BigInt(100), null);
      console.log('[useGetAllBlogPosts] Fetched', posts.length, 'posts');
      return posts as BlogPost[];
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBlogPost(blogPostId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<BlogPost | null>({
    queryKey: ['blogPost', blogPostId?.toString()],
    queryFn: async () => {
      if (!actor || !blogPostId) return null;
      // Stub: return null until backend implements getBlogPost
      return null;
    },
    enabled: !!actor && !isFetching && blogPostId !== null,
  });
}

export function useCreateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPost: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useCreateBlogPost] Creating blog post:', blogPost.title);
      
      const result = await actor.createBlogPost(
        blogPost.title,
        blogPost.content,
        blogPost.excerpt,
        blogPost.authorId,
        blogPost.imageId || null,
        blogPost.published,
        blogPost.publishedAt || null
      );
      
      console.log('[useCreateBlogPost] Backend returned:', result);
      return result;
    },
    onSuccess: () => {
      console.log('[useCreateBlogPost] Success - invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Artikel berhasil disimpan');
    },
    onError: (error: any) => {
      console.error('[useCreateBlogPost] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menyimpan artikel';
        toast.error(errorMsg);
      }
    },
  });
}

export function useUpdateBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPost: BlogPost) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useUpdateBlogPost] Updating blog post:', blogPost.id);
      
      const result = await actor.updateBlogPost(
        blogPost.id,
        blogPost.title,
        blogPost.content,
        blogPost.excerpt,
        blogPost.authorId,
        blogPost.imageId || null,
        blogPost.published,
        blogPost.publishedAt || null
      );
      
      console.log('[useUpdateBlogPost] Backend returned:', result);
      return result;
    },
    onSuccess: () => {
      console.log('[useUpdateBlogPost] Success - invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['blogPost'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Artikel berhasil diperbarui');
    },
    onError: (error: any) => {
      console.error('[useUpdateBlogPost] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal memperbarui artikel';
        toast.error(errorMsg);
      }
    },
  });
}

export function useDeleteBlogPost() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blogPostId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useDeleteBlogPost] Deleting blog post:', blogPostId);
      // Stub: do nothing until backend implements deleteBlogPost
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Artikel berhasil dihapus');
      console.log('[useDeleteBlogPost] Success');
    },
    onError: (error: any) => {
      console.error('[useDeleteBlogPost] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal menghapus artikel';
        toast.error(errorMsg);
      }
    },
  });
}

export function useToggleBlogPostPublishStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ blogPostId, publish }: { blogPostId: bigint; publish: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      console.log('[useToggleBlogPostPublishStatus] Toggling status for blog post:', blogPostId, 'to', publish);
      // Stub: do nothing until backend implements toggleBlogPostPublishStatus
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogPosts'] });
      queryClient.invalidateQueries({ queryKey: ['adminStats'] });
      toast.success('Status publikasi artikel berhasil diubah');
      console.log('[useToggleBlogPostPublishStatus] Success');
    },
    onError: (error: any) => {
      console.error('[useToggleBlogPostPublishStatus] Error:', error);
      
      if (isNetworkError(error)) {
        toast.error('Koneksi gagal. Periksa internet Anda dan coba lagi.');
      } else if (isAuthError(error)) {
        toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
      } else {
        const errorMsg = error.message || 'Gagal mengubah status publikasi';
        toast.error(errorMsg);
      }
    },
  });
}
