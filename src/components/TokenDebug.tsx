"use client";

import { useState, useEffect } from "react";

export default function TokenDebug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const checkTokens = () => {
      const adminToken = localStorage.getItem("adminToken");
      const adminUser = localStorage.getItem("adminUser");
      const userToken = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      setTokenInfo({
        adminToken: adminToken ? `${adminToken.substring(0, 20)}...` : "Không có",
        adminUser: adminUser ? JSON.parse(adminUser) : null,
        userToken: userToken ? `${userToken.substring(0, 20)}...` : "Không có",
        user: user ? JSON.parse(user) : null,
      });
    };

    checkTokens();
    
    // Listen for auth changes
    const handleAuthChange = () => checkTokens();
    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("adminAuthChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("adminAuthChange", handleAuthChange);
    };
  }, []);

  const clearAdminAuth = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.dispatchEvent(new Event("adminAuthChange"));
  };

  const clearUserAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <div className="p-4 border rounded bg-yellow-50">
      <h3 className="font-bold mb-2">🔑 Token Debug</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>Admin Token:</strong> {tokenInfo?.adminToken}
        </div>
        <div>
          <strong>Admin User:</strong> {tokenInfo?.adminUser ? `${tokenInfo.adminUser.name} (${tokenInfo.adminUser.role})` : "Không có"}
        </div>
        <div>
          <strong>User Token:</strong> {tokenInfo?.userToken}
        </div>
        <div>
          <strong>User:</strong> {tokenInfo?.user ? `${tokenInfo.user.name} (${tokenInfo.user.role})` : "Không có"}
        </div>
      </div>

      <div className="mt-3 space-x-2">
        <button 
          onClick={clearAdminAuth}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Clear Admin Auth
        </button>
        <button 
          onClick={clearUserAuth}
          className="bg-red-500 text-white px-3 py-1 rounded text-sm"
        >
          Clear User Auth
        </button>
      </div>
    </div>
  );
}
