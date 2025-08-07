"use client"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface Item {
  product_id?: number
  jastip_id?: number
  quantity: number
}

interface CheckoutProps {
  orderType: "product" | "jastip"
  items: Item[]
}

const CheckoutButton = ({ orderType, items }: CheckoutProps) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("access")

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/`,
        {
          order_type: orderType,
          items: items
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      router.push("/order-success")
    } catch (err) {
      console.error(err)
      alert("Checkout gagal!")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      {loading ? "Memproses..." : "Checkout Sekarang"}
    </button>
  )
}

export default CheckoutButton
