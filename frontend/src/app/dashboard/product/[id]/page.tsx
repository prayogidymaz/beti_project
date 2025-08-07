'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/products/${id}/`)
      .then(res => res.json())
      .then(data => setProduct(data))
      .catch(err => console.error('Gagal ambil detail produk:', err))
  }, [id])

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(0, prev + delta))
  }

const handleAddToCart = async () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    alert('Silakan login terlebih dahulu')
    return
  }

  try {
    const res = await fetch('http://localhost:8000/api/orders/add-to-cart/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: quantity
      }),
    })

    if (res.ok) {
      alert('Produk berhasil ditambahkan ke keranjang!')
    } else {
      const contentType = res.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json()
        alert('Gagal tambah ke keranjang: ' + JSON.stringify(errorData))
      } else {
        const text = await res.text()
        alert('Gagal tambah ke keranjang: ' + text)
      }
    }
  } catch (err) {
    console.error('Error tambah ke keranjang:', err)
    alert('Terjadi kesalahan saat menambahkan ke keranjang.')
  }
}

  if (!product) {
    return <div className="p-6">Memuat detail produk...</div>
  }

  return (
    <div className="p-6 flex flex-col lg:flex-row gap-6">
      {/* Kiri - Detail Produk */}
      <div className="lg:w-3/4 bg-white rounded-xl shadow p-6">
        {product.images?.[0]?.image && (
          <img
            src={product.images[0].image}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
        )}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4">Asal: {product.country_origin}</p>
        <p className="text-gray-700 whitespace-pre-line">{product.description}</p>
      </div>

      {/* Kanan - Harga & Keranjang */}
      <div className="lg:w-1/4 bg-white rounded-xl shadow p-6 h-fit">
        <p className="text-xl font-semibold text-green-600 mb-4">
          Rp {Number(product.price).toLocaleString('id-ID')}
        </p>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            className="bg-gray-200 px-3 py-1 rounded text-lg"
          >-
          </button>
          <span className="text-lg font-medium">{quantity}</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="bg-gray-200 px-3 py-1 rounded text-lg"
          >+
          </button>
        </div>

        <p className="mb-4">Subtotal: Rp {(product.price * quantity).toLocaleString('id-ID')}</p>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-2 rounded"
        >+ Keranjang</button>
      </div>
    </div>
  )
}
