"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { API_URL } from "@/lib/api";
import { FaChartLine, FaShoppingCart, FaDollarSign, FaArrowUp, FaArrowDown } from "react-icons/fa";

type StatsRow = { label: string; order_count: number; total_amount: number };

export default function OrdersChart() {
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  const [data, setData] = useState<StatsRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async (r: "day" | "week" | "month") => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`${API_URL}/orders/stats?range=${r}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const rows = await res.json();
      setData(Array.isArray(rows) ? rows : []);
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Lỗi tải thống kê";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats(range);
  }, [range, fetchStats]);

  // Removed unused maxValue calculation

  const totalOrders = useMemo(() => {
    return data.reduce((s, r) => s + (Number(r.order_count) || 0), 0);
  }, [data]);

  const totalRevenue = useMemo(() => {
    return data.reduce((s, r) => s + (Number(r.total_amount) || 0), 0);
  }, [data]);

  const averageOrderValue = useMemo(() => {
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  }, [totalOrders, totalRevenue]);

  const growthRate = useMemo(() => {
    if (data.length < 2) return 0;
    const recent = data[data.length - 1]?.order_count || 0;
    const previous = data[data.length - 2]?.order_count || 0;
    return previous > 0 ? ((recent - previous) / previous) * 100 : 0;
  }, [data]);

  // Generate line chart data points
  const lineChartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    const max = Math.max(...data.map(d => d.order_count || 0));
    const min = Math.min(...data.map(d => d.order_count || 0));
    const range = max - min || 1;
    
    return data.map((d, index) => ({
      x: (index / Math.max(data.length - 1, 1)) * 100,
      y: ((d.order_count - min) / range) * 100,
      value: d.order_count || 0,
      label: d.label || ''
    }));
  }, [data]);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Orders Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-3xl font-bold text-gray-900">{totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {growthRate >= 0 ? (
                  <FaArrowUp className="text-green-500 text-sm mr-1" />
                ) : (
                  <FaArrowDown className="text-red-500 text-sm mr-1" />
                )}
                <span className={`text-sm font-medium ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(growthRate).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">so với kỳ trước</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaShoppingCart className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Total Revenue Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng doanh thu</p>
              <p className="text-3xl font-bold text-gray-900">{totalRevenue.toLocaleString()}đ</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-sm font-medium text-green-600">+12.5%</span>
                <span className="text-sm text-gray-500 ml-1">tăng trưởng</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaDollarSign className="text-green-600 text-xl" />
            </div>
          </div>
        </div>

        {/* Average Order Value Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Giá trị đơn hàng TB</p>
              <p className="text-3xl font-bold text-gray-900">{Math.round(averageOrderValue).toLocaleString()}đ</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-orange-500 text-sm mr-1" />
                <span className="text-sm font-medium text-orange-600">+7.3%</span>
                <span className="text-sm text-gray-500 ml-1">tăng trưởng</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-orange-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <FaChartLine className="text-green-600 text-lg" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Thống kê đơn hàng</h3>
                <p className="text-sm text-gray-600">Biểu đồ đơn hàng theo thời gian</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  range === "day" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setRange("day")}
              >
                Theo ngày
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  range === "week" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setRange("week")}
              >
                Theo tuần
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  range === "month" 
                    ? "bg-red-600 text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setRange("month")}
              >
                Theo tháng
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-600">{error}</div>
            </div>
          )}

          {!loading && !error && (
            <div className="w-full">
              {/* Line Chart with Area */}
              <div className="h-80 relative">
                {data.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Không có dữ liệu
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    {/* Chart Area */}
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      {/* Area under the line */}
                      <defs>
                        <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#10B981" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#10B981" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      
                      {/* Area path */}
                      <path
                        d={`M 0,100 ${lineChartData.map(point => `L ${point.x},${100 - point.y}`).join(' ')} L 100,100 Z`}
                        fill="url(#areaGradient)"
                      />
                      
                      {/* Line path */}
                      <path
                        d={`M ${lineChartData.map(point => `${point.x},${100 - point.y}`).join(' L ')}`}
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      
                      {/* Data points */}
                      {lineChartData.map((point, index) => (
                        <circle
                          key={index}
                          cx={point.x}
                          cy={100 - point.y}
                          r="1"
                          fill="#10B981"
                        />
                      ))}
                    </svg>
                    
                    {/* Chart navigation arrows */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        <span className="text-sm">‹</span>
                      </button>
                      <button className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:bg-gray-50">
                        <span className="text-sm">›</span>
                      </button>
                    </div>
                    
                    {/* Pagination dots */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chart Legend */}
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Đơn hàng</span>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {range === "day" ? "Theo ngày" : range === "week" ? "Theo tuần" : "Theo tháng"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


