import { create } from "zustand";

export interface Address {
  id: string;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault?: boolean;
}

interface AddressState {
  addresses: Address[];
  selectedAddressId: string | null;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setSelectedAddress: (id: string | null) => void;
  setDefaultAddress: (id: string) => void;
  getSelectedAddress: () => Address | null;
  getDefaultAddress: () => Address | null;
}

// LocalStorage keys
const STORAGE_KEY_ADDRESSES = 'salon_app_addresses';
const STORAGE_KEY_SELECTED_ADDRESS = 'salon_app_selected_address_id';

// Helper functions for localStorage
const loadAddressesFromStorage = (): Address[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_ADDRESSES);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading addresses from localStorage:', error);
    return [];
  }
};

const saveAddressesToStorage = (addresses: Address[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ADDRESSES, JSON.stringify(addresses));
  } catch (error) {
    console.error('Error saving addresses to localStorage:', error);
  }
};

const loadSelectedAddressIdFromStorage = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_SELECTED_ADDRESS);
  } catch (error) {
    console.error('Error loading selected address ID from localStorage:', error);
    return null;
  }
};

const saveSelectedAddressIdToStorage = (id: string | null) => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_SELECTED_ADDRESS, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_SELECTED_ADDRESS);
    }
  } catch (error) {
    console.error('Error saving selected address ID to localStorage:', error);
  }
};

export const useAddressStore = create<AddressState>((set, get) => ({
  addresses: loadAddressesFromStorage(),
  selectedAddressId: loadSelectedAddressIdFromStorage(),
  
  addAddress: (address) => {
    const newAddress: Address = {
      ...address,
      id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    
    // If this is the first address or marked as default, set it as default
    if (get().addresses.length === 0 || address.isDefault) {
      newAddress.isDefault = true;
      // Remove default from other addresses
      const updatedAddresses = get().addresses.map(addr => ({
        ...addr,
        isDefault: false,
      }));
      const finalAddresses = [...updatedAddresses, newAddress];
      saveAddressesToStorage(finalAddresses);
      saveSelectedAddressIdToStorage(newAddress.id);
      set({
        addresses: finalAddresses,
        selectedAddressId: newAddress.id,
      });
    } else {
      newAddress.isDefault = false;
      const finalAddresses = [...get().addresses, newAddress];
      saveAddressesToStorage(finalAddresses);
      set({
        addresses: finalAddresses,
      });
    }
  },
  
  updateAddress: (id, updates) => {
    const addresses = get().addresses.map(addr => {
      if (addr.id === id) {
        const updated = { ...addr, ...updates };
        // If setting as default, remove default from others
        if (updates.isDefault) {
          return updated;
        }
        return updated;
      }
      // Remove default from others if this address is being set as default
      if (updates.isDefault) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });
    
    saveAddressesToStorage(addresses);
    set({ addresses });
  },
  
  deleteAddress: (id) => {
    const addresses = get().addresses.filter(addr => addr.id !== id);
    const deletedWasSelected = get().selectedAddressId === id;
    const deletedWasDefault = get().addresses.find(addr => addr.id === id)?.isDefault;
    
    // If deleted address was selected or default, select another address or null
    let selectedAddressId = get().selectedAddressId;
    if (deletedWasSelected || deletedWasDefault) {
      const firstAddress = addresses[0];
      if (firstAddress) {
        firstAddress.isDefault = true;
        selectedAddressId = firstAddress.id;
      } else {
        selectedAddressId = null;
      }
    }
    
    saveAddressesToStorage(addresses);
    saveSelectedAddressIdToStorage(selectedAddressId);
    set({ addresses, selectedAddressId });
  },
  
  setSelectedAddress: (id) => {
    saveSelectedAddressIdToStorage(id);
    set({ selectedAddressId: id });
  },
  
  setDefaultAddress: (id) => {
    const addresses = get().addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));
    saveAddressesToStorage(addresses);
    saveSelectedAddressIdToStorage(id);
    set({ addresses, selectedAddressId: id });
  },
  
  getSelectedAddress: () => {
    const selectedId = get().selectedAddressId;
    if (selectedId) {
      return get().addresses.find(addr => addr.id === selectedId) || null;
    }
    return get().getDefaultAddress();
  },
  
  getDefaultAddress: () => {
    return get().addresses.find(addr => addr.isDefault) || get().addresses[0] || null;
  },
}));

