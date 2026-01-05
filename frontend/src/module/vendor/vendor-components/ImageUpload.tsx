import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
    value?: string | string[];
    onChange: (value: string | string[]) => void;
    multiple?: boolean;
    maxFiles?: number;
    maxSizeMB?: number;
    className?: string;
    label?: string;
}

export function ImageUpload({
    value,
    onChange,
    multiple = false,
    maxFiles = 5,
    maxSizeMB = 5,
    className,
    label = "Upload Image",
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setError("");
        const newImages: string[] = [];
        let hasError = false;

        // Convert filelist to array
        const fileArray = Array.from(files);

        // Check max files limit for multiple upload
        const currentCount = Array.isArray(value) ? value.length : value ? 1 : 0;
        if (multiple && currentCount + fileArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} images allowed`);
            return;
        }

        fileArray.forEach((file) => {
            // Validate size
            if (file.size > maxSizeMB * 1024 * 1024) {
                setError(`File ${file.name} exceeds ${maxSizeMB}MB limit`);
                hasError = true;
                return;
            }

            // Convert to base64 for preview/storage (mocking backend upload)
            const reader = new FileReader();
            reader.onloadend = () => {
                if (reader.result) {
                    newImages.push(reader.result as string);

                    // If we processed all valid files
                    if (newImages.length === fileArray.length && !hasError) {
                        if (multiple) {
                            const existing = Array.isArray(value) ? value : [];
                            onChange([...existing, ...newImages]);
                        } else {
                            onChange(newImages[0]);
                        }
                    }
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-border">
                            <img src={img} alt={`Uploaded ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    {value.length < maxFiles && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 transition-colors bg-card hover:bg-muted/50"
                        >
                            <PlusIcon className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground font-medium">Add More</span>
                        </button>
                    )}
                </div>
            );
        }

        if (!multiple && typeof value === "string" && value) {
            return (
                <div className="relative mt-2 w-full h-48 rounded-xl overflow-hidden border border-border group">
                    <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                    <button
                        type="button"
                        onClick={() => handleRemove(0)}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )
        }

        return null;
    };

    // Helper component for the trigger button
    const TriggerButton = () => {
        // If single mode and has value, hide trigger (preview shows instead)
        if (!multiple && value) return null;

        // If multiple mode and max files reached, hide trigger in main area (add more button handled in preview)
        if (multiple && Array.isArray(value) && value.length > 0) return null;

        return (
            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                    "w-full border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-primary/50 hover:bg-muted/50 transition-all group cursor-pointer",
                    className
                )}
            >
                <div className="p-3 bg-primary/10 text-primary rounded-full group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        Max size {maxSizeMB}MB {multiple ? `• Max ${maxFiles} files` : ""}
                    </p>
                </div>
            </button>
        )
    }

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

function PlusIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    )
}
