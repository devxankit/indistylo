import React, { useRef, useState } from "react";
import { Upload, X, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "../../user/services/apiClient";

interface ImageUploadProps {
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
  uploadEndpoint?: string; // New prop
}

export function ImageUpload({
  value,
  onChange,
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  className,
  label = "Upload Image",
  disabled = false,
  uploadEndpoint = "/upload", // Default
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError("");
    setIsUploading(true);
    const fileArray = Array.from(files);

    // Check max files limit for multiple upload
    const currentCount = Array.isArray(value) ? value.length : value ? 1 : 0;
    if (multiple && currentCount + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`);
      setIsUploading(false);
      return;
    }

    try {
      if (multiple) {
        const formData = new FormData();
        fileArray.forEach((file) => {
          if (file.size > maxSizeMB * 1024 * 1024) {
            throw new Error(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
          }
          formData.append("images", file);
        });

        const uploadedFiles = await api.post<any[]>(
          `${uploadEndpoint}/multiple`,
          formData
        );
        const newUrls = uploadedFiles.map((f) => f.url);
        const existing = Array.isArray(value) ? value : [];
        onChange([...existing, ...newUrls]);
      } else {
        const file = fileArray[0];
        if (file.size > maxSizeMB * 1024 * 1024) {
          throw new Error(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
        }

        const formData = new FormData();
        formData.append("image", file);

        const uploadedFile = await api.post<{ url: string }>(
          uploadEndpoint,
          formData
        );
        onChange(uploadedFile.url);
      }
    } catch (err: any) {
      setError(err.message || "Failed to upload image(s)");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemove = (indexToremove: number) => {
    if (multiple && Array.isArray(value)) {
      console.log("Removing index:", indexToremove);
      const newValue = [...value];
      newValue.splice(indexToremove, 1);
      console.log("New value:", newValue);
      onChange(newValue);
    } else {
      onChange("");
    }
  };

  const renderPreview = () => {
    if (multiple && Array.isArray(value) && value.length > 0) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
          {value.map((img, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-xl overflow-hidden group border border-border">
              <img
                src={img}
                alt={`Uploaded ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                disabled={disabled}
                className={cn(
                  "absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full transition-opacity",
                  disabled && "cursor-not-allowed opacity-50"
                )}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {value.length < maxFiles && (
            <button
              type="button"
              onClick={() => !isUploading && fileInputRef.current?.click()}
              disabled={disabled || isUploading}
              className={cn(
                "aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-card hover:bg-muted/50",
                (disabled || isUploading) &&
                "cursor-not-allowed opacity-50 hover:border-border hover:bg-card"
              )}>
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-primary animate-spin" />
              ) : (
                <>
                  <Plus className="w-6 h-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">
                    Add More
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      );
    }

    if (!multiple && typeof value === "string" && value) {
      return (
        <div className="relative mt-2 w-full h-48 rounded-xl overflow-hidden border border-border group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => handleRemove(0)}
            disabled={disabled}
            className={cn(
              "absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full transition-opacity",
              disabled && "cursor-not-allowed opacity-50"
            )}>
            <X className="w-4 h-4" />
          </button>
        </div>
      );
    }

    return null;
  };

  // Helper component for the trigger button
  const TriggerButton = () => {
    // If single mode and has value, hide trigger (preview shows instead)
    if (!multiple && value && typeof value === 'string') return null;

    // If multiple mode and max files reached, hide trigger in main area (add more button handled in preview)
    if (multiple && Array.isArray(value) && value.length > 0) return null;

    return (
      <button
        type="button"
        onClick={() => !isUploading && fileInputRef.current?.click()}
        disabled={disabled || isUploading}
        className={cn(
          "w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-all group cursor-pointer",
          (disabled || isUploading) &&
          "cursor-not-allowed opacity-50 hover:border-border hover:bg-transparent",
          className
        )}>
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">
              Uploading...
            </p>
          </div>
        ) : (
          <>
            <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Max size {maxSizeMB}MB{" "}
                {multiple ? `• Max ${maxFiles} files` : ""}
              </p>
            </div>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      <TriggerButton />

      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

      {renderPreview()}
    </div>
  );
}
