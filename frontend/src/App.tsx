import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { HomePage } from './module/user/pages/HomePage'
import { AtSalonPage } from './module/user/pages/AtSalonPage'
import { AtHomePage } from './module/user/pages/AtHomePage'
import { BookingsPage } from './module/user/pages/BookingsPage'
import { ReferEarnPage } from './module/user/pages/ReferEarnPage'
import { ReferEarnDetailsPage } from './module/user/pages/ReferEarnDetailsPage'
import { ShopDetailsPage } from './module/user/pages/ShopDetailsPage'
import { OrderSummaryPage } from './module/user/pages/OrderSummaryPage'
import { ProfilePage } from './module/user/pages/ProfilePage'
import { SpaPage } from './module/user/pages/SpaPage'
import { BottomNav } from './module/user/components/BottomNav'
import './App.css'

function AppContent() {
  const location = useLocation()
  const isProfilePage = location.pathname === '/profile'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Desktop top navigation */}
      {!isProfilePage && (
        <div className="hidden md:block sticky top-0 z-30">
          <BottomNav />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/at-salon" element={<AtSalonPage />} />
          <Route path="/at-home" element={<AtHomePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/spa" element={<SpaPage />} />
          <Route path="/refer-earn" element={<ReferEarnPage />} />
          <Route path="/refer-earn-details" element={<ReferEarnDetailsPage />} />
          <Route path="/shops/:salonId" element={<ShopDetailsPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>

      {/* Mobile bottom navigation */}
      {!isProfilePage && (
        <div className="block md:hidden fixed bottom-0 left-0 right-0 z-30">
          <BottomNav />
        </div>
      )}
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
