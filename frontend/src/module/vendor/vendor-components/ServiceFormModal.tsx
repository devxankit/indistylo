import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, IndianRupee, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useServiceStore, type Service, type PricingTier } from "../store/useServiceStore";
import { useVendorStore } from "../store/useVendorStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageUpload } from "./ImageUpload";

interface ServiceFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: Omit<Service, "_id">) => void;
  service?: Service | null;
}

export function ServiceFormModal({
  open,
  onOpenChange,
  onSave,
  service,
}: ServiceFormModalProps) {
  const isEditMode = !!service;
  const { fetchCategories, categoryTree } = useServiceStore();
  const { vendorType } = useVendorStore();

  const isSpaOwner = vendorType === "spa";

  const [imagePreview, setImagePreview] = useState<string | null>(
    service?.image || null
  );

  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || "",
    gender: service?.gender || "unisex", // Default to unisex
    type: service?.type || "at-salon",
    price: service?.price || 0,
    duration: service?.duration || 30,
    description: service?.description || "",
    isActive: service?.isActive ?? true,
    tags: service?.tags || ([] as string[]),
    pricingTiers: service?.pricingTiers || ([] as PricingTier[]),
  });
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Filter subcategories based on selected header category
  const filteredSubcategories = useMemo(() => {
    if (!formData.category) return [];

    // Find the header category object
    const selectedHeader = categoryTree.find(
      (h) => h.headerName === formData.category
    );

    return selectedHeader ? selectedHeader.subcategories : [];
  }, [formData.category, categoryTree]);

  // Fetch categories when gender changes or modal opens
  useEffect(() => {
    if (open) {
      const type = isSpaOwner ? "SPA" : "SALON";
      fetchCategories(formData.gender || "MALE", type);
    }
  }, [open, formData.gender, isSpaOwner]);

  // Handle form initialization
  useEffect(() => {
    if (open) {
      if (service) {
        setFormData({
          name: service.name,
          category: service.category,
          gender: service.gender || "unisex",
          type: service.type || "at-salon",
          price: service.price,
          duration: service.duration,
          description: service.description,
          isActive: service.isActive,
          tags: service.tags || [],
          pricingTiers: service.pricingTiers || [],
        });
        setImagePreview(service.image || null);
      } else {
        // Initialize with default values for new service
        // Don't rely on categoryTree here to avoid reset loops
        setFormData({
          name: "",
          category: "", // Will be set by the sync effect
          gender: "male",
          type: isSpaOwner ? "spa" : "at-salon",
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
    }
  }, [service, open]);

  // Sync selected category with available tree
  useEffect(() => {
    if (open && categoryTree.length > 0) {
      // If no category selected, or selected category not in new tree, defaults to first
      const currentCategoryExists = categoryTree.some(c => c.headerName === formData.category);

      if (!formData.category || !currentCategoryExists) {
        setFormData(prev => ({ ...prev, category: categoryTree[0].headerName }));
      }
    }
  }, [categoryTree, open, formData.category]);

  // ... (handlers remain same) ...
  // Need to copy handlers because this is a replace_file_content but I am replacing top half.

  const handleAddTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  }, [tagInput, formData]);

  const handleRemoveTag = useCallback(
    (tag: string) => {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tag),
      });
    },
    [formData]
  );

  const handleAddPricingTier = useCallback(() => {
    const newTier: PricingTier = {
      id: `tier_${Date.now()} `,
      name: "",
      price: 0,
      description: "",
    };
    setFormData({
      ...formData,
      pricingTiers: [...formData.pricingTiers, newTier],
    });
  }, [formData]);

  const handleUpdatePricingTier = useCallback(
    (id: string, updates: Partial<PricingTier>) => {
      setFormData({
        ...formData,
        pricingTiers: formData.pricingTiers.map((tier) =>
          tier.id === id ? { ...tier, ...updates } : tier
        ),
      });
    },
    [formData]
  );

  const handleRemovePricingTier = useCallback(
    (id: string) => {
      setFormData({
        ...formData,
        pricingTiers: formData.pricingTiers.filter((tier) => tier.id !== id),
      });
    },
    [formData]
  );

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

    const serviceData: Omit<Service, "_id"> = {
      name: formData.name.trim(),
      category: formData.category,
      // @ts-ignore
      gender: formData.gender,
      // @ts-ignore
      type: formData.type,
      price: formData.price,
      duration: formData.duration,
      description: formData.description.trim(),
      isActive: formData.isActive,
      tags: formData.tags,
      pricingTiers:
        formData.pricingTiers.length > 0 ? formData.pricingTiers : undefined,
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
            <ImageUpload
              value={imagePreview || ""}
              onChange={(val) => {
                setImagePreview(val as string);
                setErrors({ ...errors, image: "" });
              }}
              label="Service Image"
              maxSizeMB={5}
            />
            {errors.image && (
              <p className="text-xs text-red-400">{errors.image}</p>
            )}
          </div>

          {/* Gender Selection */}
          <div className="space-y-2">
            <Label htmlFor="gender">
              Gender <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => {
                setFormData({ ...formData, gender: value, name: "" }); // Reset name when gender changes
                setErrors({ ...errors, gender: "" });
              }}>
              <SelectTrigger
                className={cn(
                  "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base"
                )}>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Service Type Selection */}
          {!isSpaOwner && (
            <div className="space-y-2">
              <Label htmlFor="type">
                Service Type <span className="text-red-400">*</span>
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => {
                  setFormData({ ...formData, type: value as any });
                }}>
                <SelectTrigger
                  className={cn(
                    "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base"
                  )}>
                  <SelectValue placeholder="Select Service Type" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="at-salon">At Salon</SelectItem>
                  <SelectItem value="at-home">At Home</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Category Selection */}
          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({ ...formData, category: value, name: "" }); // Reset name when category changes
                setErrors({ ...errors, category: "" });
              }}>
              <SelectTrigger
                className={cn(
                  "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                  errors.category && "border-red-400"
                )}>
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {categoryTree.map((header) => (
                  <SelectItem key={header.headerName} value={header.headerName}>
                    {header.headerName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-xs text-red-400">{errors.category}</p>
            )}
          </div>

          {/* Service Name Selection (Dependent on Category & Gender) */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Service Name <span className="text-red-400">*</span>
            </Label>
            <Select
              value={formData.name}
              onValueChange={(value) => {
                setFormData({ ...formData, name: value });
                setErrors({ ...errors, name: "" });
              }}
              disabled={!formData.category}
            >
              <SelectTrigger
                className={cn(
                  "w-full h-11 px-3 rounded-lg bg-card border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground text-base",
                  errors.name && "border-red-400"
                )}>
                <SelectValue placeholder={!formData.category ? "Select category first" : "Select service"} />
              </SelectTrigger>
              <SelectContent className="z-[9999]">
                {filteredSubcategories.map((sub) => (
                  <SelectItem key={sub._id} value={sub.name}>
                    {sub.name}
                  </SelectItem>
                ))}
                {filteredSubcategories.length === 0 && formData.category && (
                  <div className="p-2 text-sm text-muted-foreground text-center">
                    No services found.
                  </div>
                )}
              </SelectContent>
            </Select>
            {errors.name && (
              <p className="text-xs text-red-400">{errors.name}</p>
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
                  setFormData({
                    ...formData,
                    duration: Number(e.target.value),
                  });
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
              {formData.pricingTiers.map((tier) => (
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
                          handleUpdatePricingTier(tier.id, {
                            name: e.target.value,
                          })
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
                            handleUpdatePricingTier(tier.id, {
                              price: Number(e.target.value),
                            })
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
                          handleUpdatePricingTier(tier.id, {
                            description: e.target.value,
                          })
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
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 12 12" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between p-3 bg-card border border-border rounded-lg">
            <div>
              <label className="text-sm font-medium text-foreground">
                Active
              </label>
              <p className="text-xs text-muted-foreground">
                Service will be visible to customers
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
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
