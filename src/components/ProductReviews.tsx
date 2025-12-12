"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getProductById } from "@/lib/products";
import { API_URL } from "@/lib/api";

interface Review {
  id: number;
  rating: number;
  comment: string;
  user_name: string;
  created_at: string;
}

interface ProductReviewsProps {
  productId: string;
  reviews: Review[];
  averageRating: number;
  productName?: string;
  selectedColor?: string;
}

export default function ProductReviews({
  productId,
  reviews,
  averageRating,
  productName = "",
  selectedColor = "Default"
}: ProductReviewsProps) {
  const router = useRouter();
  const [reviewFilter, setReviewFilter] = useState("all");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [localReviews, setLocalReviews] = useState<Review[]>(reviews);

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
          product_id: parseInt(productId),
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
      const productData = await getProductById(productId);
      if (productData.reviews) {
        setLocalReviews(productData.reviews);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Có lỗi xảy ra khi gửi đánh giá');
    }
  };

  // Lọc đánh giá
  const filteredReviews = localReviews.filter(review => {
    if (reviewFilter === "all") return true;
    if (reviewFilter === "5") return review.rating === 5;
    if (reviewFilter === "4") return review.rating === 4;
    if (reviewFilter === "3") return review.rating === 3;
    if (reviewFilter === "2") return review.rating === 2;
    if (reviewFilter === "1") return review.rating === 1;
    if (reviewFilter === "with-comment") return review.comment && review.comment.trim() !== "";
    return true;
  });

  return (
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
              {rating} Sao ({localReviews.filter(r => r.rating === rating).length})
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
            Có Bình Luận ({localReviews.filter(r => r.comment?.trim() !== "").length})
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
                    Phân loại hàng: {selectedColor}
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
  );
}