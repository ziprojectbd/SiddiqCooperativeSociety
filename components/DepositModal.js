'use client'

import { X } from 'lucide-react'

export default function DepositModal({ isOpen, onClose, members, depositForm, setDepositForm, onSubmit, defaultAmount }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Deposit</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Member
            </label>
            <select
              required
              value={depositForm.memberId}
              onChange={(e) => {
                const selectedMember = members.find(m => m._id === e.target.value)
                setDepositForm({
                  ...depositForm,
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
              Amount (৳)
            </label>
            <input
              type="number"
              required
              min="1"
              value={depositForm.amount}
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
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-700 rounded-lg hover:bg-gray-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Add Deposit
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
