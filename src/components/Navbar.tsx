"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logoutUser } from "@/lib/auth";
import useAuth from "@/hooks/useAuth";
import useCart from "@/hooks/useCart";
import {
  FaBell,
  FaQuestionCircle,
  FaGlobe,
  FaInstagram,
  FaFacebook,
  FaSearch,
} from "react-icons/fa";

export default function Navbar() {
  const { user } = useAuth();
  const { getTotalItems } = useCart();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [language, setLanguage] = useState<"vi" | "en">("vi");

  const handleLogout = () => {
    logoutUser();
    window.dispatchEvent(new Event("authChange"));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(
        `/products?search=${encodeURIComponent(searchQuery.trim())}`
      );
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === "vi" ? "en" : "vi");
  };

  const text = {
    vi: {
      seller: "Kênh Người Bán",
      download: "Tải ứng dụng",
      connect: "Kết nối",
      notify: "Thông Báo",
      support: "Hỗ Trợ",
      search: "Tìm kiếm sản phẩm...",
      login: "Đăng nhập",
      profile: "Hồ sơ",
      orders: "Đơn Mua",
      logout: "Đăng xuất",
      cart: "Giỏ hàng",
      lang: "Tiếng Việt",
    },
    en: {
      seller: "Seller Channel",
      download: "Download App",
      connect: "Connect",
      notify: "Notifications",
      support: "Support",
      search: "Search products...",
      login: "Login",
      profile: "Profile",
      orders: "My Orders",
      logout: "Logout",
      cart: "Cart",
      lang: "English",
    },
  }[language];

  return (
    <header className="w-full">
      {/* Top bar */}
      <div className="bg-orange-500 text-white text-sm">
        <div className="container mx-auto flex justify-between items-center py-1 px-4">
          {/* Left */}
          <div className="flex space-x-4 items-center">
            <Link href="#" className="hover:underline">
              {text.seller}
            </Link>
            <Link href="#" className="hover:underline">
              {text.download}
            </Link>

            <div className="flex items-center gap-2">
              <span>{text.connect}</span>
              <a
                href="https://www.facebook.com/nguyen.van.thang.688594"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/vwn.thng/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-200"
              >
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center space-x-4">
            <Link href="#" className="flex items-center gap-1 hover:text-gray-200">
              <FaBell /> {text.notify}
            </Link>
            <Link href="#" className="flex items-center gap-1 hover:text-gray-200">
              <FaQuestionCircle /> {text.support}
            </Link>

            {/* Language switch */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 hover:text-gray-200"
            >
              <FaGlobe /> {text.lang} ▼
            </button>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="bg-orange-500 text-white shadow-md">
        <div className="container mx-auto flex justify-between items-center py-3 px-4">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold">
            MyShop
          </Link>

          {/* Search */}
          <div className="flex-1 mx-6">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder={text.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg text-black bg-white focus:outline-none focus:ring-2 focus:ring-orange-300"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-500"
              >
                <FaSearch />
              </button>
            </form>
          </div>

          {/* User */}
          {user ? (
            <div className="flex items-center space-x-4 relative group">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-500 font-bold cursor-pointer">
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div className="absolute right-0 mt-12 w-40 bg-white text-black rounded-lg shadow-lg hidden group-hover:block">
                <Link
                  href="/account"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {text.profile}
                </Link>
                <Link
                  href="/account/orders"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  {text.orders}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  {text.logout}
                </button>
              </div>
            </div>
          ) : (
            <Link href="/auth/login" className="hover:underline">
              {text.login}
            </Link>
          )}

          {/* Cart */}
          <Link href="/cart" className="relative ml-4">
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
