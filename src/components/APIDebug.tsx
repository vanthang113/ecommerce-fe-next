"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function APIDebug() {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    setStatus("Đang kiểm tra...");
    
    try {
      // Test categories endpoint
      const res = await fetch(`${API_URL}/categories`);
      const data = await res.text();
      
      if (res.ok) {
        setStatus(`✅ API hoạt động tốt! Status: ${res.status}, Data length: ${data.length}`);
      } else {
        setStatus(`❌ API lỗi! Status: ${res.status}, Response: ${data.substring(0, 200)}...`);
      }
    } catch (error: any) {
      setStatus(`❌ Lỗi kết nối: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-gray-50">
      <h3 className="font-bold mb-2">🔧 API Debug Tool</h3>
      <p className="text-sm text-gray-600 mb-2">API URL: {API_URL}</p>
      <button 
        onClick={testAPI} 
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Đang test..." : "Test API Connection"}
      </button>
      {status && (
        <div className="mt-2 p-2 bg-white border rounded text-sm">
          {status}
        </div>
      )}
    </div>
  );
}
