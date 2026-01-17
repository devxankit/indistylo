import { describe, it, expect, beforeEach } from 'vitest';
import { useUserStore } from './useUserStore';

describe('useUserStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useUserStore.setState({
      name: "User",
      location: "New Palasia",
      points: 1000,
      cartCount: 0,
      notificationsCount: 0,
      currentPage: "home",
      isLoggedIn: true,
      userPhone: "+91 9876543210",
    });
  });

  it('should update user name', () => {
    useUserStore.getState().setName('John Doe');
    expect(useUserStore.getState().name).toBe('John Doe');
  });

  it('should update location', () => {
    useUserStore.getState().setLocation('Indore');
    expect(useUserStore.getState().location).toBe('Indore');
  });

  it('should update login status and clear data on logout', () => {
    useUserStore.getState().logout();
    expect(useUserStore.getState().isLoggedIn).toBe(false);
    expect(useUserStore.getState().name).toBe('User');
    expect(useUserStore.getState().userPhone).toBe('');
  });

  it('should update notification count', () => {
    useUserStore.getState().setNotificationsCount(5);
    expect(useUserStore.getState().notificationsCount).toBe(5);
  });
});
