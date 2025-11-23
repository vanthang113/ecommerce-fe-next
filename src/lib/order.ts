// frontend/lib/order.ts
"use client";

import { getCart, clearCart } from "./cart";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function createOrder(
  token: string,
  shippingAddress: Record<string, any>,
  paymentMethod: string
) {
  const cart = getCart();

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      shipping_address: shippingAddress,
      payment_method: paymentMethod,
      items: cart.map((item) => ({
        product_id: item.id,
        qty: item.qty,
        price: item.price,
      })),
    }),
  });

  if (!res.ok) {
    throw new Error("Tạo đơn hàng thất bại");
  }

  const data = await res.json();
  clearCart(); // xóa giỏ hàng sau khi thanh toán
  return data;
}
