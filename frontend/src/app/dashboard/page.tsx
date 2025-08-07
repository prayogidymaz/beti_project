'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Product = {
  id: number
  name: string
  price: number
  images: {
    image: string
  }[]
}

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('http://localhost:8000/api/products/products/')
      .then(res => res.json())
      .then(data => {
        console.log("=== HASIL DARI API PRODUCTS ===", data);
        setProducts(data)
      })
      .catch(err => console.error('Fetch error:', err))
  }, [])

  const handleProductClick = (id: number) => {
    router.push(`/dashboard/product/${id}`)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Produk Tersedia</h1>

      {/* Tombol Tambah Produk */}
      <div className="flex justify-end mb-6">
        <a
          href="/dashboard/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          + Tambah Produk
        </a>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="cursor-pointer bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-300"
          >
            {product.images.length > 0 && (
              <img
                src={product.images[0].image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-xl"
              />
            )}
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h2>
              <p className="text-green-600 font-medium mt-1">
                Rp {Number(product.price).toLocaleString('id-ID')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
