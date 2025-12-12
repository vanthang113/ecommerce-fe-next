"use client";

interface ProductInfoProps {
  product: any;
  averageRating: number;
  reviewsCount: number;
  voucherDiscount: number;
  finalPrice: number;
}

export default function ProductInfo({
  product,
  averageRating,
  reviewsCount,
  voucherDiscount,
  finalPrice
}: ProductInfoProps) {
  const isOutOfStock = () => {
    if (!product) return true;
    if (product.status === 0) return true;
    if (product.quantity !== undefined && product.quantity <= 0) return true;
    if (product.stock !== undefined && product.stock <= 0) return true;
    return false;
  };

  return (
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
        <span className="text-sm text-gray-600">{reviewsCount} Đánh Giá</span>
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
    </div>
  );
}