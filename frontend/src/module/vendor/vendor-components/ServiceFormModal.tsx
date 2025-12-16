import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  IndianRupee,
  Clock,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogBody } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Service, PricingTier } from "../store/useServiceStore";
import { transitions } from "@/lib/animations";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: Omit<Service, "id">) => void;
  service?: Service | null;
  categories: string[];
}

export function ServiceFormModal({
  open,
  onOpenChange,
  onSave,
  service,
  categories,
}: ServiceFormModalProps) {
  const isEditMode = !!service;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(service?.image || null);
  
  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || categories[1] || "",
    price: service?.price || 0,
    duration: service?.duration || 30,
    description: service?.description || "",
    isActive: service?.isActive ?? true,
    tags: service?.tags || [] as string[],
    pricingTiers: service?.pricingTiers || [] as PricingTier[],
  });

  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name,
        category: service.category,
        price: service.price,
        duration: service.duration,
        description: service.description,
        isActive: service.isActive,
        tags: service.tags || [],
        pricingTiers: service.pricingTiers || [],
      });
      setImagePreview(service.image || null);
    } else {
      setFormData({
        name: "",
        category: categories[1] || "",
        price: 0,
        duration: 30,
        description: "",
        isActive: true,
        tags: [],
        pricingTiers: [],
      });
      setImagePreview(null);
    }
    setTagInput("");
    setErrors({});
  }, [service, open, categories]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ ...errors, image: "Image size should be less than 5MB" });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setErrors({ ...errors, image: "" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  }, [tagInput, formData]);

  const handleRemoveTag = useCallback((tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  }, [formData]);

  const handleAddPricingTier = useCallback(() => {
    const newTier: PricingTier = {
      id: `tier_${Date.now()}`,
      name: "",
      price: 0,
      description: "",
    };
    setFormData({
      ...formData,
      pricingTiers: [...formData.pricingTiers, newTier],
    });
  }, [formData]);

  const handleUpdatePricingTier = useCallback((id: string, updates: Partial<PricingTier>) => {
    setFormData({
      ...formData,
      pricingTiers: formData.pricingTiers.map((tier) =>
        tier.id === id ? { ...tier, ...updates } : tier
      ),
    });
  }, [formData]);

  const handleRemovePricingTier = useCallback((id: string) => {
    setFormData({
      ...formData,
      pricingTiers: formData.pricingTiers.filter((tier) => tier.id !== id),
    });
  }, [formData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Service name is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    if (formData.price <= 0 && formData.pricingTiers.length === 0) {
      newErrors.price = "Price must be greater than 0 or add pricing tiers";
    }
    if (formData.duration <= 0) {
      newErrors.duration = "Duration must be greater than 0";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate pricing tiers
    formData.pricingTiers.forEach((tier, index) => {
      if (!tier.name.trim()) {
        newErrors[`tier_${index}_name`] = "Tier name is required";
      }
      if (tier.price <= 0) {
        newErrors[`tier_${index}_price`] = "Tier price must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const serviceData: Omit<Service, "id"> = {
      name: formData.name.trim(),
      category: formData.category,
      price: formData.price,
      duration: formData.duration,
      description: formData.description.trim(),
      isActive: formData.isActive,
      tags: formData.tags,
      pricingTiers: formData.pricingTiers.length > 0 ? formData.pricingTiers : undefined,
      image: imagePreview || undefined,
    };

    onSave(serviceData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-base font-semibold">
              {isEditMode ? "Edit Service" : "Add New Service"}
            </DialogTitle>
            <DialogClose onClose={() => onOpenChange(false)} />
          </div>
        </DialogHeader>
        <DialogBody className="px-4 pb-4 space-y-4 overflow-y-auto">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Service Image</label>
            <div className="space-y-2">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 p-1.5 bg-red-400 text-white rounded-full hover:bg-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Upload Image</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              {errors.image && (
                <p className="text-xs text-red-400">{errors.image}</p>
              )}
            </div>
          </div>

          {/* Service Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Service Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                setErrors({ ...errors, name: "" });
              }}
              placeholder="e.g., Haircut & Styling"
              className={cn(
                "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                errors.name && "border-red-400"
              )}
            />
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => {
                setFormData({ ...formData, category: e.target.value });
                setErrors({ ...errors, category: "" });
              }}
              className={cn(
                "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                errors.category && "border-red-400"
              )}>
              {categories.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Price */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Base Price (₹) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                value={formData.price || ""}
                onChange={(e) => {
                  setFormData({ ...formData, price: Number(e.target.value) });
                  setErrors({ ...errors, price: "" });
                }}
                placeholder="0"
                min="0"
                className={cn(
                  "w-full h-11 pl-9 pr-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                  errors.price && "border-red-400"
                )}
              />
            </div>
            {errors.price && (
              <p className="text-xs text-red-400">{errors.price}</p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Duration (minutes) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="number"
                value={formData.duration || ""}
                onChange={(e) => {
                  setFormData({ ...formData, duration: Number(e.target.value) });
                  setErrors({ ...errors, duration: "" });
                }}
                placeholder="30"
                min="1"
                className={cn(
                  "w-full h-11 pl-9 pr-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                  errors.duration && "border-red-400"
                )}
              />
            </div>
            {errors.duration && (
              <p className="text-xs text-red-400">{errors.duration}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: "" });
              }}
              placeholder="Describe your service..."
              rows={3}
              className={cn(
                "w-full px-3 py-2 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base resize-none",
                errors.description && "border-red-400"
              )}
            />
            {errors.description && (
              <p className="text-xs text-red-400">{errors.description}</p>
            )}
          </div>

          {/* Pricing Tiers */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">
                Pricing Tiers (Optional)
              </label>
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleAddPricingTier}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                <Plus className="w-3.5 h-3.5" />
                Add Tier
              </motion.button>
            </div>
            <AnimatePresence>
              {formData.pricingTiers.map((tier, index) => (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border border-border rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) =>
                          handleUpdatePricingTier(tier.id, { name: e.target.value })
                        }
                        placeholder="Tier name (e.g., Basic, Premium)"
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm"
                      />
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                        <input
                          type="number"
                          value={tier.price || ""}
                          onChange={(e) =>
                            handleUpdatePricingTier(tier.id, { price: Number(e.target.value) })
                          }
                          placeholder="Price"
                          min="0"
                          className="w-full h-9 pl-9 pr-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm"
                        />
                      </div>
                      <input
                        type="text"
                        value={tier.description || ""}
                        onChange={(e) =>
                          handleUpdatePricingTier(tier.id, { description: e.target.value })
                        }
                        placeholder="Tier description (optional)"
                        className="w-full h-9 px-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePricingTier(tier.id)}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Tags</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add tag"
                className="flex-1 h-9 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-sm"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors">
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs">
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div>
              <label className="text-sm font-medium text-foreground">Active</label>
              <p className="text-xs text-muted-foreground">
                Service will be visible to customers
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={cn(
                "relative w-11 h-6 rounded-full transition-colors touch-manipulation",
                formData.isActive ? "bg-primary" : "bg-muted"
              )}>
              <span
                className={cn(
                  "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                  formData.isActive ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 min-h-[44px] touch-manipulation">
              Cancel
            </Button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 min-h-[44px] bg-primary text-black rounded-lg font-medium hover:bg-primary/90 transition-colors touch-manipulation">
              {isEditMode ? "Update Service" : "Add Service"}
            </motion.button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}

