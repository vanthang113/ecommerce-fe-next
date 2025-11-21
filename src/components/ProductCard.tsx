"use client";

import Link from "next/link";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    images?: string[] | string | null;
    salePercent?: number;
    isNew?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);

  const getImageUrl = () => {
    if (!product.images || imageError) return null;
    if (Array.isArray(product.images)) return product.images[0] || null;
    if (typeof product.images === "string") return product.images || null;
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="group border rounded-xl p-4 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer">
      <Link href={`/products/${product.id}`}>
        <div>
          <div className="relative w-full h-52 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
            {product.salePercent && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                -{product.salePercent}%
              </span>
            )}

            {product.isNew && (
              <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                NEW
              </span>
            )}

            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-gray-400 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-2 opacity-60"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm">Không có ảnh</p>
              </div>
            )}
          </div>

          <h2 className="mt-3 font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
            {product.name}
          </h2>

          <p className="text-lg font-bold text-red-500 mt-1">
            {product.price.toLocaleString()} ₫
          </p>

          {product.salePercent && (
            <p className="text-sm line-through text-gray-400">
              {(product.price / (1 - product.salePercent / 100)).toLocaleString()} ₫
            </p>
          )}
        </div>
      </Link>
    </div>
  );
}
