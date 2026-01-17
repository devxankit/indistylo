import { api } from './apiClient';
import { type Address } from '../store/useAddressStore';

export interface UserProfile {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatarUrl?: string;
  points: number;
  membershipId: string;
}

export const userService = {
  getProfile: () => api.get<UserProfile>('/user/profile'),
  updateProfile: (data: Partial<UserProfile>) => api.put<UserProfile>('/user/profile', data),

  // Address operations
  getAddresses: () => api.get<Address[]>('/user/addresses'),
  addAddress: (address: Omit<Address, 'id'>) => api.post<Address>('/user/addresses', address),
  updateAddress: (id: string, address: Partial<Address>) => api.put<Address>(`/user/addresses/${id}`, address),
  deleteAddress: (id: string) => api.delete(`/user/addresses/${id}`),
};

export const authService = {
  sendOtp: (phone: string) => api.post<{ success: boolean }>('/auth/send-otp', { phone }),
  verifyOtp: (phone: string, otp: string) => api.post<{ token: string; user: UserProfile }>('/auth/verify-otp', { phone, otp }),
  logout: () => api.post('/auth/logout', {}),
};
