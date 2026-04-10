'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import { Plus, X } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ExternalLoanPaymentsPage() {
  const { t } = useLanguage()
  const [payments, setPayments] = useState([])
  const [loans, setLoans] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [paymentForm, setPaymentForm] = useState({
    loanId: '',
    loanBorrowerName: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'principal',
  })

  useEffect(() => {
    fetchPayments()
    fetchLoans()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-loan-payments', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setPayments(data)
    } catch (error) {
      console.error('Failed to fetch payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/external-loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLoans(data.filter(l => l.status === 'active'))
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/external-loan-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentForm),
      })
      setShowModal(false)
      setPaymentForm({
        loanId: '',
        loanBorrowerName: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'principal',
      })
      fetchPayments()
      fetchLoans()
    } catch (error) {
      console.error('Failed to add payment:', error)
    }
  }

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
          <h1 className="text-2xl font-bold text-white">{t('externalLoanPayments')}</h1>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('date')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('externalBorrowers')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('amount')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{payment.loanBorrowerName}</td>
                      <td className="px-4 py-3 text-xs text-white font-semibold whitespace-nowrap">
                        ৳{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] rounded-full bg-blue-900 text-blue-300">
                          {payment.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('addDeposit')}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Select Loan</label>
                  <select
                    value={paymentForm.loanId}
                    onChange={(e) => {
                      const loan = loans.find(l => l._id === e.target.value)
                      setPaymentForm({
                        ...paymentForm,
                        loanId: e.target.value,
                        loanBorrowerName: loan ? loan.borrowerName : ''
                      })
                    }}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    required
                  >
                    <option value="">Select Loan</option>
                    {loans.map((loan) => (
                      <option key={loan._id} value={loan._id}>
                        {loan.borrowerName} - ৳{parseFloat(loan.amount).toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Amount (৳)</label>
                    <input
                      type="number"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
                    <input
                      type="date"
                      value={paymentForm.date}
                      onChange={(e) => setPaymentForm({ ...paymentForm, date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Payment Type</label>
                  <select
                    value={paymentForm.type}
                    onChange={(e) => setPaymentForm({ ...paymentForm, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="principal">Principal</option>
                    <option value="interest">Interest</option>
                    <option value="both">Principal + Interest</option>
                  </select>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 font-medium shadow-lg transition-all active:scale-95"
                  >
                    {t('addDeposit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
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
