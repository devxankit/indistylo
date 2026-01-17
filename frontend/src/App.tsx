import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { Toaster } from "sonner";
import { HomePage } from "./module/user/pages/HomePage";
import { AtSalonPage } from "./module/user/pages/AtSalonPage";
import { AtHomePage } from "./module/user/pages/AtHomePage";
import { BookingsPage } from "./module/user/pages/BookingsPage";
import { ReferEarnPage } from "./module/user/pages/ReferEarnPage";
import { ReferEarnDetailsPage } from "./module/user/pages/ReferEarnDetailsPage";
import { ShopDetailsPage } from "./module/user/pages/ShopDetailsPage";
import { OrderSummaryPage } from "./module/user/pages/OrderSummaryPage";
import { ProfilePage } from "./module/user/pages/ProfilePage";
import { SpaPage } from "./module/user/pages/SpaPage";
import { UserReviewsPage } from "./module/user/pages/UserReviewsPage";
import { UserOffersPage } from "./module/user/pages/UserOffersPage";
import { NotificationsPage } from "./module/user/pages/NotificationsPage";
import { SettingsPage } from "./module/user/pages/SettingsPage";
import { BottomNav } from "./module/user/components/BottomNav";
import { VendorAuth } from "./module/vendor/vendor-pages/VendorAuth";
import { VendorHome } from "./module/vendor/vendor-pages/VendorHome";
import { VendorWallet } from "./module/vendor/vendor-pages/VendorWallet";
import { VendorBookings } from "./module/vendor/vendor-pages/VendorBookings";
import { VendorBookingDetail } from "./module/vendor/vendor-pages/VendorBookingDetail";
import { VendorAnalytics } from "./module/vendor/vendor-pages/VendorAnalytics";
import { VendorProfile } from "./module/vendor/vendor-pages/VendorProfile";
import { VendorSettings } from "./module/vendor/vendor-pages/VendorSettings";
import { VendorNotifications } from "./module/vendor/vendor-pages/VendorNotifications";
import { VendorTermsConditions } from "./module/vendor/vendor-pages/VendorTermsConditions";
import { VendorPrivacyPolicy } from "./module/vendor/vendor-pages/VendorPrivacyPolicy";
import { VendorServices } from "./module/vendor/vendor-pages/VendorServices";
import { VendorCustomers } from "./module/vendor/vendor-pages/VendorCustomers";
import { VendorReviews } from "./module/vendor/vendor-pages/VendorReviews";
import { VendorSchedule } from "./module/vendor/vendor-pages/VendorSchedule";
import { VendorCustomerDetail } from "./module/vendor/vendor-pages/VendorCustomerDetail";
import { VendorPackages } from "./module/vendor/vendor-pages/VendorPackages";
import { VendorProfessionals } from "./module/vendor/vendor-pages/VendorProfessionals";
import { CreatePackage } from "./module/vendor/vendor-pages/CreatePackage";
import VendorPendingVerification from "./module/vendor/vendor-pages/VendorPendingVerification";
import { UserAuth } from "./module/user/pages/UserAuth";
import { VendorNavbar } from "./module/vendor/vendor-components/VendorNavbar";
import { ProtectedVendorRoute } from "./module/vendor/vendor-components/ProtectedVendorRoute";
import { AdminAuth } from "./module/admin/pages/AdminAuth";
import { AdminLayout } from "./module/admin/components/AdminLayout";
import { AdminDashboard } from "./module/admin/pages/AdminDashboard";
import { VendorManagement } from "./module/admin/pages/VendorManagement";
import { VendorDetails } from "./module/admin/pages/VendorDetails";
import { UserManagement } from "./module/admin/pages/UserManagement";
import { BookingManagement } from "./module/admin/pages/BookingManagement";
import { FinanceManagement } from "./module/admin/pages/FinanceManagement";
import { ContentManagement } from "./module/admin/pages/ContentManagement";
import { CategoryManagement } from "./module/admin/pages/CategoryManagement";
import { AdminSettings } from "./module/admin/pages/AdminSettings";
import { useEffect } from "react";
import { useContentStore } from "./module/admin/store/useContentStore";
import { PayoutsPage } from "./module/admin/pages/PayoutsPage";
import { CommissionLogsPage } from "./module/admin/pages/CommissionLogsPage";
import "./App.css";

