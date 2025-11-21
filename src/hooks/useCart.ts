"use client";

import { useEffect, useState } from "react";
import { getCart, CartItem } from "@/lib/cart";

export default function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    // Load cart from localStorage
    setCart(getCart());

    // Listen for cart changes
    const handleCartChange = () => {
      setCart(getCart());
    };

    window.addEventListener("cartChange", handleCartChange);

    return () => {
      window.removeEventListener("cartChange", handleCartChange);
    };
  }, []);

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.qty, 0);
  };

  return { cart, getTotalItems };
}
