import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MediaUploadZone from '@/components/admin/MediaUploadZone';
import MediaAssetGrid from '@/components/admin/MediaAssetGrid';
import { useQueryClient } from '@tanstack/react-query';

export default function MediaManagerPage() {
  const queryClient = useQueryClient();

  const handleUploadSuccess = () => {
    console.log('[MediaManagerPage] Invalidating mediaAssets cache');
    queryClient.invalidateQueries({ queryKey: ['mediaAssets'] });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Media Manager</h1>
        <p className="text-muted-foreground">
          Kelola file media untuk website
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload File</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaUploadZone onUploadSuccess={handleUploadSuccess} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Media Library</CardTitle>
        </CardHeader>
        <CardContent>
          <MediaAssetGrid />
        </CardContent>
      </Card>
    </div>
  );
}
