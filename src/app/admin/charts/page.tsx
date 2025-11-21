"use client";

import OrdersChart from "@/components/OrdersChart";

export default function AdminChartsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Biểu đồ đơn hàng</h1>
      <OrdersChart />
    </div>
  );
}


