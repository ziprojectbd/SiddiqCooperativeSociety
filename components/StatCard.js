import { ArrowUp, ArrowDown } from 'lucide-react'

export default function StatCard({ title, value, change }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <div>
        <p className="text-gray-400 text-xs sm:text-sm font-medium">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{value}</p>
              </div>
    </div>
  )
}
