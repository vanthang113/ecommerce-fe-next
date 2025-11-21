"use client";

import { useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FaHome, FaTags, FaBoxOpen, FaShoppingCart, FaUsers, FaStar, FaChartBar, FaTools,} from "react-icons/fa";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const data = localStorage.getItem("adminUser");
      setAdminUser(data ? JSON.parse(data) : null);
    } catch {
      setAdminUser(null);
    }
    const onChange = () => {
      try {
        const data = localStorage.getItem("adminUser");
        setAdminUser(data ? JSON.parse(data) : null);
      } catch {
        setAdminUser(null);
      }
    };
    window.addEventListener("adminAuthChange", onChange);
    setInitialized(true);
    return () => window.removeEventListener("adminAuthChange", onChange);
  }, []);

  const effectiveUser = user || adminUser;

  useEffect(() => {
    if (pathname === "/admin/login") return;

    if (initialized && (!effectiveUser || effectiveUser?.role !== "admin")) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname || "/admin");
      }
      router.replace("/admin/login");
    }
  }, [initialized, effectiveUser, router, pathname]);

  if (pathname === "/admin/login") return <>{children}</>;
  if (!initialized) return null;
  if (!effectiveUser || effectiveUser?.role !== "admin") return null;

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, href: "/admin/dashboard" },
    { label: "Categories", icon: <FaTags />, href: "/admin/categories" },
    { label: "Products", icon: <FaBoxOpen />, href: "/admin/products" },
    { label: "Orders", icon: <FaShoppingCart />, href: "/admin/orders" },
    { label: "Users", icon: <FaUsers />, href: "/admin/users" },
    { label: "Reviews", icon: <FaStar />, href: "/admin/reviews" },
    { label: "Charts", icon: <FaChartBar />, href: "/admin/charts" },
    { label: "Test Tools", icon: <FaTools />, href: "/admin/test-tools" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-200 p-6 flex flex-col shadow-xl">
        <h2 className="text-2xl font-bold mb-10 text-center tracking-wide">
          Admin <span className="text-blue-400">Panel</span>
        </h2>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200
                ${isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800 hover:text-white text-gray-300"}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="text-xs text-gray-500 pt-6 border-t border-gray-700 text-center">
          © 2025 Admin System
        </div>
      </aside>

      {/* Nội dung chính */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
