'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, Edit, Trash2, X, Pencil } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ExternalBorrowersPage() {
  const { t } = useLanguage()
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBorrower, setEditingBorrower] = useState(null)
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

  useEffect(() => {
    fetchBorrowers()
  }, [])

  const fetchBorrowers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-borrowers', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setBorrowers(data)
    } catch (error) {
      console.error('Failed to fetch borrowers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBorrower = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/external-borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(borrowerForm),
      })
      setShowModal(false)
      setBorrowerForm({
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
      fetchBorrowers()
    } catch (error) {
      console.error('Failed to add borrower:', error)
    }
  }

  const handleEditClick = (borrower) => {
    setEditingBorrower(borrower)
    setBorrowerForm({ ...borrower })
    setShowModal(true)
  }

  const handleUpdateBorrower = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/external-borrowers/${editingBorrower._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(borrowerForm),
      })
      setShowModal(false)
      setEditingBorrower(null)
      setBorrowerForm({
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
      fetchBorrowers()
    } catch (error) {
      console.error('Failed to update borrower:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this borrower?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/external-borrowers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchBorrowers()
    } catch (error) {
      console.error('Failed to delete borrower:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="flex-1 bg-gray-900">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('externalBorrowers')}</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-base font-medium w-full shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} />
            {t('addMember')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('name')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('phone')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('nid')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('occupation')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('guardianName')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {borrowers.map((borrower) => (
                    <tr key={borrower._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">{borrower.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{borrower.phone}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{borrower.nid}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{borrower.occupation}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{borrower.guarantorName}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(borrower)}
                            className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Pencil size={16} className="text-blue-400" />
                          </button>
                          <button
                            onClick={() => handleDelete(borrower._id)}
                            className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} className="text-red-400" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {editingBorrower ? t('editMember') : t('addMember')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingBorrower(null)
                    setBorrowerForm({
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
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={editingBorrower ? handleUpdateBorrower : handleAddBorrower} className="space-y-4">
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
                    {editingBorrower ? t('save') : t('addMember')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingBorrower(null)
                      setBorrowerForm({
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
                    }}
                    className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-medium shadow-lg transition-all active:scale-95"
                  >
                    {t('cancel')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
