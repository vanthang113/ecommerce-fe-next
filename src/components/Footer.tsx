"use client";
export default function Footer() {
  const payments = ["visa", "mastercard", "momo", "zalopay", "vnpay"];
  const shippings = ["ghn", "ghtk", "ahamove", "vnpost"];

  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        
        {/* DỊCH VỤ KHÁCH HÀNG */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">DỊCH VỤ KHÁCH HÀNG</h3>
          <ul className="space-y-2">
            <li>Trung Tâm Trợ Giúp MyShop</li>
            <li>MyShop Blog</li>
            <li>MyShop Mall</li>
            <li>Hướng Dẫn Mua Hàng/Đặt Hàng</li>
            <li>Hướng Dẫn Bán Hàng</li>
            <li>Ví MyPay</li>
            <li>MyShop Xu</li>
            <li>Đơn Hàng</li>
            <li>Trả Hàng/Hoàn Tiền</li>
            <li>Liên Hệ MyShop</li>
            <li>Chính Sách Bảo Hành</li>
          </ul>
        </div>

        {/* MYSHOP VIỆT NAM */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">MYSHOP VIỆT NAM</h3>
          <ul className="space-y-2">
            <li>Về MyShop</li>
            <li>Tuyển Dụng</li>
            <li>Điều Khoản MyShop</li>
            <li>Chính Sách Bảo Mật</li>
            <li>MyShop Mall</li>
            <li>Kênh Người Bán</li>
            <li>Flash Sale</li>
            <li>Tiếp Thị Liên Kết</li>
            <li>Liên Hệ Truyền Thông</li>
          </ul>
        </div>

        {/* THANH TOÁN + VẬN CHUYỂN */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">THANH TOÁN</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {payments.map((item) => (
              <img
                key={item}
                src={`/footer/${item}.png`}
                alt={item}
                className="w-[50px] h-[50px] object-contain bg-[#f5f5f5] p-2 rounded hover:scale-110 hover:brightness-110 transition-all"
              />
            ))}
          </div>

          <h3 className="font-semibold mb-3 text-gray-800">ĐƠN VỊ VẬN CHUYỂN</h3>
          <div className="flex flex-wrap gap-2">
            {shippings.map((item) => (
              <img
                key={item}
                src={`/footer/${item}.png`}
                alt={item}
                className="w-[50px] h-[50px] object-contain bg-[#f5f5f5] p-2 rounded hover:scale-110 hover:brightness-110 transition-all"
              />
            ))}
          </div>
        </div>

        {/* THEO DÕI & ỨNG DỤNG */}
        <div>
          <h3 className="font-semibold mb-3 text-gray-800">THEO DÕI MYSHOP</h3>
          <ul className="space-y-2">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>LinkedIn</li>
          </ul>

          <h3 className="font-semibold mt-6 mb-3 text-gray-800">TẢI ỨNG DỤNG MYSHOP</h3>
          <div className="flex flex-col gap-2">
            <div className="bg-white border rounded px-3 py-1">App Store</div>
            <div className="bg-white border rounded px-3 py-1">Google Play</div>
            <div className="bg-white border rounded px-3 py-1">AppGallery</div>
          </div>
        </div>
      </div>

      {/* PHẦN BOTTOM */}
      <div className="border-t mt-6 py-6 text-center text-xs text-gray-500">
        <p>© 2025 MyShop. Quyền của Nguyễn Văn Thắng.</p>
        <p>Quốc gia & Khu vực: Việt Nam</p>

        <div className="flex justify-center gap-8 mt-3">
          <a href="#" className="hover:underline">Chính Sách Bảo Mật</a>
          <a href="#" className="hover:underline">Quy Chế Hoạt Động</a>
          <a href="#" className="hover:underline">Chính Sách Vận Chuyển</a>
          <a href="#" className="hover:underline">Chính Sách Trả Hàng Và Hoàn Tiền</a>
        </div>

        <p className="mt-3">Công ty TNHH MyShop - Mã số thuế: 0862421003</p>
      </div>
    </footer>
  );
}