function AppContent() {
  const { fetchContent } = useContentStore();
  const location = useLocation();

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);
  const isProfilePage = location.pathname === "/profile";
  const isAuthPage = location.pathname === "/auth";
  const isOrderSummaryPage = location.pathname === "/order-summary";
  const isVendorRoute = location.pathname.startsWith("/vendor");
  const isVendorAuth = location.pathname === "/vendor/auth";
  const isVendorVerification =
    location.pathname === "/vendor/verification-pending";
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* User Module Navigation */}
      {!isProfilePage &&
        !isAuthPage &&
        !isOrderSummaryPage &&
        !isVendorRoute &&
        !isAdminRoute && (
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
      {isVendorRoute && !isVendorAuth && !isVendorVerification && (
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
          <Route
            path="/refer-earn-details"
            element={<ReferEarnDetailsPage />}
          />
          <Route path="/shops/:salonId" element={<ShopDetailsPage />} />
          <Route path="/order-summary" element={<OrderSummaryPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* Removed UserOrdersPage and route */}
          <Route path="/reviews" element={<UserReviewsPage />} />
          <Route path="/offers" element={<UserOffersPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auth" element={<UserAuth />} />

          {/* Vendor Routes */}
          <Route path="/vendor/auth" element={<VendorAuth />} />
          {/* Vendor Protected Routes */}
          <Route element={<ProtectedVendorRoute />}>
            <Route path="/vendor" element={<VendorHome />} />
            <Route path="/vendor/home" element={<VendorHome />} />
            <Route path="/vendor/wallet" element={<VendorWallet />} />
            <Route path="/vendor/bookings" element={<VendorBookings />} />
            <Route
              path="/vendor/bookings/:id"
              element={<VendorBookingDetail />}
            />
            <Route path="/vendor/analytics" element={<VendorAnalytics />} />
            <Route path="/vendor/services" element={<VendorServices />} />
            <Route path="/vendor/packages" element={<VendorPackages />} />
            <Route path="/vendor/packages/create" element={<CreatePackage />} />
            <Route path="/vendor/customers" element={<VendorCustomers />} />
            <Route
              path="/vendor/customers/:id"
              element={<VendorCustomerDetail />}
            />
            <Route path="/vendor/reviews" element={<VendorReviews />} />
            <Route path="/vendor/professionals" element={<VendorProfessionals />} />
            <Route path="/vendor/schedule" element={<VendorSchedule />} />
            <Route path="/vendor/profile" element={<VendorProfile />} />
            <Route path="/vendor/settings" element={<VendorSettings />} />
            <Route
              path="/vendor/notifications"
              element={<VendorNotifications />}
            />
          </Route>

          <Route path="/vendor/terms" element={<VendorTermsConditions />} />
          <Route path="/vendor/privacy" element={<VendorPrivacyPolicy />} />
          <Route
            path="/vendor/verification-pending"
            element={<VendorPendingVerification />}
          />

          {/* Admin Routes */}
          <Route path="/admin/auth" element={<AdminAuth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="vendors/pending" element={<VendorManagement />} />
            <Route path="vendors/active" element={<VendorManagement />} />
            <Route
              path="vendors"
              element={<Navigate to="/admin/vendors/active" replace />}
            />
            <Route path="vendors/:id" element={<VendorDetails />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="finance" element={<FinanceManagement />} />
            <Route path="finance/payouts" element={<PayoutsPage />} />
            <Route path="finance/commission-logs" element={<CommissionLogsPage />} />
            <Route path="salon-categories" element={<CategoryManagement type="SALON" />} />
            <Route path="spa-categories" element={<CategoryManagement type="SPA" />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
