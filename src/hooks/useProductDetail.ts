"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import { Voucher } from "@/lib/voucher";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
}

export const useProductDetail = () => {
  const { id } = useParams();
  
  // State chính
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [redirectingToLogin, setRedirectingToLogin] = useState(false);
  
  // State cho voucher
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  
  const userToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Load product and reviews
  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
        setReviews(data.reviews || []);
        
        // Fetch related products
        const products = await getProducts();
        const related = products
          .filter((p: any) => p.id !== parseInt(id as string))
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  // Kiểm tra sản phẩm hết hàng
  const isOutOfStock = useCallback(() => {
    if (!product) return true;
    if (product.status === 0) return true;
    if (product.quantity !== undefined && product.quantity <= 0) return true;
    if (product.stock !== undefined && product.stock <= 0) return true;
    return false;
  }, [product]);

  // Hàm tính toán giảm giá từ voucher
  const calculateVoucherDiscount = useCallback(() => {
    if (!product || !selectedVoucher) return 0;
    
    const basePrice = Number(product.price);
    
    // Kiểm tra điều kiện áp dụng voucher
    if (basePrice < selectedVoucher.minOrderAmount) {
      return 0;
    }
    
    if (selectedVoucher.discountType === "fixed") {
      return selectedVoucher.discountValue;
    } else if (selectedVoucher.discountType === "percentage") {
      const discountAmount = (basePrice * selectedVoucher.discountValue) / 100;
      if (selectedVoucher.maxDiscount) {
        return Math.min(discountAmount, selectedVoucher.maxDiscount);
      }
      return discountAmount;
    }
    
    return 0;
  }, [product, selectedVoucher]);

  // Tính toán số lượng tối đa có thể mua
  const maxQuantity = product 
    ? Math.min(product.stock || 999, product.quantity || 999, 999)
    : 1;

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const voucherDiscount = calculateVoucherDiscount();
  const finalPrice = product ? Number(product.price) - voucherDiscount : 0;

  return {
    product,
    loading,
    selectedImage,
    selectedColor,
    quantity,
    reviews,
    relatedProducts,
    addingToCart,
    redirectingToLogin,
    selectedVoucher,
    userToken,
    setSelectedImage,
    setSelectedColor,
    setQuantity,
    setAddingToCart,
    setRedirectingToLogin,
    setSelectedVoucher,
    isOutOfStock,
    maxQuantity,
    averageRating,
    voucherDiscount,
    finalPrice,
    productId: id as string,
  };
};