import { Suspense } from "react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div className="text-center mt-10">Đang tải...</div>}>
      {children}
    </Suspense>
  );
}
