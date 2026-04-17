"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, File as FileIcon } from "lucide-react";
import { toast } from "sonner";

export function FileUpload({ batchId }: { batchId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setIsUploading(true);
    
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", file.name.toLowerCase().includes("thermal") ? "thermal" : "rgb");
        
        const res = await fetch(`/api/batches/${batchId}/files`, {
          method: "POST",
          body: formData,
        });
        
        if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
      }
      toast.success("All files uploaded successfully");
      setFiles([]);
    } catch (error) {
      toast.error("Some files failed to upload");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-muted/50 transition-colors">
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-4" />
        <p className="text-sm text-muted-foreground mb-4">
          Drag and drop your images here, or click to select files
        </p>
        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          id="file-upload"
          onChange={handleFileChange}
        />
        <Button asChild variant="secondary">
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files ({files.length})</h4>
          <div className="max-h-48 overflow-y-auto space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-2 border rounded-md text-sm">
                <div className="flex items-center gap-2 truncate">
                  <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate">{file.name}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(i)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload All"}
          </Button>
        </div>
      )}
    </div>
  );
}
