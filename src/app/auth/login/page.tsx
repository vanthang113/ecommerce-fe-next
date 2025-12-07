// login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";
import { syncCartToServer } from "@/lib/cart";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasCartItems, setHasCartItems] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const returnUrl = searchParams.get("returnUrl") || "/";
  const addedToCart = searchParams.get("addedToCart") === "true";
  const productId = searchParams.get("productId");
  const productName = searchParams.get("productName");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cartStr = localStorage.getItem('cart_items');
      if (cartStr) {
        const cart = JSON.parse(cartStr);
        if (cart.length > 0) {
          setHasCartItems(true);
          setCartCount(cart.length);
        }
      }
    }
  }, [addedToCart, productName]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng nhập thất bại");
        setLoading(false);
        return;
      }

      if (data?.user?.role === "admin") {
        setError("Vui lòng đăng nhập admin tại /admin/login");
        setLoading(false);
        return;
      }

      setAuth(data.token, data.user);
      
      let syncedCount = 0;
      if (hasCartItems) {
        const syncResult = await syncCartToServer(data.token);
        syncedCount = syncResult.syncedItems;
        
        if (syncResult.success && syncedCount > 0) {
          window.dispatchEvent(new Event("cartSynced"));
        }
      }
      
      window.dispatchEvent(new Event("authChange"));
      
      let successMessage = "✅ Đăng nhập thành công!";
      if (syncedCount > 0) {
        successMessage += ` Đã đồng bộ ${syncedCount} sản phẩm từ giỏ hàng tạm thời.`;
      } else if (addedToCart && productName) {
        successMessage += ` Sản phẩm "${productName}" đã được thêm vào giỏ hàng.`;
      }
      
      alert(successMessage);
      
      setTimeout(() => {
        router.push(returnUrl);
        router.refresh();
      }, 1000);
      
    } catch (err) {
      console.error("Lỗi đăng nhập:", err);
      setError("Lỗi kết nối server");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#f53d2d] to-[#ff6b6b]">
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <div className="max-w-lg">
          <img
            src="/banner/final-sale-banner.png"
            alt="Banner giảm giá"
            className="w-full h-auto object-contain rounded-xl shadow-2xl"
          />
          <div className="mt-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Chào mừng trở lại!</h2>
            <p className="text-lg opacity-90">
              Đăng nhập để tiếp tục mua sắm và quản lý đơn hàng của bạn
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#f53d2d] mb-2">
              Đăng nhập
            </h1>
            <p className="text-gray-600">
              Nhập thông tin tài khoản của bạn
            </p>
          </div>
          
          {hasCartItems && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <span className="text-blue-600 text-lg">🛒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-blue-800 mb-1">
                    Có {cartCount} sản phẩm trong giỏ hàng tạm thời
                  </h3>
                  <p className="text-sm text-blue-600">
                    Đăng nhập để lưu giỏ hàng và tiếp tục mua sắm!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {addedToCart && productName && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-sm">
              <div className="flex items-start gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <span className="text-green-600 text-lg">✅</span>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800 mb-1">
                    Sản phẩm đã được thêm vào giỏ hàng
                  </h3>
                  <p className="text-sm text-green-600">
                    <span className="font-medium">"{productName}"</span> đã được lưu tạm. 
                    Đăng nhập để hoàn tất đơn hàng!
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email hoặc số điện thoại
              </label>
              <input
                type="text"
                placeholder="Nhập email hoặc số điện thoại"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f53d2d] focus:border-transparent transition"
                required
                disabled={loading}
              />
              <div className="text-right mt-2">
                <a 
                  href="/auth/forgot-password" 
                  className="text-sm text-[#f53d2d] hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#f53d2d] to-[#ff6b6b] hover:from-[#e73626] hover:to-[#ff5252] shadow-lg hover:shadow-xl'
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang xử lý...
                </span>
              ) : "Đăng nhập"}
            </button>
          </form>

          <div className="mt-8">
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Chưa có tài khoản?{" "}
                <a
                  href="/auth/register"
                  className="text-[#f53d2d] font-semibold hover:underline"
                >
                  Đăng ký ngay
                </a>
              </p>
            </div>
            
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 text-sm">Hoặc đăng nhập với</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => alert("Tính năng đăng nhập với Google đang được phát triển")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-5 h-5 bg-[#4285F4] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  G
                </div>
                <span className="text-gray-700 font-medium">Google</span>
              </button>
              
              <button
                onClick={() => alert("Tính năng đăng nhập với Facebook đang được phát triển")}
                className="flex items-center justify-center gap-2 p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="w-5 h-5 bg-[#1877F2] rounded-full flex items-center justify-center text-white font-bold text-xs">
                  f
                </div>
                <span className="text-gray-700 font-medium">Facebook</span>
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Bằng việc đăng nhập, bạn đồng ý với{" "}
                <a href="/terms" className="text-[#f53d2d] hover:underline">
                  Điều khoản sử dụng
                </a>{" "}
                và{" "}
                <a href="/privacy" className="text-[#f53d2d] hover:underline">
                  Chính sách bảo mật
                </a>{" "}
                của chúng tôi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}