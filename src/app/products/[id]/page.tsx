"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductById, getProducts } from "@/lib/products";
import { addToCart } from "@/lib/cart";
import { API_URL } from "@/lib/api";
import Link from "next/link";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState("");
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const data = await getProductById(id as string);
        setProduct(data);
        if (data.reviews) {
          setReviews(data.reviews);
        }
        
        // Fetch related products
        const products = await getProducts();
        const related = products.filter((p: any) => p.id !== parseInt(id as string)).slice(0, 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice,
      qty: quantity,
      image: product.images?.[0],
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Redirect to checkout
    window.location.href = "/checkout";
  };

  const submitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Bạn cần đăng nhập để đánh giá');
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

  // Calculate voucher discount
  const calculateVoucherDiscount = () => {
    if (!product) return 0;
    const basePrice = Number(product.price);
    switch (selectedVoucher) {
      case "newuser":
        return basePrice >= 500000 ? 50000 : 0;
      case "freeship":
        return basePrice >= 200000 ? 30000 : 0;
      case "flashsale":
        return Math.min(basePrice * 0.2, 100000);
      default:
        return 0;
    }
  };

  const voucherDiscount = calculateVoucherDiscount();
  const finalPrice = product ? Number(product.price) - voucherDiscount : 0;

  if (loading) return <p className="text-center mt-10">Đang tải...</p>;
  if (!product) return <p className="text-center mt-10">Không tìm thấy sản phẩm</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <span>MyShop</span> &gt; <span>Điện Thoại & Phụ Kiện</span> &gt; <span>Điện thoại</span> &gt; <span>{product.name}</span>
      </nav>

      {/* Main Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Left Column - Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.images?.[selectedImage] || "/placeholder.png"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Thumbnail Carousel */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded border-2 ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200'
                  } overflow-hidden`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column - Product Info */}
        <div className="space-y-6">
          {/* Product Title */}
          <h1 className="text-2xl font-semibold text-gray-900">{product.name}</h1>
          
          {/* Rating and Reviews */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-lg ${
                      star <= averageRating ? 'text-orange-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">{averageRating.toFixed(1)} trên 5</span>
            </div>
            <span className="text-sm text-gray-600">{reviews.length} Đánh Giá</span>
            <button className="text-sm text-gray-500 hover:underline">Tố cáo</button>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="text-3xl font-bold text-red-600">
              {finalPrice.toLocaleString('vi-VN')} ₫
            </div>
            {voucherDiscount > 0 && (
              <div className="text-lg text-gray-500 line-through">
                {Number(product.price).toLocaleString('vi-VN')} ₫
              </div>
            )}
            <div className="text-lg text-gray-500 line-through">
              {Number(product.price * 1.5).toLocaleString('vi-VN')} ₫
            </div>
            <div className="flex gap-2">
              <span className="inline-block bg-red-100 text-red-600 px-2 py-1 rounded text-sm font-medium">
                -33%
              </span>
              {voucherDiscount > 0 && (
                <span className="inline-block bg-green-100 text-green-600 px-2 py-1 rounded text-sm font-medium">
                  -{voucherDiscount.toLocaleString('vi-VN')}₫
                </span>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">🚚</span>
              <span className="font-medium">Vận Chuyển</span>
            </div>
            <p className="text-sm text-gray-600">
              giao hàng nhanh nhất trong 5 ngày, phí giao 0₫
            </p>
            <p className="text-sm text-green-600 mt-1">
              Tặng Voucher 15.000₫ nếu đơn giao sau thời gian trên.
            </p>
          </div>

          {/* Color Selection */}
          <div className="space-y-3">
            <label className="block font-medium">Color</label>
            <div className="flex gap-2">
              {['Purple', 'Gray', 'Gold', 'Black', 'Other'].map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border rounded ${
                    selectedColor === color 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Voucher Selection */}
          <div className="space-y-3">
            <label className="block font-medium">Voucher Giảm Giá</label>
            <button
              onClick={() => setShowVoucherModal(true)}
              className="w-full p-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-50 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🎫</span>
                <span className="font-medium">
                  {selectedVoucher === "" ? "Chọn voucher giảm giá" : 
                   selectedVoucher === "newuser" ? "Voucher Người Mới" :
                   selectedVoucher === "freeship" ? "Miễn Phí Vận Chuyển" :
                   selectedVoucher === "flashsale" ? "Flash Sale" : "Chọn voucher"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {voucherDiscount > 0 && (
                  <span className="text-sm font-medium text-green-600">
                    -{voucherDiscount.toLocaleString('vi-VN')}₫
                  </span>
                )}
                <span className="text-lg">›</span>
              </div>
            </button>
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <label className="block font-medium">Số Lượng</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 h-8 border border-gray-300 rounded text-center"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleAddToCart}
              className="flex-1 border-2 border-red-500 text-red-500 py-3 rounded-lg font-medium hover:bg-red-50 flex items-center justify-center gap-2"
            >
              🛒 Thêm Vào Giỏ Hàng
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600"
            >
              Mua Ngay
            </button>
          </div>
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
              Có Bình Luận ({reviews.filter(r => r.comment && r.comment.trim() !== "").length})
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
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                className="w-full border border-gray-300 rounded p-3 h-24 resize-none"
              />
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
                      <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                        👍 Hữu Ích?
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t pt-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">SẢN PHẨM LIÊN QUAN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.id}`}>
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-square bg-gray-100">
                    <img
                      src={relatedProduct.images?.[0] || "/placeholder.png"}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-sm mb-2 line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`text-xs ${
                              star <= 4 ? 'text-orange-500' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-xs text-gray-500">(12)</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      {Number(relatedProduct.price).toLocaleString('vi-VN')} ₫
                    </div>
                    <div className="text-sm text-gray-500 line-through">
                      {Number(relatedProduct.price * 1.3).toLocaleString('vi-VN')} ₫
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowVoucherModal(false)}
        >
          <div 
            className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Chọn Voucher Giảm Giá</h3>
                <button
                  onClick={() => setShowVoucherModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedVoucher("");
                    setShowVoucherModal(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedVoucher === "" 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Không sử dụng voucher</span>
                    <span className="text-sm text-gray-500">Tiết kiệm 0₫</span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedVoucher("newuser");
                    setShowVoucherModal(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedVoucher === "newuser" 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${product && Number(product.price) < 500000 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={product ? Number(product.price) < 500000 : true}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-green-600">Voucher Người Mới</span>
                      <p className="text-sm text-gray-600">
                        Giảm 50.000₫ cho đơn từ 500.000₫
                        {product && Number(product.price) < 500000 && (
                          <span className="text-red-500 ml-1">(Chưa đủ điều kiện)</span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-green-600 font-medium">
                      {product && Number(product.price) >= 500000 ? 'Tiết kiệm 50.000₫' : 'Không áp dụng'}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedVoucher("freeship");
                    setShowVoucherModal(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedVoucher === "freeship" 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  } ${product && Number(product.price) < 200000 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={product ? Number(product.price) < 200000 : true}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-blue-600">Miễn Phí Vận Chuyển</span>
                      <p className="text-sm text-gray-600">
                        Miễn phí ship cho đơn từ 200.000₫
                        {product && Number(product.price) < 200000 && (
                          <span className="text-red-500 ml-1">(Chưa đủ điều kiện)</span>
                        )}
                      </p>
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      {product && Number(product.price) >= 200000 ? 'Tiết kiệm 30.000₫' : 'Không áp dụng'}
                    </span>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedVoucher("flashsale");
                    setShowVoucherModal(false);
                  }}
                  className={`w-full p-3 border rounded-lg text-left ${
                    selectedVoucher === "flashsale" 
                      ? 'border-orange-500 bg-orange-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-red-600">Flash Sale</span>
                      <p className="text-sm text-gray-600">Giảm 20% tối đa 100.000₫</p>
                    </div>
                    <span className="text-sm text-red-600 font-medium">Tiết kiệm 100.000₫</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
