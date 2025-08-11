'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  productId: number;
  quantity?: number;     // optional, default 1
  className?: string;    // optional, biar gampang styling dari luar
};

export default function AddToCartButton({ productId, quantity = 1, className }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    const token = localStorage.getItem('access'); // pastikan login simpan di key 'access'
    if (!token) {
      router.push('/login?next=' + encodeURIComponent(`/products/${productId}`));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/cart/items/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: productId, quantity }),
          cache: 'no-store',
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail || data?.error || `Add cart failed: ${res.status}`);
      }

      // Sukses → direct ke cart
      router.push('/cart');
    } catch (e: any) {
      alert(e?.message || 'Gagal menambahkan ke keranjang');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className={className ?? 'px-4 py-2 rounded bg-green-600 text-white disabled:opacity-60'}
      aria-busy={loading}
    >
      {loading ? 'Menambahkan...' : '+ Keranjang'}
    </button>
  );
}
