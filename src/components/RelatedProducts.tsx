"use client";

import Link from "next/link";

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  images: string[];
  status: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">SẢN PHẨM LIÊN QUAN</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border rounded-lg p-4 hover:shadow-lg transition">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={product.images?.[0] || "/placeholder.png"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-red-500 font-semibold">
                {product.price.toLocaleString()}₫
              </p>
              {product.status === 0 && (
                <p className="text-xs text-red-600 mt-1">Hết hàng</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}