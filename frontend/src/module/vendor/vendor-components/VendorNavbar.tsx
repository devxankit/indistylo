import { Wallet, Calendar, BarChart3, User } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { transitions } from '@/lib/animations'
import { memo } from 'react'

const navItems = [
  { path: '/vendor', label: 'IndiStylo', isBrand: true },
  { path: '/vendor/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/vendor/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/vendor/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/vendor/profile', icon: User, label: 'Profile' },
]

// Memoized nav item component
const NavItem = memo(({ item, isActive }: { item: typeof navItems[0]; isActive: boolean }) => {
  const Icon = item.icon

  return (
    <Link
      to={item.path}
      className={cn(
        'flex flex-col items-center justify-center gap-1 flex-1 h-14 mx-1 rounded-none transition-all duration-200 ease-out min-w-[60px] min-h-[56px] touch-manipulation',
        isActive
          ? 'bg-yellow-400/10 text-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.2)]'
          : 'text-yellow-400/70 hover:text-yellow-400 hover:bg-yellow-400/10 active:scale-95'
      )}
    >
      {item.isBrand ? (
        <motion.div
          className={cn(
            'md:hidden w-8 h-8 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center font-bold text-lg font-serif transition-all duration-200',
            isActive
              ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.4)]'
              : 'text-yellow-400'
          )}
          animate={isActive ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
        >
          IS
        </motion.div>
      ) : (
        Icon && (
          <motion.div
            className={cn(
              'md:hidden w-8 h-8 min-w-[32px] min-h-[32px] rounded-full flex items-center justify-center transition-all',
              isActive
                ? 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.35)]'
                : 'text-yellow-400/80'
            )}
            animate={isActive ? { 
              scale: [1, 1.1, 1],
            } : {}}
            transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 2 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        )
      )}
      <motion.span
        className={cn(
          'text-[11px] font-medium transition-colors duration-150',
          isActive ? 'text-yellow-400' : 'text-yellow-400/80'
        )}
        animate={isActive ? { scale: [1, 1.05, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {item.label}
      </motion.span>
    </Link>
  )
});

NavItem.displayName = 'NavItem';

export function VendorNavbar() {
  const location = useLocation()
  const normalizedPathname = location.pathname.replace(/\/$/, '') || '/vendor'

  return (
    <nav
      className={cn(
        'fixed left-0 right-0 z-50 bg-card/95 backdrop-blur-sm safe-area-bottom',
        'bottom-0 md:bottom-auto md:top-0',
        'md:border-b border-border shadow-lg md:shadow-none'
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive =
            item.path === '/vendor'
              ? normalizedPathname === '/vendor' || normalizedPathname === '/vendor/home'
              : normalizedPathname === item.path || normalizedPathname.startsWith(item.path + '/')

          return (
            <NavItem key={item.path} item={item} isActive={isActive} />
          )
        })}
      </div>
    </nav>
  )
}

