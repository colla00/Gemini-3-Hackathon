import { useState, useEffect } from 'react';
import { Upload, Image, X, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ClaimScreenshotUploadProps {
  claimNumber: number;
  documentHash: string;
  existingScreenshots?: { id: string; file_path: string; caption?: string | null }[];
  onUploadComplete?: () => void;
}

export const ClaimScreenshotUpload = ({
  claimNumber,
  documentHash,
  existingScreenshots = [],
  onUploadComplete
}: ClaimScreenshotUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Generate signed URLs for existing screenshots (private bucket)
  useEffect(() => {
    const fetchSignedUrls = async () => {
      const urlPromises = existingScreenshots.map(async (screenshot) => {
        const { data, error } = await supabase.storage
          .from('patent-screenshots')
          .createSignedUrl(screenshot.file_path, 3600); // 1 hour expiry
        
        if (error) {
          console.error('Failed to get signed URL:', error);
          return { id: screenshot.id, url: '' };
        }
        return { id: screenshot.id, url: data.signedUrl };
      });

      const results = await Promise.all(urlPromises);
      const urlMap = results.reduce((acc, { id, url }) => {
        acc[id] = url;
        return acc;
      }, {} as Record<string, string>);
      
      setSignedUrls(urlMap);
    };

    if (existingScreenshots.length > 0) {
      fetchSignedUrls();
    }
  }, [existingScreenshots]);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an image file (PNG, JPG, etc.)',
        variant: 'destructive'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 5MB',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);
    try {
      const timestamp = Date.now();
      const ext = file.name.split('.').pop();
      const filePath = `claim-${claimNumber}/${timestamp}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('patent-screenshots')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('patent_claim_screenshots')
        .insert({
          claim_number: claimNumber,
          document_hash: documentHash,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size
        });

      if (dbError) throw dbError;

      toast({
        title: 'Screenshot uploaded',
        description: `Evidence for Claim ${claimNumber} has been uploaded.`
      });

      onUploadComplete?.();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload screenshot',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  // Removed getPublicUrl - now using signed URLs for private bucket access

  return (
    <div className="space-y-3">
      {/* Existing screenshots */}
      {existingScreenshots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {existingScreenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border"
            >
              {signedUrls[screenshot.id] ? (
                <img
                  src={signedUrls[screenshot.id]}
                  alt={screenshot.caption || `Claim ${claimNumber} evidence`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          isUploading && "pointer-events-none opacity-50"
        )}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          id={`screenshot-upload-${claimNumber}`}
          disabled={isUploading}
        />
        <label
          htmlFor={`screenshot-upload-${claimNumber}`}
          className="cursor-pointer flex flex-col items-center gap-1"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Drop image or click to upload
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  );
};
