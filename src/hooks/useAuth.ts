"use client";

import { useEffect, useState } from "react";
import { getUser, getAdminUser } from "@/lib/auth";

export default function useAuth() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load admin user ưu tiên khi trong khu vực admin
    const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
    setUser(isAdminPath ? getAdminUser() : getUser());

    // Lắng nghe sự kiện login/logout
    const handleAuthChange = () => {
      const onAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
      setUser(onAdminPath ? getAdminUser() : getUser());
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("adminAuthChange", handleAuthChange);

    // Xác thực token mỗi khi app mount hoặc server restart (401 => auto logout)
    const validateToken = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.dispatchEvent(new Event("authChange"));
        }
      } catch {
        // network error -> treat as invalid
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new Event("authChange"));
      }
    };

    validateToken();

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("adminAuthChange", handleAuthChange);
    };
  }, []);

  return { user, setUser };
}
