'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AddExternalLoanPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [borrowers, setBorrowers] = useState([])
  const [loanForm, setLoanForm] = useState({
    borrowerId: '',
    borrowerName: '',
    amount: '',
    dailyInterest: '',
    tenureDays: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    purpose: '',
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
    }
  }

  const calculateEndDate = (startDate, tenureDays) => {
    if (!startDate || !tenureDays) return ''
    const date = new Date(startDate)
    date.setDate(date.getDate() + parseInt(tenureDays))
    return date.toISOString().split('T')[0]
  }

  const calculateTotalAmount = (amount, dailyInterest, tenureDays) => {
    if (!amount || !dailyInterest || !tenureDays) return 0
    const principal = parseFloat(amount)
    const daily = parseFloat(dailyInterest)
    const days = parseInt(tenureDays)
    const totalInterest = daily * days
    return principal + totalInterest
  }

  const handleAddLoan = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-loans', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanForm),
      })
      if (res.ok) {
        alert('Loan added successfully!')
        router.push('/admin/external-loans')
      }
    } catch (error) {
      console.error('Failed to add loan:', error)
    }
  }

  const handleCancel = () => {
    router.push('/admin/external-loans')
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-900">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('addLoan')}</h1>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white p-1"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6 max-w-2xl mx-auto">
            <form onSubmit={handleAddLoan} className="space-y-4">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Borrower</label>
                <select
                  value={loanForm.borrowerId}
                  onChange={(e) => {
                    const borrower = borrowers.find(b => b._id === e.target.value)
                    setLoanForm({
                      ...loanForm,
                      borrowerId: e.target.value,
                      borrowerName: borrower ? borrower.name : ''
                    })
                  }}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  required
                >
                  <option value="">Select Borrower</option>
                  {borrowers.map((borrower) => (
                    <option key={borrower._id} value={borrower._id}>
                      {borrower.name} - {borrower.phone}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Loan Amount (৳)</label>
                  <input
                    type="number"
                    value={loanForm.amount}
                    onChange={(e) => {
                      setLoanForm({ ...loanForm, amount: e.target.value })
                    }}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-1">Daily Interest (৳)</label>
                  <p className="text-gray-500 text-xs mb-2">Ex: 1000 ৳ per day</p>
                  <input
                    type="number"
                    value={loanForm.dailyInterest}
                    onChange={(e) => setLoanForm({ ...loanForm, dailyInterest: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Tenure (days)</label>
                  <input
                    type="number"
                    value={loanForm.tenureDays}
                    onChange={(e) => {
                      const endDate = calculateEndDate(loanForm.startDate, e.target.value)
                      setLoanForm({ ...loanForm, tenureDays: e.target.value, endDate })
                    }}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={loanForm.startDate}
                    onChange={(e) => {
                      const endDate = calculateEndDate(e.target.value, loanForm.tenureDays)
                      setLoanForm({ ...loanForm, startDate: e.target.value, endDate })
                    }}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Purpose</label>
                <input
                  type="text"
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm({ ...loanForm, purpose: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                />
              </div>

              {loanForm.amount && loanForm.dailyInterest && loanForm.tenureDays && (
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="text-white text-sm">
                    <span className="text-gray-400">Daily Interest: </span>
                    <span className="text-yellow-400 font-semibold">
                      ৳{parseFloat(loanForm.dailyInterest).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-white text-sm mt-1">
                    <span className="text-gray-400">Total Interest ({parseInt(loanForm.tenureDays)} days): </span>
                    <span className="text-yellow-400 font-semibold">
                      ৳{(parseFloat(loanForm.dailyInterest) * parseInt(loanForm.tenureDays)).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-white text-sm mt-1">
                    <span className="text-gray-400">Total Amount (with interest): </span>
                    <span className="text-indigo-400 font-semibold">
                      ৳{calculateTotalAmount(loanForm.amount, loanForm.dailyInterest, loanForm.tenureDays).toLocaleString()}
                    </span>
                  </p>
                  <p className="text-gray-400 text-xs mt-2">
                    End Date: {calculateEndDate(loanForm.startDate, loanForm.tenureDays)}
                  </p>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium shadow-lg transition-all active:scale-95"
                >
                  {t('addLoan')}
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
