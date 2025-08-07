'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type Category = {
  id: number
  name: string
}

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [country, setCountry] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null

  // Ambil data produk by ID
  useEffect(() => {
    if (!id || !token) return

    fetch(`http://localhost:8000/api/products/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setName(data.name)
        setPrice(data.price)
        setDescription(data.description)
        setCountry(data.country_origin)
        setCategoryId(data.category_id)
      })
      .catch(err => console.error('Gagal memuat data produk:', err))
  }, [id, token])

  // Ambil kategori
  useEffect(() => {
    fetch('http://localhost:8000/api/products/categories/')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return alert('Harap login terlebih dahulu.')

    try {
      // 1. Update data produk
      const res = await fetch(`http://localhost:8000/api/products/products/${id}/`, {
        method: 'PUT',
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
        alert('Gagal update produk: ' + JSON.stringify(err))
        return
      }

      // 2. Jika gambar dipilih, upload gambar baru
      if (image) {
        const formData = new FormData()
        formData.append('product', id.toString())
        formData.append('image', image)

        const imgRes = await fetch(`http://localhost:8000/api/products/upload-image/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        if (!imgRes.ok) {
          const imgErr = await imgRes.json()
          alert('Gagal upload gambar: ' + JSON.stringify(imgErr))
          return
        }
      }

      alert('Produk berhasil diupdate!')
      router.push('/dashboard')
    } catch (err) {
      console.error('Gagal update produk:', err)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Produk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Nama Produk</label>
          <input type="text" className="w-full border p-2 rounded" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Harga</label>
          <input type="number" className="w-full border p-2 rounded" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Deskripsi</label>
          <textarea className="w-full border p-2 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Asal Negara</label>
          <input type="text" className="w-full border p-2 rounded" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Kategori</label>
          <select className="w-full border p-2 rounded" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
            <option value="">-- Pilih Kategori --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-medium">Gambar Baru (Opsional)</label>
          <input type="file" className="w-full" onChange={(e) => setImage(e.target.files?.[0] || null)} accept="image/*" />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
          Simpan Perubahan
        </button>
      </form>
    </div>
  )
}
