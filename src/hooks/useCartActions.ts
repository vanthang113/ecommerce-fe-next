"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

interface UseCartActionsProps {
  product: any;
  quantity: number;
  finalPrice: number;
  isOutOfStock: () => boolean;
  setQuantity: (quantity: number) => void;
  setAddingToCart: (adding: boolean) => void;
  setRedirectingToLogin: (redirecting: boolean) => void;
  userToken: string | null;
  productId: string;
}

export const useCartActions = ({
  product,
  quantity,
  finalPrice,
  isOutOfStock,
  setQuantity,
  setAddingToCart,
  setRedirectingToLogin,
  userToken,
  productId,
}: UseCartActionsProps) => {
  // Hàm thêm vào giỏ hàng và chuyển đến đăng nhập
  const handleAddToCartAndLogin = () => {
    if (isOutOfStock()) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }
    
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }
    
    // Kiểm tra số lượng tồn kho
    const stock = product.stock || product.quantity;
    if (stock !== undefined && quantity > stock) {
      alert(`Chỉ còn ${stock} sản phẩm trong kho!`);
      setQuantity(stock);
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      image: product.images?.[0],
    };
    
    setAddingToCart(true);
    setRedirectingToLogin(true);
    
    try {
      addToCart(cartItem);
      alert("✅ Đã thêm sản phẩm vào giỏ hàng tạm thời! Đang chuyển đến trang đăng nhập...");
      
      const encodedProductName = encodeURIComponent(product.name);
      setTimeout(() => {
        window.location.href = `/auth/login?returnUrl=/products/${productId}&addedToCart=true&productId=${product.id}&productName=${encodedProductName}`;
      }, 1000);
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      setAddingToCart(false);
      setRedirectingToLogin(false);
    }
  };

  // Hàm thêm vào giỏ hàng (khi đã đăng nhập)
  const handleAddToCart = async () => {
    if (!userToken) {
      handleAddToCartAndLogin();
      return;
    }
    
    if (isOutOfStock()) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }
    
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }
    
    const stock = product.stock || product.quantity;
    if (stock !== undefined && quantity > stock) {
      alert(`Chỉ còn ${stock} sản phẩm trong kho!`);
      setQuantity(stock);
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      image: product.images?.[0],
    };
    
    setAddingToCart(true);
    
    try {
      addToCart(cartItem);
      alert("✅ Đã thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } finally {
      setAddingToCart(false);
    }
  };

  // Hàm Mua ngay
  const handleBuyNow = () => {
    if (!userToken) {
      handleAddToCartAndLogin();
      return;
    }
    
    if (isOutOfStock()) {
      alert("Sản phẩm đã hết hàng!");
      return;
    }
    
    if (quantity < 1) {
      alert("Số lượng phải lớn hơn 0!");
      return;
    }
    
    const stock = product.stock || product.quantity;
    if (stock !== undefined && quantity > stock) {
      alert(`Chỉ còn ${stock} sản phẩm trong kho!`);
      setQuantity(stock);
      return;
    }
    
    const cartItem = {
      id: product.id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      image: product.images?.[0],
    };
    
    addToCart(cartItem);
    window.location.href = "/checkout";
  };

  return {
    handleAddToCartAndLogin,
    handleAddToCart,
    handleBuyNow,
  };
};