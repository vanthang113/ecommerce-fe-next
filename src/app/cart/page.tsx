"use client";

import { useEffect, useState } from "react";
import { getCart, removeFromCart, clearCart, CartItem } from "@/lib/cart";
import Link from "next/link";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    setCart(getCart());
  }, []);

  const handleRemove = (id: number) => {
    removeFromCart(id);
    setCart(getCart());
  };

  const handleClear = () => {
    clearCart();
    setCart([]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0)
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <Link href="/products" className="text-blue-600 hover:underline">
          Mua sắm ngay
        </Link>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Giỏ hàng</h1>

      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-b pb-2"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">
                  {item.price} ₫ x {item.qty}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleRemove(item.id)}
              className="text-red-600 hover:underline"
            >
              Xóa
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-xl font-bold">Tổng: {total} ₫</p>
        <div className="flex gap-4">
          <button
            onClick={handleClear}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Xóa hết
          </button>
          <Link
            href="/checkout"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Thanh toán
          </Link>
        </div>
      </div>
    </div>
  );
}
