// lib/api.ts
export async function postCartItem(token: string, productId: number, quantity = 1) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/cart/items/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ product_id: productId, quantity }),
    cache: 'no-store',
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  if (!res.ok) throw new Error(`Add cart failed: ${res.status}`);
  return res.json(); // cart terbaru
}

export async function getCart(token: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/cart/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (res.status === 401) throw new Error('UNAUTHORIZED');
  return res.json();
}
