import { Wallet, Calendar, BarChart3, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/vendor', label: 'IndiStylo', isBrand: true },
  { path: '/vendor/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/vendor/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/vendor/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/vendor/profile', icon: User, label: 'Profile' },
]

export function VendorNavbar() {
  const location = useLocation()
  const normalizedPathname = location.pathname.replace(/\/$/, '') || '/vendor'

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 z-50 bg-card safe-area-bottom',
        'bottom-0 md:bottom-auto md:top-0',
        'md:border-b border-border'
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive =
            item.path === '/vendor'
              ? normalizedPathname === '/vendor' || normalizedPathname === '/vendor/home'
              : normalizedPathname === item.path || normalizedPathname.startsWith(item.path + '/')

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center gap-1 flex-1 h-14 mx-1 rounded-none transition-all duration-200 ease-out',
                isActive
                  ? 'bg-yellow-400/10 text-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.2)]'
                  : 'text-yellow-400/70 hover:text-yellow-400 hover:bg-yellow-400/10'
              )}
            >
              {item.isBrand ? (
                <div
                  className={cn(
                    'md:hidden w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg font-serif transition-all duration-200',
                    isActive
                      ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                      : 'text-yellow-400'
                  )}
                >
                  IS
                </div>
              ) : (
                Icon && (
                  <div
                    className={cn(
                      'md:hidden w-8 h-8 rounded-full flex items-center justify-center transition-all',
                      isActive
                        ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.35)]'
                        : 'text-yellow-400/80'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                )
              )}
              <span
                className={cn(
                  'text-[11px] font-medium transition-colors duration-150',
                  isActive ? 'text-yellow-400' : 'text-yellow-400/80'
                )}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

