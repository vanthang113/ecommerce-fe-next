"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function TokenRefresh() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const refreshAdminToken = async () => {
    setLoading(true);
    setStatus("Đang refresh token...");
    
    try {
      // Lấy thông tin admin hiện tại
      const adminUser = localStorage.getItem("adminUser");
      if (!adminUser) {
        throw new Error("Không tìm thấy thông tin admin");
      }

      const user = JSON.parse(adminUser);
      
      // Gọi API để lấy token mới (cần password)
      const password = prompt("Nhập mật khẩu admin để refresh token:");
      if (!password) {
        setStatus("Hủy refresh token");
        return;
      }

      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, password }),
      });

      if (!res.ok) {
        const errorData = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorData}`);
      }

      const data = await res.json();
      
      if (data.token && data.user) {
        // Lưu token mới
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        
        setStatus(`✅ Token đã được refresh! Role: ${data.user.role}`);
      } else {
        throw new Error("Không nhận được token từ server");
      }
    } catch (error: any) {
      setStatus(`❌ Lỗi refresh token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testToken = async () => {
    setLoading(true);
    setStatus("Đang test token...");
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        throw new Error("Không có admin token");
      }

      const res = await fetch(`${API_URL}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (res.ok) {
        setStatus("✅ Token hợp lệ!");
      } else {
        const errorData = await res.text();
        setStatus(`❌ Token không hợp lệ: HTTP ${res.status} - ${errorData}`);
      }
    } catch (error: any) {
      setStatus(`❌ Lỗi test token: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-blue-50">
      <h3 className="font-bold mb-2">🔄 Token Refresh Tool</h3>
      
      <div className="space-x-2 mb-3">
        <button 
          onClick={testToken} 
          disabled={loading}
          className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Token"}
        </button>
        <button 
          onClick={refreshAdminToken} 
          disabled={loading}
          className="bg-green-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Token"}
        </button>
      </div>

      {status && (
        <div className="p-2 bg-white border rounded text-sm">
          {status}
        </div>
      )}
    </div>
  );
}
