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
import { VendorAuth } from './module/vendor/vendor-pages/VendorAuth'
import { VendorHome } from './module/vendor/vendor-pages/VendorHome'
import { VendorWallet } from './module/vendor/vendor-pages/VendorWallet'
import { VendorBookings } from './module/vendor/vendor-pages/VendorBookings'
import { VendorBookingDetail } from './module/vendor/vendor-pages/VendorBookingDetail'
import { VendorAnalytics } from './module/vendor/vendor-pages/VendorAnalytics'
import { VendorProfile } from './module/vendor/vendor-pages/VendorProfile'
import { VendorSettings } from './module/vendor/vendor-pages/VendorSettings'
import { VendorNotifications } from './module/vendor/vendor-pages/VendorNotifications'
import { VendorTermsConditions } from './module/vendor/vendor-pages/VendorTermsConditions'
import { VendorPrivacyPolicy } from './module/vendor/vendor-pages/VendorPrivacyPolicy'
import { VendorServices } from './module/vendor/vendor-pages/VendorServices'
import { VendorCustomers } from './module/vendor/vendor-pages/VendorCustomers'
import { VendorReviews } from './module/vendor/vendor-pages/VendorReviews'
import { VendorSchedule } from './module/vendor/vendor-pages/VendorSchedule'
import { VendorCustomerDetail } from './module/vendor/vendor-pages/VendorCustomerDetail'
import { VendorNavbar } from './module/vendor/vendor-components/VendorNavbar'
import './App.css'

function AppContent() {
  const location = useLocation()
  const isProfilePage = location.pathname === '/profile'
  const isVendorRoute = location.pathname.startsWith('/vendor')
  const isVendorAuth = location.pathname === '/vendor/auth'

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* User Module Navigation */}
      {!isProfilePage && !isVendorRoute && (
        <>
          {/* Desktop top navigation */}
          <div className="hidden md:block sticky top-0 z-30">
            <BottomNav />
          </div>
          {/* Mobile bottom navigation */}
          <div className="block md:hidden fixed bottom-0 left-0 right-0 z-30">
            <BottomNav />
          </div>
        </>
      )}

      {/* Vendor Module Navigation */}
      {isVendorRoute && !isVendorAuth && (
        <>
          {/* Desktop top navigation */}
          <div className="hidden md:block sticky top-0 z-30">
            <VendorNavbar />
          </div>
          {/* Mobile bottom navigation */}
          <div className="block md:hidden fixed bottom-0 left-0 right-0 z-30">
            <VendorNavbar />
          </div>
        </>
      )}

      {/* Main content */}
      <div className="flex-1">
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/at-salon" element={<AtSalonPage />} />
          <Route path="/at-home" element={<AtHomePage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/spa" element={<SpaPage />} />
          <Route path="/refer-earn" element={<ReferEarnPage />} />
          <Route path="/refer-earn-details" element={<ReferEarnDetailsPage />} />
          <Route path="/shops/:salonId" element={<ShopDetailsPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Vendor Routes */}
          <Route path="/vendor/auth" element={<VendorAuth />} />
          <Route path="/vendor" element={<VendorHome />} />
          <Route path="/vendor/home" element={<VendorHome />} />
          <Route path="/vendor/wallet" element={<VendorWallet />} />
          <Route path="/vendor/bookings" element={<VendorBookings />} />
          <Route path="/vendor/bookings/:id" element={<VendorBookingDetail />} />
          <Route path="/vendor/analytics" element={<VendorAnalytics />} />
          <Route path="/vendor/services" element={<VendorServices />} />
          <Route path="/vendor/customers" element={<VendorCustomers />} />
          <Route path="/vendor/customers/:id" element={<VendorCustomerDetail />} />
          <Route path="/vendor/reviews" element={<VendorReviews />} />
          <Route path="/vendor/schedule" element={<VendorSchedule />} />
          <Route path="/vendor/profile" element={<VendorProfile />} />
          <Route path="/vendor/settings" element={<VendorSettings />} />
          <Route path="/vendor/notifications" element={<VendorNotifications />} />
          <Route path="/vendor/terms" element={<VendorTermsConditions />} />
          <Route path="/vendor/privacy" element={<VendorPrivacyPolicy />} />
        </Routes>
      </div>
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
