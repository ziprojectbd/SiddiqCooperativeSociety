'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function DepositsPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [deposits, setDeposits] = useState([])
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({ defaultDepositAmount: 500 })
  const [members, setMembers] = useState([])

  const handleAddClick = () => {
    router.push('/admin/deposits/add-deposit')
  }
  const [filterDate, setFilterDate] = useState('')
  const [filterMember, setFilterMember] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [todaysCollection, setTodaysCollection] = useState(0)

  useEffect(() => {
    fetchDeposits()
    fetchMembers()
    fetchSettings()
    // Get current user from localStorage
    const userStr = localStorage.getItem('user')
    if (userStr) {
      setCurrentUser(JSON.parse(userStr))
    }
  }, [])

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setDeposits(data)
      
      // Calculate today's collection
      const today = new Date().toISOString().split('T')[0]
      const todaysTotal = data
        .filter(d => d.date === today)
        .reduce((sum, d) => sum + d.amount, 0)
      setTodaysCollection(todaysTotal)
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
    } catch (error) {
      console.error('Failed to fetch settings:', error)
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
          <h1 className="text-2xl font-bold text-white">{t('deposits')}</h1>
        </div>
        <div className="flex gap-2 p-4 md:p-6 pt-0 bg-gray-800">
          <button
            onClick={handleAddClick}
            className="bg-indigo-600 text-white px-4 py-3 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-base font-medium shadow-lg transition-all active:scale-95"
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 px-4 md:px-6 pb-4 bg-gray-800">
          <div className="bg-gray-700 rounded-xl p-4 shadow-md">
            <p className="text-xs text-gray-400 mb-1">Today's Collection</p>
            <p className="text-2xl font-bold text-white">৳{todaysCollection.toLocaleString()}</p>
          </div>
          <div className="bg-gray-700 rounded-xl p-4 shadow-md">
            <p className="text-xs text-gray-400 mb-1">Expected Collection</p>
            <p className="text-2xl font-bold text-white">৳{(members.length * settings.defaultDepositAmount).toLocaleString()}</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="grid grid-cols-2 gap-4">
            {/* Paid Column */}
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-green-900 px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">{t('paid')}</h3>
              </div>
              <div className="p-4">
                {(() => {
                  const currentDate = new Date().toISOString().split('T')[0]
                  const paidMembersWithAmount = members
                    .filter((member) =>
                      deposits.some(
                        (deposit) =>
                          deposit.memberId === member._id &&
                          deposit.date === currentDate
                      )
                    )
                    .map((member) => {
                      const deposit = deposits.find(
                        (d) =>
                          d.memberId === member._id && d.date === currentDate
                      )
                      return {
                        ...member,
                        amount: deposit?.amount || 0,
                      }
                    })
                  return paidMembersWithAmount.length === 0 ? (
                    <p className="text-gray-400 text-xs">No members paid today</p>
                  ) : (
                    <ul className="space-y-0">
                      {paidMembersWithAmount.map((member, index) => (
                        <li
                          key={member._id}
                          className="text-xs text-white flex justify-between py-3 border-b border-gray-700 last:border-0"
                        >
                          <span>{member.name}</span>
                          <span className="text-green-400">
                            ৳{member.amount.toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>
            </div>

            {/* Unpaid Column */}
            <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="bg-red-900 px-4 py-3 border-b border-gray-700">
                <h3 className="text-sm font-semibold text-white">{t('unpaid')}</h3>
              </div>
              <div className="p-4">
                {(() => {
                  const currentDate = new Date().toISOString().split('T')[0]
                  const unpaidMembers = members.filter(
                    (member) =>
                      !deposits.some(
                        (deposit) =>
                          deposit.memberId === member._id &&
                          deposit.date === currentDate
                      )
                  )
                  return unpaidMembers.length === 0 ? (
                    <p className="text-gray-400 text-xs">All members paid today</p>
                  ) : (
                    <ul className="space-y-0">
                      {unpaidMembers.map((member) => (
                        <li
                          key={member._id}
                          className="text-xs text-white flex items-center justify-between gap-2 py-3 border-b border-gray-700 last:border-0"
                        >
                          <span className="flex-1">{member.name}</span>
                          <a
                            href={`tel:${member.phone}`}
                            className="px-2 py-1 bg-blue-600 text-white text-[10px] rounded hover:bg-blue-700 transition-colors whitespace-nowrap"
                          >
                            Call
                          </a>
                        </li>
                      ))}
                    </ul>
                  )
                })()}
              </div>
            </div>
          </div>
        </div>

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
                        <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">
                          {currentUser?.name === (deposit.collectorName || settings.collectorName)
                            ? 'Self'
                            : (deposit.collectorName || settings.collectorName || 'N/A')}
                        </td>
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
