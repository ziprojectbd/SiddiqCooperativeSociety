'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddExternalBorrowerPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [borrowerForm, setBorrowerForm] = useState({
    name: '',
    phone: '',
    address: '',
    nid: '',
    occupation: '',
    monthlyIncome: '',
    guarantorName: '',
    guarantorPhone: '',
    guarantorAddress: '',
  })

  const handleAddBorrower = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(borrowerForm),
      })
      if (res.ok) {
        router.push('/admin/external-borrowers')
      }
    } catch (error) {
      console.error('Failed to add borrower:', error)
    }
  }

  const handleCancel = () => {
    router.push('/admin/external-borrowers')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center justify-between gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('addMember')}</h1>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
            <form onSubmit={handleAddBorrower} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={borrowerForm.name}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={borrowerForm.phone}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    value={borrowerForm.address}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">NID</label>
                  <input
                    type="text"
                    value={borrowerForm.nid}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, nid: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Occupation</label>
                  <input
                    type="text"
                    value={borrowerForm.occupation}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, occupation: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Monthly Income</label>
                  <input
                    type="number"
                    value={borrowerForm.monthlyIncome}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, monthlyIncome: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold text-white mt-6 mb-4">Guarantor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Guarantor Name</label>
                  <input
                    type="text"
                    value={borrowerForm.guarantorName}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, guarantorName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Guarantor Phone</label>
                  <input
                    type="tel"
                    value={borrowerForm.guarantorPhone}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, guarantorPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-400 text-sm font-medium mb-2">Guarantor Address</label>
                  <input
                    type="text"
                    value={borrowerForm.guarantorAddress}
                    onChange={(e) => setBorrowerForm({ ...borrowerForm, guarantorAddress: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium shadow-lg transition-all active:scale-95"
                >
                  {t('addMember')}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-medium shadow-lg transition-all active:scale-95"
                >
                  {t('cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
