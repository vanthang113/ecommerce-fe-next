"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth } from "@/lib/auth";
import { API_URL } from "@/lib/api";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Đăng ký thất bại");
        setLoading(false);
        return;
      }

      setAuth(data.token, data.user);
      window.dispatchEvent(new Event("authChange"));

      alert("🎉 Đăng ký thành công! Chào mừng bạn 🎉");

      router.push("/");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-r from-[#f53d2d] to-[#ff6b6b]">
      {/* Banner trái */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8">
        <div className="max-w-lg">
          <img
            src="/banner/final-sale-banner.png"
            alt="Banner đăng ký"
            className="w-full h-auto object-contain rounded-xl shadow-2xl"
          />
          <div className="mt-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Tham gia cùng chúng tôi!</h2>
            <p className="text-lg opacity-90">
              Tạo tài khoản để mua sắm nhanh hơn và theo dõi đơn hàng dễ dàng
            </p>
          </div>
        </div>
      </div>

      {/* Form đăng ký */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#f53d2d] mb-2">
              Đăng ký
            </h1>
            <p className="text-gray-600">
              Tạo tài khoản mới trong vài giây
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="text-red-500">⚠️</span>
                <p className="text-red-600 font-medium">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <input
                type="text"
                placeholder="Nhập họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f53d2d]"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f53d2d]"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f53d2d]"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#f53d2d] to-[#ff6b6b] hover:from-[#e73626] hover:to-[#ff5252] shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Đang xử lý...
                </span>
              ) : (
                "Đăng ký"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{" "}
              <a
                href="/auth/login"
                className="text-[#f53d2d] font-semibold hover:underline"
              >
                Đăng nhập
              </a>
            </p>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Bằng việc đăng ký, bạn đồng ý với{" "}
              <a href="/terms" className="text-[#f53d2d] hover:underline">
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="/privacy" className="text-[#f53d2d] hover:underline">
                Chính sách bảo mật
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
