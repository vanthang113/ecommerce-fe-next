"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/lib/auth";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import { FaBell, FaQuestionCircle, FaGlobe, FaInstagram, FaFacebook, FaSearch } from "react-icons/fa";

export default function Navbar() {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logoutUser();
    window.dispatchEvent(new Event("authChange"));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full">
      {/* Thanh navbar nhỏ trên cùng */}
      <div className="bg-orange-500 text-white text-sm">
        <div className="container mx-auto flex justify-between items-center py-1 px-4">
          {/* Bên trái */}
          <div className="flex space-x-4">
            <Link href="#" className="hover:underline">Kênh Người Bán</Link>
            <Link href="#" className="hover:underline">Tải ứng dụng</Link>
            <Link href="#" className="hover:underline flex items-center gap-1">
              Kết nối
              <FaFacebook className="text-white" />
              <FaInstagram className="text-white" />
            </Link>
          </div>

          {/* Bên phải */}
          <div className="flex items-center space-x-4">
            <Link href="#" className="flex items-center gap-1 hover:text-gray-200">
              <FaBell />
              Thông Báo
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-200">
              <FaQuestionCircle />
              Hỗ Trợ
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-200">
              <FaGlobe />
              Tiếng Việt ▼
            </Link>
          </div>
        </div>
      </div>

      {/* Navbar chính */}
      <div className="bg-orange-500 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            MyShop
          </Link>

          {/* Thanh tìm kiếm */}
          <div className="flex-1 mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-orange-500"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* Bên phải */}
          {user ? (
            <div className="flex items-center space-x-4 relative group">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 font-bold cursor-pointer">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              {/* Dropdown menu */}
              <div className="absolute right-0 mt-12 w-40 bg-white text-black rounded-lg shadow-lg hidden group-hover:block">
                <Link href="/account" className="block px-4 py-2 hover:bg-gray-100">
                  Hồ sơ
                </Link>
                <Link href="/account/orders" className="block px-4 py-2 hover:bg-gray-100">
                  Đơn Mua
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="hover:underline">
              Đăng nhập
            </Link>
          )}

          {/* Giỏ hàng */}
          <Link href="/cart" className="relative">
            🛒
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs px-1 rounded-full min-w-[20px] h-5 flex items-center justify-center">
              {getTotalItems()}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
