'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'

interface Product {
  id: number
  name: string
  price: number
  images: { image: string }[]
}

interface OrderItem {
  id: number
  quantity: number
  product: Product
}

interface Order {
  id: number
  items: OrderItem[]
}

export default function CartPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('token')
      if (!token) return

      try {
        const res = await axios.get('http://localhost:8000/api/orders/cart/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setOrder(res.data)
      } catch (error) {
        console.error('Gagal ambil cart:', error)
      }
    }

    fetchCart()
  }, [])

  const totalPrice =
    order?.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0

  if (!order || order.items.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Keranjang Saya</h1>
        <p className="text-gray-600">Keranjang kosong</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Keranjang Saya</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-4">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center border p-4 rounded-lg shadow-sm"
            >
              <img
                src={item.product.images?.[0]?.image}
                alt={item.product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="ml-4 flex-1">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-green-600 font-medium">
                  Rp {Number(item.product.price).toLocaleString('id-ID')}
                </p>
                <p className="text-sm text-gray-600">Jumlah: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="col-span-1 border p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Ringkasan Belanja</h2>
          <p className="text-gray-700 mb-2">
            Total:{' '}
            <strong>Rp {Number(totalPrice).toLocaleString('id-ID')}</strong>
          </p>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
            onClick={() => router.push('/checkout')}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
