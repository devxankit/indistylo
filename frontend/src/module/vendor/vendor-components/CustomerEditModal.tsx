import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Customer } from "../store/useCustomerStore";
import {
  User,
  Phone,
  Mail,
  MapPin,
  FileText,
  AlertCircle,
  Save,
  X,
  Shield,
} from "lucide-react";

interface CustomerEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, updates: Partial<Customer>) => Promise<void>;
  customer: Customer | null;
}

export function CustomerEditModal({
  open,
  onOpenChange,
  onSave,
  customer,
}: CustomerEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    status: "active" as Customer["status"],
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        status: customer.status || "active",
        notes: customer.notes || "",
      });
    }
    setErrors({});
  }, [customer, open]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || !customer) return;

    setIsSubmitting(true);
    try {
      const updates: Partial<Customer> = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || undefined,
        address: formData.address.trim() || undefined,
        status: formData.status,
        notes: formData.notes.trim() || undefined,
      };

      await onSave(customer.id || customer._id, updates);
      onOpenChange(false);
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] bg-card/95 backdrop-blur-3xl border-white/10 p-0 overflow-hidden rounded-[32px] shadow-2xl">
        <div className="relative p-6 pt-10">
          {/* Background design element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-12 translate-x-12 blur-3xl pointer-events-none" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Edit Profile</h2>
              <p className="text-xs text-muted-foreground font-medium">Refining customer intelligence</p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          <div className="space-y-5 max-h-[60vh] overflow-y-auto no-scrollbar pr-1 relative z-10 pb-4">
            {/* Status Selection (Tier 1 Importance) */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1 flex items-center gap-2">
                <Shield className="w-3 h-3 text-primary" /> Member Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['active', 'vip', 'inactive'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFormData({ ...formData, status: s })}
                    className={cn(
                      "py-2.5 rounded-xl text-xs font-bold border transition-all",
                      formData.status === s
                        ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                        : "bg-white/5 text-muted-foreground border-white/5 hover:border-white/20"
                    )}
                  >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px bg-white/5 my-2" />

            {/* Input Fields */}
            <div className="space-y-4">
              {[
                { key: 'name', label: 'Full Name', icon: User, placeholder: 'Enter name...' },
                { key: 'phone', label: 'Phone Number', icon: Phone, placeholder: '+91...' },
                { key: 'email', label: 'Email Address', icon: Mail, placeholder: 'name@email.com' },
                { key: 'address', label: 'Client Location', icon: MapPin, placeholder: 'Street address...' },
              ].map((field) => (
                <div key={field.key} className="space-y-2">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                    {field.label}
                  </label>
                  <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-colors group-focus-within:bg-primary/10">
                      <field.icon className={cn(
                        "w-4 h-4 transition-colors",
                        errors[field.key] ? "text-red-400" : "text-muted-foreground group-focus-within:text-primary"
                      )} />
                    </div>
                    <input
                      type="text"
                      value={(formData as any)[field.key]}
                      onChange={(e) => {
                        setFormData({ ...formData, [field.key]: e.target.value });
                        setErrors({ ...errors, [field.key]: "" });
                      }}
                      placeholder={field.placeholder}
                      className={cn(
                        "w-full h-12 pl-14 pr-4 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium",
                        errors[field.key] && "border-red-400/50 focus:border-red-400"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {errors[field.key] && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[10px] font-bold text-red-400 px-1 pt-1 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3" /> {errors[field.key]}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
                  Private Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Preferences, style notes, allergy info..."
                    rows={4}
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/5 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-8 flex gap-3 pb-2 relative z-10">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12 rounded-2xl font-bold text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              Discard
            </Button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="flex-[2] h-12 bg-primary text-black rounded-2xl font-extrabold flex items-center justify-center gap-2 shadow-xl shadow-primary/20 disabled:opacity-50 transition-all hover:bg-primary/90"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </motion.button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
