import { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUploadMediaAsset } from '@/hooks/useMediaAssets';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { validateDelegationIdentity } from '@/utils/validation';
import { useActor } from '@/hooks/useActor';

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

interface MediaUploadZoneProps {
  onUploadSuccess?: () => void;
}

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function MediaUploadZone({ onUploadSuccess }: MediaUploadZoneProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAsset = useUploadMediaAsset();
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return `Tipe file tidak didukung: ${file.type}. Gunakan JPG, PNG, GIF, WebP, atau PDF.`;
    }
    if (file.size > MAX_FILE_SIZE) {
      return `Ukuran file terlalu besar: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maksimal 10MB.`;
    }
    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadFiles: UploadFile[] = fileArray.map((file) => {
      const error = validateFile(file);
      return {
        file,
        status: error ? 'error' : 'pending',
        progress: 0,
        error: error || undefined,
      };
    });
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (uploadFile: UploadFile, index: number) => {
    // Validate identity
    const validationError = validateDelegationIdentity(identity);
    if (validationError) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'error', error: validationError } : f
        )
      );
      return;
    }

    // Check actor readiness
    if (!actor || actorFetching) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: 'error', error: 'Actor belum siap. Coba lagi.' }
            : f
        )
      );
      return;
    }

    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: 'uploading', progress: 0 } : f))
    );

    try {
      const arrayBuffer = await uploadFile.file.arrayBuffer();
      const data = new Uint8Array(arrayBuffer);

      await uploadAsset.mutateAsync({
        filename: uploadFile.file.name,
        mimeType: uploadFile.file.type,
        data,
        fileSize: BigInt(uploadFile.file.size),
        onProgress: (pct) => {
          setFiles((prev) =>
            prev.map((f, i) => (i === index ? { ...f, progress: pct } : f))
          );
        },
      });

      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'success', progress: 100 } : f
        )
      );

      onUploadSuccess?.();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Upload gagal';
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index ? { ...f, status: 'error', error: errorMessage } : f
        )
      );
    }
  };

  const uploadAll = async () => {
    const pendingEntries = files
      .map((f, i) => ({ file: f, index: i }))
      .filter(({ file }) => file.status === 'pending');

    for (const { file, index } of pendingEntries) {
      await uploadSingleFile(file, index);
    }
  };

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== 'success'));
  };

  const hasPending = files.some((f) => f.status === 'pending');
  const hasCompleted = files.some((f) => f.status === 'success');

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 hover:border-primary hover:bg-gray-50'
        }`}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Drag &amp; drop file di sini
        </p>
        <p className="text-sm text-gray-500 mt-1">
          atau klik untuk memilih file
        </p>
        <p className="text-xs text-gray-400 mt-2">
          JPG, PNG, GIF, WebP, PDF — Maks. 10MB per file
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((uploadFile, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 border rounded-lg bg-white"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{uploadFile.file.name}</p>
                <p className="text-xs text-gray-500">
                  {(uploadFile.file.size / 1024).toFixed(1)} KB
                </p>
                {uploadFile.status === 'uploading' && (
                  <Progress value={uploadFile.progress} className="mt-1 h-1" />
                )}
                {uploadFile.status === 'error' && uploadFile.error && (
                  <p className="text-xs text-destructive mt-1">{uploadFile.error}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {uploadFile.status === 'success' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {uploadFile.status === 'error' && (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                {uploadFile.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      uploadSingleFile(uploadFile, index);
                    }}
                  >
                    Upload
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="h-7 w-7"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <div className="flex gap-2 justify-end">
            {hasCompleted && (
              <Button variant="outline" size="sm" onClick={clearCompleted}>
                Hapus yang Selesai
              </Button>
            )}
            {hasPending && (
              <Button size="sm" onClick={uploadAll} disabled={uploadAsset.isPending}>
                {uploadAsset.isPending ? 'Mengupload...' : 'Upload Semua'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
