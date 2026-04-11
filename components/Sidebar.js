'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, Users, DollarSign, FileText, 
  ArrowLeftRight, BarChart3, LogOut, X, Settings, UserPlus, UsersRound, Info, User
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useSidebar } from '@/contexts/SidebarContext'
import SomitiMenu from './SomitiMenu'

export default function Sidebar({ role }) {
  const pathname = usePathname()
  const { t } = useLanguage()
  const { isOpen, closeSidebar } = useSidebar()

  const adminMenu = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/admin/members', icon: Users, label: t('members') },
    { href: '/admin/deposits', icon: DollarSign, label: t('deposits') },
    { href: '/admin/external-borrowers', icon: UserPlus, label: t('externalBorrowers') },
    { href: '/admin/external-loans', icon: FileText, label: t('externalLoans') },
    { href: '/admin/external-loan-payments', icon: ArrowLeftRight, label: t('externalLoanPayments') },
    { href: '/admin/member-loans', icon: FileText, label: t('memberLoans') },
    { href: '/admin/loan-payments', icon: ArrowLeftRight, label: t('memberLoanPayments') },
    { href: '/admin/reports', icon: BarChart3, label: t('reports') },
    { href: '/admin/settings', icon: Settings, label: t('settings') },
  ]

  const memberMenu = [
    { href: '/member/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { href: '/member/my-account', icon: User, label: t('myAccount') },
    { href: '/member/deposit-history', icon: BarChart3, label: t('depositHistory') },
    { href: '/member/my-loan', icon: FileText, label: t('loans') },
  ]

  const menu = role === 'admin' ? adminMenu : memberMenu

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
        />
      )}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-auto`}>
        <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <span className="text-white font-bold text-lg">{role === 'admin' ? 'Admin Panel' : 'Member Panel'}</span>
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 flex-1 space-y-2">
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                pathname === item.href
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
          
          {role === 'member' && (
            <SomitiMenu />
          )}
        </nav>

        <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-gray-800 transition-colors text-red-400"
          >
            <LogOut size={20} />
            <span>{t('logout')}</span>
          </button>
        </div>
      </div>
    </div>
    </>
  )
}
