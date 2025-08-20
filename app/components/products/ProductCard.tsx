'use client';

import { useState } from "react";
import Image from "next/image";
import { Product } from "@/app/lib/types/product";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps){
    const [imageError, setImageError] = useState(false);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-ES', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Imagen del producto */}
      <div className="relative h-64 w-full bg-gray-100">
        {product.product_image && !imageError ? (
          <Image
            src={product.product_image}
            alt={product.name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg
              className="w-16 h-16 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_featured && (
            <span className="inline-block px-2 py-1 text-xs font-bold bg-yellow-400 text-yellow-900 rounded-full">
              Destacado
            </span>
          )}
          {!product.is_active && (
            <span className="inline-block px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full">
              Inactivo
            </span>
          )}
        </div>

        {/* Stock badge */}
        <div className="absolute top-2 right-2">
          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
            product.online_stock > 0 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            Stock: {product.online_stock}
          </span>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-2xl font-bold text-blue-600 mb-2">
          {formatPrice(product.price)}
        </p>

        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Detalles del producto */}
        <div className="space-y-1 mb-3">
          <p className="text-xs text-gray-500">
            <span className="font-medium">SKU:</span> {product.sku}
          </p>
          <p className="text-xs text-gray-500">
            <span className="font-medium">Tipo:</span> {product.product_type}
          </p>
          <p className="text-xs text-gray-500">
            <span className="font-medium">Lanzamiento:</span> {formatDate(product.release_date)}
          </p>
        </div>

        {/* Categorías */}
        {product.categories.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1">
            {product.categories.map(category => (
              <span
                key={category.category_id}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}

        {/* Supplier info */}
        {product.supplier && (
          <div className="mb-3">
            <p className="text-xs text-gray-500">
              <span className="font-medium">Proveedor:</span> {product.supplier.name}
            </p>
          </div>
        )}

        {/* Botón de acción para productos disponibles */}
        {product.is_active && product.online_stock > 0 ? (
          <button className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors">
            Ver Producto
          </button>
        ) : (
          <div className="text-center py-2">
            <span className="text-sm text-gray-500">
              {!product.is_active ? 'Producto no disponible' : 'Sin stock'}
            </span>
          </div>
        )}
      </div>
    </div>
    );
}