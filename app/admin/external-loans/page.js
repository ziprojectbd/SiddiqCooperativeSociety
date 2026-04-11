'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, Edit, Trash2, X, Pencil } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ExternalLoansPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [loans, setLoans] = useState([])
  const [borrowers, setBorrowers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLoan, setEditingLoan] = useState(null)
  const [loanForm, setLoanForm] = useState({
    borrowerId: '',
    borrowerName: '',
    amount: '',
    interestRate: '',
    tenureMonths: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    purpose: '',
  })

  useEffect(() => {
    fetchLoans()
    fetchBorrowers()
  }, [])

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLoans(data)
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleAddClick = () => {
    router.push('/admin/external-loans/add-loan')
  }

  const handleEditClick = (loan) => {
    setEditingLoan(loan)
    setLoanForm({ ...loan })
    setShowModal(true)
  }

  const handleUpdateLoan = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/external-loans?id=${editingLoan._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(loanForm),
      })
      setShowModal(false)
      setEditingLoan(null)
      setLoanForm({
        borrowerId: '',
        borrowerName: '',
        amount: '',
        interestRate: '',
        tenureMonths: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        purpose: '',
      })
      fetchLoans()
    } catch (error) {
      console.error('Failed to update loan:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this loan?')) return
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/external-loans?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchLoans()
    } catch (error) {
      console.error('Failed to delete loan:', error)
    }
  }

  const calculateEndDate = (startDate, tenureMonths) => {
    if (!startDate || !tenureMonths) return ''
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + parseInt(tenureMonths))
    return date.toISOString().split('T')[0]
  }

  const calculateTotalAmount = (amount, interestRate, tenureMonths) => {
    if (!amount || !interestRate || !tenureMonths) return 0
    const principal = parseFloat(amount)
    const rate = parseFloat(interestRate) / 100
    const tenure = parseInt(tenureMonths)
    const totalInterest = principal * rate * (tenure / 12)
    return principal + totalInterest
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('externalLoans')}</h1>
          <button
            onClick={handleAddClick}
            className="bg-indigo-600 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:bg-indigo-700 flex items-center gap-2 text-sm sm:text-base font-medium shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            {t('addLoan')}
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('externalBorrowers')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('interestRate')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('tenure')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('total')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('status')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {loans.map((loan) => {
                    const totalAmount = calculateTotalAmount(loan.amount, loan.interestRate, loan.tenureMonths)
                    const isPaid = loan.status === 'paid'
                    return (
                      <tr key={loan._id} className="hover:bg-gray-700 transition-colors">
                        <td className="px-4 py-3 text-xs text-white whitespace-nowrap">{loan.borrowerName}</td>
                        <td className="px-4 py-3 text-xs text-white font-semibold whitespace-nowrap">
                          ৳{parseFloat(loan.amount).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{loan.interestRate}%</td>
                        <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{loan.tenureMonths} months</td>
                        <td className="px-4 py-3 text-xs text-indigo-400 font-semibold whitespace-nowrap">
                          ৳{totalAmount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 text-[10px] rounded-full ${
                            isPaid ? 'bg-green-900 text-green-300' : 'bg-yellow-900 text-yellow-300'
                          }`}>
                            {isPaid ? 'Paid' : 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditClick(loan)}
                              className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Pencil size={16} className="text-blue-400" />
                            </button>
                            <button
                              onClick={() => handleDelete(loan._id)}
                              className="p-1.5 hover:bg-gray-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
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
                  {t('editLoan')}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false)
                    setEditingLoan(null)
                    setLoanForm({
                      borrowerId: '',
                      borrowerName: '',
                      amount: '',
                      interestRate: '',
                      tenureMonths: '',
                      startDate: new Date().toISOString().split('T')[0],
                      endDate: '',
                      purpose: '',
                    })
                  }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateLoan} className="space-y-4">
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
                    <label className="block text-gray-400 text-sm font-medium mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanForm.interestRate}
                      onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Tenure (months)</label>
                    <input
                      type="number"
                      value={loanForm.tenureMonths}
                      onChange={(e) => {
                        const endDate = calculateEndDate(loanForm.startDate, e.target.value)
                        setLoanForm({ ...loanForm, tenureMonths: e.target.value, endDate })
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
                        const endDate = calculateEndDate(e.target.value, loanForm.tenureMonths)
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

                {loanForm.amount && loanForm.interestRate && loanForm.tenureMonths && (
                  <div className="bg-gray-700 p-4 rounded-lg">
                    <p className="text-white text-sm">
                      <span className="text-gray-400">Total Amount (with interest): </span>
                      <span className="text-indigo-400 font-semibold">
                        ৳{calculateTotalAmount(loanForm.amount, loanForm.interestRate, loanForm.tenureMonths).toLocaleString()}
                      </span>
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      End Date: {calculateEndDate(loanForm.startDate, loanForm.tenureMonths)}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium shadow-lg transition-all active:scale-95"
                  >
                    {t('save')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false)
                      setEditingLoan(null)
                      setLoanForm({
                        borrowerId: '',
                        borrowerName: '',
                        amount: '',
                        interestRate: '',
                        tenureMonths: '',
                        startDate: new Date().toISOString().split('T')[0],
                        endDate: '',
                        purpose: '',
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
