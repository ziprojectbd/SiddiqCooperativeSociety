'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, X, FileText } from 'lucide-react'

export default function LoanPaymentsPage() {
  const router = useRouter()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [members, setMembers] = useState([])
  const [loans, setLoans] = useState([])
  const [paymentForm, setPaymentForm] = useState({
    memberId: '',
    memberName: '',
    loanId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'principal',
  })

  useEffect(() => {
    fetchPayments()
    fetchMembers()
    fetchLoans()
  }, [])

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/loan-payments', {
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

  const fetchLoans = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/loans', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setLoans(data)
    } catch (error) {
      console.error('Failed to fetch loans:', error)
    }
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/loan-payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentForm),
      })
      setShowModal(false)
      setPaymentForm({
        memberId: '',
        memberName: '',
        loanId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'principal',
      })
      fetchPayments()
    } catch (error) {
      console.error('Failed to add payment:', error)
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 md:p-6 bg-gray-800">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Loan Payments</h1>
          <button
            onClick={() => router.push('/admin/loan-payments-history')}
            className="bg-gray-700 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-xl hover:bg-gray-600 flex items-center gap-2 text-sm sm:text-base font-medium shadow-lg transition-all active:scale-95 whitespace-nowrap"
          >
            <FileText size={18} className="sm:w-5 sm:h-5" />
            Payment History
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Member</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">
                        {new Date(payment.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{payment.memberName}</td>
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
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add Payment</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handlePaymentSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Select Member
                  </label>
                  <select
                    required
                    value={paymentForm.memberId}
                    onChange={(e) => {
                      const selectedMember = members.find(m => m._id === e.target.value)
                      setPaymentForm({
                        ...paymentForm,
                        memberId: e.target.value,
                        memberName: selectedMember?.name || ''
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
                    Select Loan
                  </label>
                  <select
                    required
                    value={paymentForm.loanId}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, loanId: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="">Select a loan</option>
                    {loans.filter(l => l.memberId === paymentForm.memberId).map((loan) => (
                      <option key={loan._id} value={loan._id}>
                        ৳{loan.amount.toLocaleString()} - {loan.status}
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
                    value={paymentForm.amount}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, amount: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter payment amount"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Payment Type
                  </label>
                  <select
                    required
                    value={paymentForm.type}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, type: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="principal">Principal</option>
                    <option value="interest">Interest</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={paymentForm.date}
                    onChange={(e) =>
                      setPaymentForm({ ...paymentForm, date: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Add Payment
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
