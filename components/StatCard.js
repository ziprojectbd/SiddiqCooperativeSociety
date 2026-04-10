import { ArrowUp, ArrowDown } from 'lucide-react'

export default function StatCard({ title, value, change }) {
  return (
    <div className="bg-gray-800 rounded-xl shadow-md p-4 sm:p-6">
      <div>
        <p className="text-gray-400 text-xs sm:text-sm font-medium">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-white mt-1 sm:mt-2">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1 mt-1 sm:mt-2">
            {change >= 0 ? (
              <ArrowUp size={14} className="text-green-400" />
            ) : (
              <ArrowDown size={14} className="text-red-400" />
            )}
            <span className={`text-xs sm:text-sm ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {Math.abs(change)}%
            </span>
            <span className="text-gray-500 text-xs sm:text-sm ml-1">from last month</span>
          </div>
        )}
      </div>
    </div>
  )
}
