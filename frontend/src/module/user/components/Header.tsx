"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, ShoppingCart, Bell } from "lucide-react"
import { useUserStore } from "../store/useUserStore"
import { Button } from "@/components/ui/button"
import logo from "@/assets/logo.png"

export function Header() {
  const { location, cartCount, notificationsCount } = useUserStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`sticky top-[env(safe-area-inset-top)] md:top-16 z-40 transition-colors duration-300  ${
        isScrolled ? "bg-background border-b border-border/50" : "md:bg-transparent bg-background"
      }`}
    >
      <div className="w-full">
        <div className="w-full px-4 sm:px-5 md:px-6 py-2.5 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 min-w-0 w-full">
            {/* Left - Logo & Location */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <img 
                  src={logo} 
                  alt="Logo"     
                  className="w-8 h-8 md:w-14 md:h-14 object-contain"
                />

              <div className="flex flex-col min-w-0">
                <Button
                  variant="outline"
                  className="h-auto m-0 !bg-transparent p-0 gap-1 text-muted-foreground text-[12px] sm:text-base font-medium leading-tight  truncate"
                >
                  <span className="truncate max-w-[46vw] sm:max-w-[280px]">
                    {location}
                  </span>
                  <ChevronDown className="size-3.5 sm:size-4 shrink-0" />
                </Button>
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0 ml-auto">
              {/* Cart */}
              <Button
                variant="ghost"
                className="relative h-10 w-10 sm:h-10 sm:w-10 md:h-11 md:w-11 hover:opacity-90 text-foreground/80 hover:text-yellow-400"
                aria-label="Open cart"
              >
                <ShoppingCart className="size-5 sm:size-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-gray-900 text-[10px] sm:text-[11px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                className="relative h-10 w-10 sm:h-10 sm:w-10 md:h-11 md:w-11 hover:opacity-90 text-foreground/80 hover:text-yellow-400"
                aria-label="Open notifications"
              >
                <Bell className="size-5 sm:size-6" />
                {notificationsCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-gray-900 text-[10px] sm:text-[11px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold leading-none">
                    {notificationsCount > 99 ? "99+" : notificationsCount}
                  </span>
                )}
              </Button>

              {/* Profile Icon */}
              <button
                onClick={() => navigate('/profile')}
                className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-400 flex items-center justify-center shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
                aria-label="Open profile"
              >
                <span className="text-base sm:text-lg">👤</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
