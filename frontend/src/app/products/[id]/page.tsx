'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  name: string;
  price: string | number;
  images?: { image: string }[];
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const productId = Number(params.id);
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);

  // Ambil detail produk dari backend
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}/`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`Fetch product failed: ${res.status}`);
        const data = await res.json();
        setProduct(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [productId]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem('access'); // token JWT yang kamu simpan saat login
    if (!token) {
      router.push('/login?next=' + encodeURIComponent(`/products/${productId}`));
      return;
    }

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

    if (res.ok) {
      router.push('/cart'); // direct ke halaman cart
    } else {
      const data = await res.json().catch(() => null);
      alert(data?.detail || data?.error || 'Gagal menambahkan ke keranjang.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Produk tidak ditemukan.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{product.name}</h1>
      <p>Harga: Rp {product.price}</p>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          className="px-3 py-1 border rounded"
        >
          -
        </button>
        <span>{quantity}</span>
        <button
          onClick={() => setQuantity((q) => q + 1)}
          className="px-3 py-1 border rounded"
        >
          +
        </button>
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        + Keranjang
      </button>
    </div>
  );
}
