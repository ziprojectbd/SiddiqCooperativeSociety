'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Loading from '@/components/Loading'
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Eye as ViewEye } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function MembersPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingMember, setEditingMember] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewMember, setViewMember] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [showCloseAccountModal, setShowCloseAccountModal] = useState(false)
  const [closeAccountMember, setCloseAccountMember] = useState(null)
  const [closeAccountForm, setCloseAccountForm] = useState({
    notes: '',
    paymentMethod: 'cash',
    transactionId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    confirmed: false,
  })
  const [editForm, setEditForm] = useState({
    phone: '',
    password: '',
    role: 'member',
  })
  const [showEditPassword, setShowEditPassword] = useState(false)
  const [deposits, setDeposits] = useState([])
  const [loans, setLoans] = useState([])
  const [memberForm, setMemberForm] = useState({
    name: '',
    phone: '',
    role: 'member',
    password: '123456',
    address: '',
    nid: '',
    dateOfBirth: '',
    occupation: '',
    monthlyIncome: '',
    guardianName: '',
    guardianPhone: '',
    joinDate: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    fetchMembers()
    fetchDeposits()
    fetchLoans()
  }, [])

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('token')
      // Add cache-busting timestamp to ensure fresh data
      const res = await fetch(`/api/members?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      setMembers(data)
    } catch (error) {
      console.error('Failed to fetch members:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleDelete = async (member) => {
    setCloseAccountMember(member)
    setCloseAccountForm({
      notes: '',
      paymentMethod: 'cash',
      transactionId: '',
      paymentDate: new Date().toISOString().split('T')[0],
      confirmed: false,
    })
    setShowCloseAccountModal(true)
  }

  const handleAddMember = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await fetch('/api/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(memberForm),
      })
      setShowModal(false)
      setMemberForm({
        name: '',
        phone: '',
        role: 'member',
        password: '123456',
        address: '',
        nid: '',
        dateOfBirth: '',
        occupation: '',
        monthlyIncome: '',
        guardianName: '',
        guardianPhone: '',
        joinDate: new Date().toISOString().split('T')[0],
      })
      fetchMembers()
    } catch (error) {
      console.error('Failed to add member:', error)
    }
  }

  const handleEditClick = (member) => {
    setEditMember(member)
    setEditForm({
      phone: member.phone || '',
      password: '',
      role: member.role || 'member',
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const updateData = { ...editForm }
      // Only send password if it's being changed
      if (!updateData.password) {
        delete updateData.password
      }
      const res = await fetch(`/api/members?id=${editMember._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      })
      if (res.ok) {
        alert('Member updated successfully!')
      } else {
        const errorData = await res.json()
        alert('Failed to update member: ' + (errorData.error || 'Unknown error'))
      }
      setShowEditModal(false)
      setEditMember(null)
      fetchMembers()
    } catch (error) {
      console.error('Failed to update member:', error)
      alert('Failed to update member: ' + error.message)
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
        <div className="flex flex-col gap-4 p-4 md:p-6 bg-gray-800 shadow-sm sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-white">{t('members')}</h1>
          <button
            onClick={() => router.push('/admin/members/add-member')}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('password')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('role')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('totalDeposit')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('loanStatus')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('loanAmount')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('profile')}</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">{t('action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {members.map((member) => (
                    <tr key={member._id} className="hover:bg-gray-700 transition-colors">
                      <td className="px-4 py-3 text-xs text-white whitespace-nowrap">{member.name}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{member.phone}</td>
                      <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">123456</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 text-[10px] rounded-full bg-blue-900 text-blue-300">
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-green-400 font-semibold whitespace-nowrap">
                        ৳{deposits.filter(d => d.memberId === member._id).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {loans.filter(l => l.memberId === member._id).length > 0 ? (
                          <span className="px-2 py-1 text-[10px] rounded-full bg-indigo-900 text-indigo-300">
                            {t('active')}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-[10px] rounded-full bg-gray-700 text-gray-400">
                            {t('noLoan')}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-indigo-400 font-semibold whitespace-nowrap">
                        ৳{loans.filter(l => l.memberId === member._id).reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setViewMember(member)
                            setShowViewModal(true)
                          }}
                          className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          {t('view')}
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(member)}
                            className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            {t('edit')}
                          </button>
                          <button
                            onClick={() => handleDelete(member)}
                            className="px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                          >
                            {t('closeAccount')}
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

        {/* Member Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('addMember')}</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddMember}>
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
                    Monthly Income (৳)
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
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {t('addMember')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Member Modal */}
        {showViewModal && viewMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Member Details</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Member Photo & Basic Info */}
              <div className="flex items-center gap-4 mb-6 p-4 bg-gray-700 rounded-xl">
                {viewMember.imageUrl ? (
                  <img
                    src={viewMember.imageUrl}
                    alt={viewMember.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-600 border-2 border-gray-500 flex items-center justify-center">
                    <span className="text-gray-400 text-2xl font-bold">
                      {viewMember.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{viewMember.name || 'N/A'}</h3>
                  <p className="text-gray-300 text-sm">{viewMember.phone || 'N/A'}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    viewMember.role === 'admin' ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'
                  }`}>
                    {viewMember.role || 'member'}
                  </span>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-indigo-400 mb-3 border-b border-gray-700 pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Email</label>
                    <p className="text-white text-sm">{viewMember.email || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Address</label>
                    <p className="text-white text-sm">{viewMember.address || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">NID</label>
                    <p className="text-white text-sm">{viewMember.nid || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Date of Birth</label>
                    <p className="text-white text-sm">{viewMember.dateOfBirth ? new Date(viewMember.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Occupation</label>
                    <p className="text-white text-sm">{viewMember.occupation || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Monthly Income</label>
                    <p className="text-white text-sm">{viewMember.monthlyIncome ? `৳${Number(viewMember.monthlyIncome).toLocaleString()}` : 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Join Date</label>
                    <p className="text-white text-sm">{viewMember.joinDate ? new Date(viewMember.joinDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Guardian/Nominee Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-purple-400 mb-3 border-b border-gray-700 pb-2">Guardian/Nominee</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Name</label>
                    <p className="text-white text-sm">{viewMember.guardianName || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Phone</label>
                    <p className="text-white text-sm">{viewMember.guardianPhone || 'N/A'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1">Address</label>
                    <p className="text-white text-sm">{viewMember.guardianAddress || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3 border-b border-gray-700 pb-2">Financial Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 bg-gray-700 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Total Deposit</p>
                    <p className="text-lg font-bold text-white">
                      ৳{deposits.filter(d => d.memberId === viewMember._id || d.memberId === viewMember._id?.toString()).reduce((sum, d) => sum + (d.amount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Total Loan</p>
                    <p className="text-lg font-bold text-white">
                      ৳{loans.filter(l => l.memberId === viewMember._id || l.memberId === viewMember._id?.toString()).reduce((sum, l) => sum + (l.amount || 0), 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-700 rounded-lg text-center">
                    <p className="text-xs text-gray-400">Loan Status</p>
                    <p className="text-lg font-bold text-white">
                      {loans.filter(l => (l.memberId === viewMember._id || l.memberId === viewMember._id?.toString()) && l.status === 'active').length > 0 ? 'Active' : 'None'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {showEditModal && editMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('editMember')}</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleEditSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editMember.name || ''}
                    disabled
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={editForm.phone}
                    onChange={(e) =>
                      setEditForm({ ...editForm, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Role
                  </label>
                  <select
                    required
                    value={editForm.role}
                    onChange={(e) =>
                      setEditForm({ ...editForm, role: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    New Password (leave blank to keep current)
                  </label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={editForm.password}
                      onChange={(e) =>
                        setEditForm({ ...editForm, password: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-700 text-white pr-12"
                      placeholder="Leave blank to keep current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showEditPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Close Account Modal */}
        {showCloseAccountModal && closeAccountMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">{t('closeMemberAccount')}</h2>
                <button
                  onClick={() => setShowCloseAccountModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Member Info Section */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">{t('memberInfo')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('name')}</label>
                    <p className="text-white">{closeAccountMember.name || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('memberId')}</label>
                    <p className="text-white">{closeAccountMember._id || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('phone')}</label>
                    <p className="text-white">{closeAccountMember.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('joinDate')}</label>
                    <p className="text-white">{closeAccountMember.joinDate ? new Date(closeAccountMember.joinDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary Section */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">{t('financialSummary')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('totalSavings')}</label>
                    <p className="text-green-400 font-semibold">
                      ৳{deposits.filter(d => d.memberId === closeAccountMember._id).reduce((sum, d) => sum + d.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('totalLoan')}</label>
                    <p className="text-red-400 font-semibold">
                      ৳{loans.filter(l => l.memberId === closeAccountMember._id).reduce((sum, l) => sum + l.amount, 0).toLocaleString()}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">{t('currentBalance')}</label>
                    <p className="text-blue-400 font-semibold">
                      ৳{(deposits.filter(d => d.memberId === closeAccountMember._id).reduce((sum, d) => sum + d.amount, 0) - loans.filter(l => l.memberId === closeAccountMember._id).reduce((sum, l) => sum + l.amount, 0)).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Payment Details Section */}
              <div className="mb-6 p-4 bg-gray-700 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-4">{t('paymentDetails')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('paymentMethod')}</label>
                    <select
                      value={closeAccountForm.paymentMethod}
                      onChange={(e) => setCloseAccountForm({ ...closeAccountForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-800 text-white"
                    >
                      <option value="cash">{t('handCash')}</option>
                      <option value="bkash">bKash</option>
                      <option value="nagad">Nagad</option>
                      <option value="rocket">Rocket</option>
                    </select>
                  </div>
                  {closeAccountForm.paymentMethod !== 'cash' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">{t('transactionId')} ({t('optional')})</label>
                      <input
                        type="text"
                        value={closeAccountForm.transactionId}
                        onChange={(e) => setCloseAccountForm({ ...closeAccountForm, transactionId: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-800 text-white"
                        placeholder="Enter transaction ID"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('paymentDate')}</label>
                    <input
                      type="date"
                      value={closeAccountForm.paymentDate}
                      onChange={(e) => setCloseAccountForm({ ...closeAccountForm, paymentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-800 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">{t('notesRemarks')}</label>
                    <textarea
                      value={closeAccountForm.notes}
                      onChange={(e) => setCloseAccountForm({ ...closeAccountForm, notes: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-800 text-white"
                      placeholder="Enter notes or remarks"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              {/* Confirmation Checkbox */}
              <div className="mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={closeAccountForm.confirmed}
                    onChange={(e) => setCloseAccountForm({ ...closeAccountForm, confirmed: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 bg-gray-800"
                  />
                  <span className="text-sm text-gray-300">{t('confirmCheckbox')}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setShowCloseAccountModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-700 text-white"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={async () => {
                    if (!closeAccountForm.confirmed) {
                      alert('Please confirm the account details')
                      return
                    }
                    
                    try {
                      const token = localStorage.getItem('token')
                      
                      // Calculate financial summary
                      const totalSavings = deposits.filter(d => d.memberId === closeAccountMember._id).reduce((sum, d) => sum + d.amount, 0)
                      const totalLoan = loans.filter(l => l.memberId === closeAccountMember._id).reduce((sum, l) => sum + l.amount, 0)
                      const currentBalance = totalSavings - totalLoan
                      
                      const closeAccountData = {
                        memberId: closeAccountMember._id,
                        memberData: {
                          name: closeAccountMember.name,
                          phone: closeAccountMember.phone,
                          joinDate: closeAccountMember.joinDate,
                          role: closeAccountMember.role,
                        },
                        financialSummary: {
                          totalSavings,
                          totalLoan,
                          currentBalance,
                        },
                        paymentDetails: {
                          paymentMethod: closeAccountForm.paymentMethod,
                          transactionId: closeAccountForm.transactionId,
                          paymentDate: closeAccountForm.paymentDate,
                          notes: closeAccountForm.notes,
                        },
                        closedAt: new Date().toISOString(),
                      }
                      
                      const res = await fetch('/api/close-account', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(closeAccountData),
                      })
                      
                      const data = await res.json()
                      
                      if (data.success) {
                        alert('Account closed successfully')
                        setShowCloseAccountModal(false)
                        setCloseAccountMember(null)
                        // Immediately remove the closed member from local state using functional update
                        setMembers(prevMembers => prevMembers.filter(m => m._id !== closeAccountMember._id))
                        // Refresh the members list from server to get latest data
                        await fetchMembers()
                      } else {
                        alert('Failed to close account: ' + data.error)
                      }
                    } catch (error) {
                      console.error('Failed to close account:', error)
                      alert('Failed to close account')
                    }
                  }}
                  disabled={!closeAccountForm.confirmed}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
                >
                  {t('confirmCloseAccount')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
