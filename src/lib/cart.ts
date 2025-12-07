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

// Hàm lấy giỏ hàng từ localStorage
export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Hàm lưu giỏ hàng vào localStorage
export function saveCart(cart: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Hàm thêm vào giỏ hàng - CHỈ LƯU VÀO LOCALSTORAGE
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

// Hàm thêm vào giỏ hàng LOCAL (tương tự addToCart nhưng trả về cart)
export function addToCartLocal(item: CartItem) {
  const cart = getCart();
  const index = cart.findIndex((c) => c.id === item.id);
  
  if (index >= 0) {
    cart[index].qty += item.qty;
  } else {
    cart.push(item);
  }
  
  saveCart(cart);
  
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
  
  return cart;
}

// Hàm xóa sản phẩm khỏi giỏ hàng
export function removeFromCart(id: number) {
  let cart = getCart().filter((c) => c.id !== id);
  saveCart(cart);
  
  // Dispatch event to notify components about cart change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
}

// Hàm xóa toàn bộ giỏ hàng
export function clearCart() {
  saveCart([]);
  
  // Dispatch event to notify components about cart change
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("cartChange"));
  }
}

// Hàm đồng bộ giỏ hàng lên server (dùng sau khi đăng nhập)
export async function syncCartToServer(token: string): Promise<{success: boolean, syncedItems: number}> {
  try {
    const cart = getCart();
    
    if (cart.length === 0) {
      return { success: true, syncedItems: 0 };
    }
    
    console.log('Bắt đầu đồng bộ giỏ hàng:', cart);
    let syncedCount = 0;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    // Gửi từng sản phẩm lên server
    for (const item of cart) {
      try {
        const response = await fetch(`${API_URL}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: item.id,
            quantity: item.qty
          })
        });
        
        if (response.ok) {
          syncedCount++;
          console.log(`Đã đồng bộ sản phẩm ${item.id}: ${item.name}`);
        } else {
          console.warn(`Không thể đồng bộ sản phẩm ${item.id} lên server`);
        }
      } catch (itemError) {
        console.error(`Lỗi khi đồng bộ sản phẩm ${item.id}:`, itemError);
      }
    }
    
    // Xóa giỏ hàng localStorage sau khi đồng bộ thành công
    if (syncedCount > 0) {
      saveCart([]);
      console.log(`Đã đồng bộ ${syncedCount} sản phẩm thành công`);
    }
    
    return { 
      success: syncedCount > 0, 
      syncedItems: syncedCount 
    };
    
  } catch (error) {
    console.error('Lỗi khi đồng bộ giỏ hàng:', error);
    return { success: false, syncedItems: 0 };
  }
}

// Hàm lấy tổng số lượng sản phẩm trong giỏ
export function getCartItemCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.qty, 0);
}

// Hàm tính tổng tiền giỏ hàng
export function getCartTotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

// Hàm kiểm tra sản phẩm đã có trong giỏ hàng chưa
export function isInCart(productId: number): boolean {
  const cart = getCart();
  return cart.some(item => item.id === productId);
}

// Hàm lấy số lượng của một sản phẩm trong giỏ
export function getItemQuantity(productId: number): number {
  const cart = getCart();
  const item = cart.find(item => item.id === productId);
  return item ? item.qty : 0;
}

// Hàm cập nhật số lượng sản phẩm
export function updateCartItemQuantity(id: number, newQty: number) {
  const cart = getCart();
  const index = cart.findIndex((c) => c.id === id);
  
  if (index >= 0) {
    if (newQty <= 0) {
      removeFromCart(id);
    } else {
      cart[index].qty = newQty;
      saveCart(cart);
      
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("cartChange"));
      }
    }
  }
}