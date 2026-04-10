'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import DepositModal from '@/components/DepositModal'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DepositsPage() {
  const { t } = useLanguage()
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [settings, setSettings] = useState({ defaultDepositAmount: 500 })
  const [members, setMembers] = useState([])
  const [depositForm, setDepositForm] = useState({
    memberId: '',
    memberName: '',
    amount: 500,
    date: new Date().toISOString().split('T')[0],
  })
  const [filterDate, setFilterDate] = useState('')
  const [filterMember, setFilterMember] = useState('')
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchDeposits()
    fetchMembers()
    fetchSettings()
  }, [])

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDeposits(data)
    } catch (error) {
      console.error('Failed to fetch deposits:', error)
    } finally {
      setLoading(false)
    }
  }

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
      setSettings(data)
      setDepositForm(prev => ({ ...prev, amount: data.defaultDepositAmount || 500 }))
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const handleDepositSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/deposits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...depositForm,
          amount: settings.defaultDepositAmount,
          collectorName: settings.collectorName || '',
        }),
      })
      setShowModal(false)
      setDepositForm({
        memberId: '',
        memberName: '',
        amount: settings.defaultDepositAmount,
        date: new Date().toISOString().split('T')[0],
      })
      fetchDeposits()
    } catch (error) {
      console.error('Failed to add deposit:', error)
    }
  }

  const filteredDeposits = deposits.filter((deposit) => {
    if (filterDate && new Date(deposit.date).toISOString().split('T')[0] !== filterDate) {
      return false
    }
    if (filterMember && deposit.memberId !== filterMember) {
      return false
    }
    return true
  })

  if (loading) {
    return (
      <div className="flex">
        <Sidebar role="admin" />
        <div className="flex-1 p-4 md:p-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex items-center gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-2xl font-bold text-white">{t('deposits')}</h1>
        </div>
        <div className="flex gap-2 p-4 md:p-6 pt-0 bg-gray-800">
          <button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-base font-medium flex-1 shadow-lg transition-all active:scale-95"
          >
            <Plus size={20} />
            {t('addDeposit')}
          </button>
          <button
            onClick={() => setShowHistory(true)}
            className="bg-gray-700 text-white px-4 py-3 rounded-xl hover:bg-gray-600 flex items-center gap-2 text-base font-medium flex-1 shadow-lg transition-all active:scale-95"
          >
            {t('history')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="p-2 md:p-4 border-b border-gray-700">
              <div className="flex flex-wrap gap-2 md:gap-4 items-end">
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-gray-400 text-[10px] font-medium mb-1">{t('date')}</label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white text-xs"
                  />
                </div>
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-gray-400 text-[10px] font-medium mb-1">{t('member')}</label>
                  <select
                    value={filterMember}
                    onChange={(e) => setFilterMember(e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white text-xs"
                  >
                    <option value="">{t('allMembers')}</option>
                    {members.map((member) => (
                      <option key={member._id} value={member._id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => {
                    setFilterDate('')
                    setFilterMember('')
                  }}
                  className="px-2 py-1.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 text-xs"
                >
                  {t('clearFilters')}
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('date')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('member')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('collector')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredDeposits.slice(0, 20).map((deposit) => (
                    <tr key={deposit._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">
                        {new Date(deposit.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{deposit.memberName}</td>
                      <td className="px-4 py-3 text-xs text-white font-semibold whitespace-nowrap">
                        ৳{deposit.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{deposit.collectorName || settings.collectorName || 'N/A'}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] rounded-full bg-green-900 text-green-300">
                          Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Deposit Modal */}
        <DepositModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          members={members}
          depositForm={depositForm}
          setDepositForm={setDepositForm}
          onSubmit={handleDepositSubmit}
          defaultAmount={settings.defaultDepositAmount}
        />

        {/* Deposit History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('depositHistory')}</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Member</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Collector</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {deposits.map((deposit) => (
                      <tr key={deposit._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-xs text-white whitespace-nowrap">
                          {new Date(deposit.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{deposit.memberName}</td>
                        <td className="px-4 py-3 text-xs text-white font-semibold whitespace-nowrap">
                          ৳{deposit.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{deposit.collectorName || settings.collectorName || 'N/A'}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="px-2 py-1 text-[10px] rounded-full bg-green-900 text-green-300">
                            Paid
                          </span>
                        </td>
                      </tr>
                    ))}
                    {deposits.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-400 text-sm">
                          No deposits found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
