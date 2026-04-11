'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddMemberPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [memberForm, setMemberForm] = useState({
    name: '',
    phone: '',
    role: 'member',
    password: '',
    address: '',
    nid: '',
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: '',
    guardianName: '',
    guardianPhone: '',
    guardianAddress: '',
    joinDate: new Date().toISOString().split('T')[0],
    email: '',
    createdAt: new Date().toISOString(),
    imageUrl: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB')
      return
    }

    // Show preview immediately
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to Cloudinary
    setUploading(true)
    try {
      const token = localStorage.getItem('token')
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setMemberForm({ ...memberForm, imageUrl: data.url })
      } else {
        alert('Failed to upload image: ' + (data.error || 'Unknown error'))
        setImagePreview('')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Failed to upload image')
      setImagePreview('')
    } finally {
      setUploading(false)
    }
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberForm),
      })
      
      if (res.ok) {
        alert('Member added successfully!')
        router.push('/admin/members')
      } else {
        const errorData = await res.json()
        alert('Failed to add member: ' + (errorData.error || 'Unknown error'))
      }
    } catch (error) {
      console.error('Failed to add member:', error)
      alert('Failed to add member: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    router.push('/admin/members')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center justify-between gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('addMember')}</h1>
          <button onClick={handleCancel} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-md mx-auto">
            <form onSubmit={handleAddMember}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Member Photo (Optional)
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Member photo"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('')
                          setMemberForm({ ...memberForm, imageUrl: '' })
                        }}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-gray-700 border-2 border-gray-600 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No Photo</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="block">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                      <span className="block w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-600 text-white text-center text-sm font-medium hover:bg-indigo-700 cursor-pointer transition-colors">
                        {uploading ? 'Uploading...' : 'Choose Photo'}
                      </span>
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Max size: 5MB, JPG/PNG</p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter full name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={memberForm.phone}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter phone number"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={memberForm.email}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter email address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.address}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, address: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  NID (National ID)
                </label>
                <input
                  type="text"
                  required
                  pattern="[0-9]{10,13}"
                  value={memberForm.nid}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, nid: e.target.value.replace(/\D/g, '') })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter NID number (10-13 digits)"
                  title="Please enter only numbers (10-13 digits)"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  required
                  value={memberForm.dateOfBirth}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, dateOfBirth: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Occupation
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.occupation}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, occupation: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter occupation"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Monthly Income (BDT)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={memberForm.monthlyIncome}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, monthlyIncome: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter monthly income"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Guardian/Nominee Name
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.guardianName}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, guardianName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter guardian/nominee name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Guardian/Nominee Phone
                </label>
                <input
                  type="tel"
                  required
                  value={memberForm.guardianPhone}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, guardianPhone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter guardian/nominee phone"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Guardian/Nominee Address
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.guardianAddress}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, guardianAddress: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter guardian/nominee address"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Join Date
                </label>
                <input
                  type="date"
                  required
                  value={memberForm.joinDate}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, joinDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role
                </label>
                <select
                  required
                  value={memberForm.role}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="member">Member</option>
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={memberForm.password}
                    onChange={(e) =>
                      setMemberForm({ ...memberForm, password: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white pr-12"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <X size={20} /> : <X size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  disabled={loading}
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : t('addMember')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
