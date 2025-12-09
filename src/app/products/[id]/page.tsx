"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import VoucherSelector from "@/components/Voucher";
import { Voucher } from "@/lib/voucher";

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  // State chính
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
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
  const isOutOfStock = () => {
    if (!product) return true;
    if (product.status === 0) return true;
    if (product.quantity !== undefined && product.quantity <= 0) return true;
    if (product.stock !== undefined && product.stock <= 0) return true;
    return false;
  };

  // Hàm tính toán giảm giá từ voucher
  const calculateVoucherDiscount = () => {
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
  };

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
    if (product.stock !== undefined && quantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      setQuantity(product.stock);
      return;
    }
    
    if (product.quantity !== undefined && quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      setQuantity(product.quantity);
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
        router.push(
          `/auth/login?returnUrl=/products/${id}&addedToCart=true&productId=${product.id}&productName=${encodedProductName}`
        );
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
    
    if (product.stock !== undefined && quantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      setQuantity(product.stock);
      return;
    }
    
    if (product.quantity !== undefined && quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      setQuantity(product.quantity);
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
    
    if (product.stock !== undefined && quantity > product.stock) {
      alert(`Chỉ còn ${product.stock} sản phẩm trong kho!`);
      setQuantity(product.stock);
      return;
    }
    
    if (product.quantity !== undefined && quantity > product.quantity) {
      alert(`Chỉ còn ${product.quantity} sản phẩm trong kho!`);
      setQuantity(product.quantity);
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
    router.push("/checkout");
  };

  // Hàm gửi đánh giá
  const submitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để đánh giá');
      router.push('/auth/login');
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product.id,
          rating: reviewRating,
          comment: reviewComment
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        alert(errorText || 'Gửi đánh giá thất bại');
        return;
      }
      
      alert('Cảm ơn bạn đã đánh giá!');
      setReviewComment("");
      setShowReviewForm(false);
      
      // Reload product to get updated reviews
      const data = await getProductById(id as string);
      setProduct(data);
      if (data.reviews) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  // Lọc đánh giá
  const filteredReviews = reviews.filter(review => {
    if (reviewFilter === "all") return true;
    if (reviewFilter === "5") return review.rating === 5;
    if (reviewFilter === "4") return review.rating === 4;
    if (reviewFilter === "3") return review.rating === 3;
    if (reviewFilter === "2") return review.rating === 2;
    if (reviewFilter === "1") return review.rating === 1;
    if (reviewFilter === "with-comment") return review.comment && review.comment.trim() !== "";
    return true;
  });

  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  const voucherDiscount = calculateVoucherDiscount();
  const finalPrice = product ? Number(product.price) - voucherDiscount : 0;

  // Tính toán số lượng tối đa có thể mua
  const maxQuantity = product 
    ? Math.min(product.stock || 999, product.quantity || 999, 999)
    : 1;

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!product) return <p className="text-center mt-10">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <span>MyShop</span> &gt;
        <span>Điện Thoại & Phụ Kiện</span> &gt;
        <span>Điện thoại</span> &gt;
        <span>{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images?.[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {product.images?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded border-2 ${
                    selectedImage === index
                      ? "border-orange-500"
                      : "border-gray-200"
                  } overflow-hidden`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* TITLE */}
          <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>

          {/* STATUS */}
          <div className="space-y-2">
            <p className={`text-sm font-medium ${
              isOutOfStock() ? "text-red-600" : "text-green-600"
            }`}>
              {isOutOfStock() ? "🛑 Tình trạng: Hết hàng" : "✅ Còn hàng"}
            </p>
            {!isOutOfStock() && (product.stock || product.quantity) && (
              <p className="text-sm text-blue-600">
                {`Số lượng có sẵn: ${product.stock || product.quantity}`}
              </p>
            )}
          </div>

          {/* Ratings */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= averageRating ? "text-orange-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">{averageRating.toFixed(1)} trên 5</span>
            </div>
            <span className="text-sm text-gray-600">{reviews.length} Đánh Giá</span>
          </div>

          {/* PRICE */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-red-600">
              {finalPrice.toLocaleString("vi-VN")} ₫
            </div>
            {voucherDiscount > 0 && (
              <div className="text-lg text-gray-500 line-through">
                {Number(product.price).toLocaleString("vi-VN")} ₫
              </div>
            )}
            <div className="text-lg text-gray-500 line-through">
              {(product.price * 1.5).toLocaleString("vi-VN")} ₫
            </div>
          </div>

          {/* SHIPPING */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">giao hàng nhanh nhất trong 5 ngày – phí 0₫</p>
          </div>

          {/* COLOR */}
          <div>
            <label className="font-medium">Color</label>
            <div className="flex gap-2 mt-2">
              {["Purple", "Gray", "Gold", "Black", "Other"].map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded ${
                    selectedColor === color
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div>
            <label className="font-medium">Số lượng</label>
            <div className="flex items-center mt-2 gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={isOutOfStock()}
                className={`w-8 h-8 border rounded flex items-center justify-center ${
                  isOutOfStock()
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={e => {
                  const value = Math.max(1, Math.min(maxQuantity, Number(e.target.value) || 1));
                  setQuantity(value);
                }}
                disabled={isOutOfStock()}
                min="1"
                max={maxQuantity}
                className="w-16 h-8 border rounded text-center disabled:bg-gray-100"
              />
              <button
                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                disabled={isOutOfStock()}
                className={`w-8 h-8 border rounded flex items-center justify-center ${
                  isOutOfStock()
                    ? "bg-gray-100 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                +
              </button>
            </div>
            {!isOutOfStock() && maxQuantity < 999 && (
              <p className="text-xs text-gray-500 mt-1">
                Số lượng tối đa: {maxQuantity}
              </p>
            )}
          </div>

          {/* VOUCHER SECTION - Sử dụng component riêng */}
          <VoucherSelector
            selectedVoucher={selectedVoucher}
            onSelectVoucher={setSelectedVoucher}
            productPrice={product ? Number(product.price) : 0}
          />

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 mt-4">
            <button
              disabled={isOutOfStock() || addingToCart || redirectingToLogin}
              onClick={handleAddToCart}
              className={`flex-1 border-2 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
                isOutOfStock() || addingToCart || redirectingToLogin
                  ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100"
              }`}
            >
              {addingToCart
                ? "Đang xử lý..."
                : redirectingToLogin
                ? "Đang chuyển đến đăng nhập..."
                : isOutOfStock()
                ? "Hết hàng"
                : "🛒 Thêm Vào Giỏ Hàng"}
            </button>
            
            <button
              disabled={isOutOfStock() || redirectingToLogin}
              onClick={handleBuyNow}
              className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                isOutOfStock() || redirectingToLogin
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
              }`}
            >
              {redirectingToLogin
                ? "Đang xử lý..."
                : isOutOfStock()
                ? "Hết hàng"
                : "Mua Ngay"}
            </button>
          </div>

          {/* Thông báo nếu chưa đăng nhập */}
          {!userToken && !redirectingToLogin && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="text-sm text-yellow-700">
                <p className="mb-2">
                  ⚠️ <strong>Lưu ý:</strong> Bạn chưa đăng nhập. Nhấn "Thêm Vào Giỏ Hàng" hoặc "Mua Ngay" để:
                </p>
                <ol className="list-decimal ml-5 mt-1 space-y-1">
                  <li>Tự động lưu sản phẩm vào giỏ hàng tạm thời</li>
                  <li>Chuyển đến trang đăng nhập</li>
                  <li>Sản phẩm sẽ tự động được đồng bộ sau khi đăng nhập</li>
                </ol>
              </div>
            </div>
          )}

          {/* Thông báo đang chuyển hướng */}
          {redirectingToLogin && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <p className="text-sm text-blue-700">
                  Đang chuyển đến trang đăng nhập...
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">ĐÁNH GIÁ SẢN PHẨM</h2>
        
        {/* Rating Summary */}
        <div className="flex items-center gap-8 mb-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-500">
              {averageRating.toFixed(1)} trên 5
            </div>
            <div className="flex justify-center mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl ${
                    star <= averageRating ? 'text-orange-500' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
          
          {/* Review Filters */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setReviewFilter("all")}
              className={`px-3 py-1 rounded ${
                reviewFilter === "all"
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tất Cả
            </button>
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                onClick={() => setReviewFilter(rating.toString())}
                className={`px-3 py-1 rounded ${
                  reviewFilter === rating.toString()
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {rating} Sao ({reviews.filter(r => r.rating === rating).length})
              </button>
            ))}
            <button
              onClick={() => setReviewFilter("with-comment")}
              className={`px-3 py-1 rounded ${
                reviewFilter === "with-comment"
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Có Bình Luận ({reviews.filter(r => r.comment?.trim() !== "").length})
            </button>
          </div>
        </div>

        {/* Add Review Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {showReviewForm ? 'Hủy đánh giá' : 'Viết đánh giá'}
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-medium mb-3">Đánh giá sản phẩm</h3>
            <div className="space-y-3">
              {/* Rating Stars */}
              <div className="flex items-center gap-2">
                <span className="text-sm">Đánh giá:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setReviewRating(star)}
                    className={`text-xl ${
                      star <= reviewRating ? 'text-orange-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              
              {/* Comment Box */}
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                className="w-full border border-gray-300 rounded p-3 h-24 resize-none"
              />
              
              {/* Submit */}
              <div className="flex gap-2">
                <button
                  onClick={submitReview}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Gửi đánh giá
                </button>
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
          ) : (
            filteredReviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {review.user_name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{review.user_name}</span>
                      {/* Rating stars */}
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-sm ${
                              star <= review.rating ? 'text-orange-500' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">
                      {new Date(review.created_at).toLocaleDateString('vi-VN')} |
                      Phân loại hàng: {selectedColor || 'Default'}
                    </p>
                    {review.comment && (
                      <p className="text-gray-700 mb-2">{review.comment}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        👍 Hữu ích?
                      </button>
                      <button className="text-sm text-gray-500 hover:text-gray-700">
                        ⋮
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Pagination */}
        {filteredReviews.length > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              &lt;
            </button>
            <button className="px-3 py-1 bg-red-500 text-white rounded">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
              &gt;
            </button>
          </div>
        )}
      </div>
      {/* Related Products */}
      <div className="border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">SẢN PHẨM LIÊN QUAN</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map((related) => (
            <Link key={related.id} href={`/products/${related.id}`}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                  <img
                    src={related.images?.[0] || "/placeholder.png"}
                    alt={related.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">{related.name}</h3>
                <p className="text-red-500 font-semibold">
                  {related.price.toLocaleString()}₫
                </p>
                {related.status === 0 && (
                  <p className="text-xs text-red-600 mt-1">Hết hàng</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}