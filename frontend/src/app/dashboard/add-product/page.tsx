'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
}

export default function AddProductPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetch('http://localhost:8000/api/products/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => {
        console.error('Gagal memuat kategori:', err)
        alert('Gagal memuat kategori')
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('access_token')
    if (!token) {
      alert('Silakan login terlebih dahulu')
      return
    }

    try {
      // 1. Kirim data produk
      const res = await fetch('http://localhost:8000/api/products/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          price,
          description,
          country_origin: country,
          category_id: categoryId,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        alert('Gagal tambah produk: ' + JSON.stringify(err))
        return
      }

      const product = await res.json()
      const productId = product.id

      // 2. Upload gambar jika ada
      if (image) {
        const imageForm = new FormData()
        imageForm.append('product', productId)
        imageForm.append('image', image)

        const imgRes = await fetch('http://localhost:8000/api/products/upload-image/', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: imageForm,
        })

        if (!imgRes.ok) {
          const imgErr = await imgRes.json()
          alert('Gagal upload gambar: ' + JSON.stringify(imgErr))
          return
        }
      }

      alert('Produk berhasil ditambahkan!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Gagal mengirim produk:', err)
      alert('Terjadi kesalahan')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Tambah Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Produk</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Harga</label>
          <input
            type="number"
            className="w-full border p-2 rounded"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Asal Negara</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select
            className="w-full border p-2 rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Gambar Produk</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            accept="image/*"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
        >
          Simpan Produk
        </button>
      </form>
    </div>
  )
}
