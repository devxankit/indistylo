import { useState } from "react";
import { X, Plus, Trash2, Edit2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogBody,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAddressStore, type Address } from "../store/useAddressStore";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";

interface AddressDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddressDialog({ open, onOpenChange }: AddressDialogProps) {
  const {
    addresses,
    selectedAddressId,
    addAddress,
    updateAddress,
    deleteAddress,
    setSelectedAddress,
    setDefaultAddress,
  } = useAddressStore();

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Address>>({
    name: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    isDefault: false,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
      landmark: "",
      isDefault: false,
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleSave = () => {
    if (
      !formData.name ||
      !formData.phone ||
      !formData.addressLine1 ||
      !formData.city ||
      !formData.state ||
      !formData.pincode
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (editingId) {
      updateAddress(editingId, formData);
      if (formData.isDefault) {
        setDefaultAddress(editingId);
      }
      toast.success("Address updated successfully");
    } else {
      addAddress(formData as Omit<Address, "id">);
      toast.success("Address added successfully");
    }

    resetForm();
  };

  const handleEdit = (address: Address) => {
    setFormData(address);
    setEditingId(address.id);
    setIsAddingNew(true);
  };

  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setAddressToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (!addressToDelete) return;

    deleteAddress(addressToDelete);
    if (selectedAddressId === addressToDelete) {
      setSelectedAddress(null);
    }
    toast.success("Address deleted successfully");
    setAddressToDelete(null);
  };

  const handleSelectAddress = (id: string) => {
    setSelectedAddress(id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] text-left">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="text-left">Manage Addresses</DialogTitle>
            <DialogClose
              onClose={() => {
                onOpenChange(false);
                resetForm();
              }}
            />
          </div>
        </DialogHeader>

        <DialogBody className="p-4 space-y-4 text-left">
          {/* Add New Address Button */}
          {!isAddingNew && (
            <Button
              onClick={() => setIsAddingNew(true)}
              className="w-full border border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 justify-start"
              variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add New Address
            </Button>
          )}

          {/* Address Form */}
          {isAddingNew && (
            <div className="bg-transparent border border-border rounded-lg p-4 space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-left">
                  {editingId ? "Edit Address" : "Add New Address"}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    maxLength={10}
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine1 || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine1: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="House/Flat No., Building Name"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground block mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.addressLine2 || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, addressLine2: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    placeholder="Street, Area"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.city || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      value={formData.state || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.pincode || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Pincode"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1">
                      Landmark
                    </label>
                    <input
                      type="text"
                      value={formData.landmark || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, landmark: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground text-left focus:outline-none focus:ring-2 focus:ring-yellow-400"
                      placeholder="Nearby landmark"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="default"
                    checked={formData.isDefault || false}
                    onChange={(e) =>
                      setFormData({ ...formData, isDefault: e.target.checked })
                    }
                    className="w-4 h-4 accent-yellow-400"
                  />
                  <label
                    htmlFor="default"
                    className="text-sm text-foreground cursor-pointer">
                    Set as default address
                  </label>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleSave}
                    variant="outline"
                    className="flex-1 border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 justify-start">
                    Save Address
                  </Button>
                  <Button
                    onClick={resetForm}
                    variant="outline"
                    className="flex-1 justify-start">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Existing Addresses List */}
          {addresses.length > 0 && (
            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-foreground text-left">
                Saved Addresses
              </h3>
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-card border rounded-lg p-4 space-y-2 text-left ${selectedAddressId === address.id
                    ? "border-yellow-400 bg-yellow-400/5"
                    : "border-border"
                    }`}>
                  <div className="flex items-start text-left">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {address.name}
                        </h4>
                        {address.isDefault && (
                          <span className="text-xs bg-yellow-400 text-gray-900 px-2 py-0.5 rounded">
                            Default
                          </span>
                        )}
                        {selectedAddressId === address.id && (
                          <Check className="w-4 h-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.phone}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                      {address.landmark && (
                        <p className="text-sm text-muted-foreground">
                          Near {address.landmark}
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(address)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Edit">
                        <Edit2 className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(address.id)}
                        className="p-2 hover:bg-muted rounded transition-colors"
                        title="Delete">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    </div>
                  </div>

                  {selectedAddressId !== address.id && (
                    <Button
                      onClick={() => handleSelectAddress(address.id)}
                      variant="outline"
                      size="sm"
                      className="w-full border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 hover:text-yellow-400 justify-start">
                      Select Address
                    </Button>
                  )}

                  {!address.isDefault && selectedAddressId === address.id && (
                    <Button
                      onClick={() => setDefaultAddress(address.id)}
                      variant="outline"
                      size="sm"
                      className="w-full justify-start">
                      Set as Default
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {addresses.length === 0 && !isAddingNew && (
            <div className="text-left py-8 text-muted-foreground">
              <p>No addresses saved yet</p>
              <p className="text-sm mt-1">
                Click "Add New Address" to get started
              </p>
            </div>
          )}
        </DialogBody>
      </DialogContent>

      <ConfirmationDialog
        open={!!addressToDelete}
        onOpenChange={(open) => !open && setAddressToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Address"
        description="Are you sure you want to delete this address? This action cannot be undone."
        variant="destructive"
        confirmText="Delete"
      />
    </Dialog>
  );
}
