"use client";

interface ProductActionsProps {
  product: any;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  isOutOfStock: boolean;
  maxQuantity: number;
  userToken: string | null;
  addingToCart: boolean;
  redirectingToLogin: boolean;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onAddToCartAndLogin: () => void;
}

export default function ProductActions({
  product,
  quantity,
  setQuantity,
  selectedColor,
  setSelectedColor,
  isOutOfStock,
  maxQuantity,
  userToken,
  addingToCart,
  redirectingToLogin,
  onAddToCart,
  onBuyNow,
  onAddToCartAndLogin
}: ProductActionsProps) {
  return (
    <>
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
            disabled={isOutOfStock}
            className={`w-8 h-8 border rounded flex items-center justify-center ${
              isOutOfStock
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
            disabled={isOutOfStock}
            min="1"
            max={maxQuantity}
            className="w-16 h-8 border rounded text-center disabled:bg-gray-100"
          />
          <button
            onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
            disabled={isOutOfStock}
            className={`w-8 h-8 border rounded flex items-center justify-center ${
              isOutOfStock
                ? "bg-gray-100 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            +
          </button>
        </div>
        {!isOutOfStock && maxQuantity < 999 && (
          <p className="text-xs text-gray-500 mt-1">
            Số lượng tối đa: {maxQuantity}
          </p>
        )}
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-4 mt-4">
        <button
          disabled={isOutOfStock || addingToCart || redirectingToLogin}
          onClick={userToken ? onAddToCart : onAddToCartAndLogin}
          className={`flex-1 border-2 py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${
            isOutOfStock || addingToCart || redirectingToLogin
              ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-red-500 text-red-500 hover:bg-red-50 active:bg-red-100"
          }`}
        >
          {addingToCart
            ? "Đang xử lý..."
            : redirectingToLogin
            ? "Đang chuyển đến đăng nhập..."
            : isOutOfStock
            ? "Hết hàng"
            : "🛒 Thêm Vào Giỏ Hàng"}
        </button>
        
        <button
          disabled={isOutOfStock || redirectingToLogin}
          onClick={onBuyNow}
          className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
            isOutOfStock || redirectingToLogin
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white"
          }`}
        >
          {redirectingToLogin
            ? "Đang xử lý..."
            : isOutOfStock
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
    </>
  );
}