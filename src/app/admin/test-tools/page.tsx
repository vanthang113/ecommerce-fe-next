"use client";

import APIDebug from "@/components/APIDebug";
import TokenDebug from "@/components/TokenDebug";
import TokenRefresh from "@/components/TokenRefresh";
import ProductDebug from "@/components/ProductDebug";

export default function AdminTestToolsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🧪 Admin Test Tools</h1>
      <APIDebug />
      <TokenDebug />
      <TokenRefresh />
      <ProductDebug />
    </div>
  );
}


