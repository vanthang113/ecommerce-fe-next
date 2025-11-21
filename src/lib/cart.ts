// frontend/lib/cart.ts
"use client";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
}

const CART_KEY = "cart_items";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function addToCart(item: CartItem) {
  const cart = getCart();
  const index = cart.findIndex((c) => c.id === item.id);
  if (index >= 0) {
    cart[index].qty += item.qty;
  } else {
    cart.push(item);
  }
  saveCart(cart);
  // Dispatch event to notify components about cart change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
}

export function removeFromCart(id: number) {
  let cart = getCart().filter((c) => c.id !== id);
  saveCart(cart);
  // Dispatch event to notify components about cart change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
}

export function clearCart() {
  saveCart([]);
  // Dispatch event to notify components about cart change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
}
