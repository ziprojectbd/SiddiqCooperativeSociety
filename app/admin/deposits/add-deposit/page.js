'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddDepositPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [settings, setSettings] = useState({ defaultDepositAmount: 500 })
  const [depositForm, setDepositForm] = useState({
    memberId: '',
    memberName: '',
    amount: 500,
    date: new Date().toISOString().split('T')[0],
    collectorName: '',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMembers()
    fetchSettings()
  }, [])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/members', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    }
  }

  const fetchSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data) {
        setSettings(data)
        setDepositForm((prev) => ({
          ...prev,
          amount: data.defaultDepositAmount || 500,
        }))
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...depositForm,
          amount: settings.defaultDepositAmount,
          collectorName: depositForm.collectorName || settings.collectorName || '',
        }),
      })
      if (res.ok) {
        router.push('/admin/deposits')
      }
    } catch (error) {
      console.error('Failed to add deposit:', error)
    }
  }

  const handleCancel = () => {
    router.push('/admin/deposits')
  }

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-gray-900">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center justify-between gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('addDeposit')}</h1>
          <button onClick={handleCancel} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Select Member
                </label>
                <select
                  required
                  value={depositForm.memberId}
                  onChange={(e) => {
                    const selectedMember = members.find((m) => m._id === e.target.value)
                    setDepositForm({
                      ...depositForm,
                      memberId: e.target.value,
                      memberName: selectedMember?.name || '',
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} - {member.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount (৳)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={settings.defaultDepositAmount}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-900 text-white"
                  placeholder="Default amount from settings"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={depositForm.date}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, date: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Collector Name
                </label>
                <input
                  type="text"
                  required
                  value={depositForm.collectorName}
                  onChange={(e) =>
                    setDepositForm({ ...depositForm, collectorName: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  placeholder="Enter collector name"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  {t('addDeposit')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
