'use client'

import { useEffect, useState } from 'react'

type Product = {
  id: number
  name: string
  price: number
  image: string | null
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/products/')
      .then(res => res.json())
      .then(data => {
        console.log("=== HASIL DARI API PRODUCTS ===", data);
        setProducts(data); // ✅ langsung set array jika Django sudah kirim list
      });
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Produk Tersedia</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow hover:shadow-lg">
            {product.image && (
              <img
                src={`http://localhost:8000${product.image}`}
                alt={product.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
            )}
            <h2 className="font-semibold">{product.name}</h2>
            <p className="text-sm text-gray-600">Rp {product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
