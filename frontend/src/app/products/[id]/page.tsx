'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ProductDetailPage({ product }) {
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()

  const handleAddToCart = async () => {
  const token = localStorage.getItem('token')  // atau ambil dari cookies

  const res = await fetch('http://localhost:8000/api/orders/add-to-cart/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      product_id: product.id,
      quantity: quantity
    })
  })

  if (res.ok) {
    router.push('/cart')
  } else {
    const data = await res.json()
    alert(data.error || 'Gagal menambahkan ke keranjang.')
  }
}

  return (
    <div>
      {/* 👇 UI Detail produk, misal gambar dan info lain */}
      <h1>{product.name}</h1>
      <p>Harga: Rp {product.price}</p>

      <div>
        <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
        <span className="mx-2">{quantity}</span>
        <button onClick={() => setQuantity(q => q + 1)}>+</button>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-green-600 text-white px-4 py-2 rounded mt-4"
      >
        + Keranjang
      </button>
    </div>
  )
}
