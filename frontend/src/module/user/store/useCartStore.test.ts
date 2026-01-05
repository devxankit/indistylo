import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should add an item to the cart', () => {
    const item = { id: '1', title: 'Test Service', description: 'Test', price: 100, duration: 30, image: '' };
    useCartStore.getState().addItem(item, 1);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('1');
    expect(items[0].quantity).toBe(1);
  });

  it('should increment quantity if same item is added', () => {
    const item = { id: '1', title: 'Test Service', description: 'Test', price: 100, duration: 30, image: '' };
    useCartStore.getState().addItem(item, 1);
    useCartStore.getState().addItem(item, 2);

    const items = useCartStore.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(3);
  });

  it('should calculate totals correctly', () => {
    const item1 = { id: '1', title: 'Service 1', description: 'Test 1', price: 100, duration: 30, image: '' };
    const item2 = { id: '2', title: 'Service 2', description: 'Test 2', price: 200, duration: 60, image: '' };

    useCartStore.getState().addItem(item1, 2);
    useCartStore.getState().addItem(item2, 1);

    expect(useCartStore.getState().getItemTotal()).toBe(400);
    expect(useCartStore.getState().getTotal()).toBe(410); // 400 + 10 fee
  });

  it('should remove items correctly', () => {
    const item = { id: '1', title: 'Test Service', description: 'Test', price: 100, duration: 30, image: '' };
    useCartStore.getState().addItem(item, 1);
    useCartStore.getState().removeItem('1');

    expect(useCartStore.getState().items).toHaveLength(0);
  });
});
