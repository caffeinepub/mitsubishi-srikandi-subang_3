import { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUploadMediaAsset } from '@/hooks/useMediaAssets';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import { toast } from 'sonner';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024; // 10MB

interface MediaUploadZoneProps {
  onUploadSuccess?: () => void;
}

export default function MediaUploadZone({ onUploadSuccess }: MediaUploadZoneProps) {
  const { identity } = useInternetIdentity();
  const uploadAsset = useUploadMediaAsset();
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const validateFile = (file: File): string | null => {
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isDocument = ALLOWED_DOCUMENT_TYPES.includes(file.type);

    if (!isImage && !isDocument) {
      return 'Format file tidak didukung. Gunakan JPEG, PNG, GIF, WebP, atau PDF.';
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_DOCUMENT_SIZE;
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return `Ukuran file terlalu besar. Maksimal ${maxSizeMB}MB untuk ${isImage ? 'gambar' : 'dokumen'}.`;
    }

    return null;
  };

  const handleFileUpload = useCallback(
    async (files: FileList | null) => {
      console.log('[MediaUpload] Upload initiated at', new Date().toISOString());
      
      if (!files || files.length === 0) return;

      if (!identity) {
        toast.error('Anda harus login terlebih dahulu');
        return;
      }

      // Validate delegation only once at the start, with proper time conversion
      if (identity instanceof DelegationIdentity) {
        const delegation = identity.getDelegation();
        
        if (!isDelegationValid(delegation)) {
          console.log('[MediaUpload] Delegation is invalid');
          toast.error('Sesi Anda telah berakhir. Silakan login kembali.');
          return;
        }

        const expiration = delegation.delegations[0]?.delegation.expiration;
        if (expiration) {
          // FIXED: Correct conversion from nanoseconds to milliseconds
          const expiryTime = Number(expiration) / 1_000_000; // nanoseconds to milliseconds
          const currentTime = Date.now();
          const timeUntilExpiry = expiryTime - currentTime;
          
          console.log('[MediaUpload] Token validation:', {
            expiryTime: new Date(expiryTime).toISOString(),
            currentTime: new Date(currentTime).toISOString(),
            timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / 1000 / 60),
            isValid: isDelegationValid(delegation)
          });

          // FIXED: Only check if already expired, don't block uploads that have time remaining
          // Allow uploads as long as there's at least 1 minute remaining
          if (timeUntilExpiry < (1 * 60 * 1000)) {
            console.log('[MediaUpload] Token expiring very soon (< 1 minute)');
            toast.error('Sesi Anda akan segera berakhir. Silakan login kembali.');
            return;
          }
        }
      }

      const file = files[0];
      console.log('[MediaUpload] File selected:', {
        name: file.name,
        size: file.size,
        type: file.type
      });

      const validationError = validateFile(file);
      if (validationError) {
        console.log('[MediaUpload] File validation failed:', validationError);
        toast.error(validationError);
        return;
      }

      setUploadProgress(0);
      console.log('[MediaUpload] Starting file read');

      const reader = new FileReader();
      reader.onload = async (e) => {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const bytes = new Uint8Array(arrayBuffer);

        console.log('[MediaUpload] File read complete, starting upload');

        try {
          await uploadAsset.mutateAsync({
            fileContent: bytes,
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size,
            onProgress: (percentage) => {
              setUploadProgress(percentage);
            }
          });
          
          console.log('[MediaUpload] Upload successful');
          setUploadProgress(null);
          
          // Trigger cache invalidation callback
          if (onUploadSuccess) {
            console.log('[MediaUpload] Triggering cache invalidation');
            onUploadSuccess();
          }
        } catch (error) {
          console.error('[MediaUpload] Upload failed:', error);
          setUploadProgress(null);
        }
      };

      reader.onerror = () => {
        console.error('[MediaUpload] File read error');
        toast.error('Gagal membaca file');
        setUploadProgress(null);
      };

      reader.readAsArrayBuffer(file);
    },
    [identity, uploadAsset, onUploadSuccess]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <p className="text-lg font-medium mb-2">Upload Media</p>
      <p className="text-sm text-gray-500 mb-4">
        Drag & drop file atau klik tombol di bawah
      </p>
      <p className="text-xs text-gray-400 mb-4">
        Format: JPEG, PNG, GIF, WebP (max 5MB), PDF (max 10MB)
      </p>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES].join(',')}
        onChange={(e) => handleFileUpload(e.target.files)}
        disabled={uploadAsset.isPending}
      />
      <Button
        onClick={() => document.getElementById('file-upload')?.click()}
        disabled={uploadAsset.isPending}
      >
        {uploadAsset.isPending ? 'Mengunggah...' : 'Pilih File'}
      </Button>
      {uploadProgress !== null && (
        <div className="mt-4">
          <Progress value={uploadProgress} className="w-full" />
          <p className="text-sm text-gray-600 mt-2">{uploadProgress}%</p>
        </div>
      )}
    </div>
  );
}
