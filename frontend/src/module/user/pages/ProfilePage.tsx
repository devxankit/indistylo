import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  Phone,
  Pencil,
  Bell,
  MapPin,
  Heart,
  Percent,
  Users,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useProfileStore,
  type ServicePreference,
} from "../store/useProfileStore";
import { useUserStore } from "../store/useUserStore";
import { useRef, useEffect, useState } from "react";

import { ConfirmationDialog } from "@/components/common/ConfirmationDialog";
import { AddressDialog } from "../components/AddressDialog";

export function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    membershipId,
    avatarUrl,
    servicePreference,
    setAvatarUrl,
    setServicePreference,
  } = useProfileStore();
  const {
    name,
    setName,
    notificationsCount,
    points,
    isLoggedIn,
    userPhone,
    logout,
  } = useUserStore();

  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(name);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth", { state: { from: location } });
    }
  }, [isLoggedIn, navigate, location]);

  const formatPoints = (points: number) => {
    if (points >= 1000) {
      return `${(points / 1000).toFixed(points >= 995 ? 0 : 1)}k`;
    }
    return points.toString();
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleServicePreferenceChange = (preference: ServicePreference) => {
    setServicePreference(preference);
  };

  const handleNotificationsClick = () => {
    navigate("/notifications");
  };

  // handleEcomOrderClick removed

  // ... removed unused Settings import and handleSettingsClick ...

  const handleSaveName = () => {
    setName(tempName);
    setIsEditingName(false);
    toast.success("Profile updated successfully");
  };

  const handleMyProfileClick = () => {
    // Already on profile page, could open edit dialog or focus name edit
    setIsEditingName(true);
  };

  const handleManageAddressClick = () => {
    setIsAddressDialogOpen(true);
  };

  const handleMyReviewsClick = () => {
    navigate("/reviews");
  };

  const handleOffersDealsClick = () => {
    navigate("/offers");
  };

  const handleReferEarnClick = () => {
    navigate("/refer-earn");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h4 className="text-md font-semibold text-foreground text-left">
            My Profile
          </h4>
          <button
            onClick={() => navigate("/refer-earn-details")}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full border-2 border-yellow-400 flex items-center justify-center bg-transparent hover:bg-yellow-400/10 cursor-pointer transition-colors"
            aria-label={`Points: ${points}`}>
            <span className="text-[10px] sm:text-[11px] font-bold text-yellow-400 leading-none">
              {formatPoints(points)}
            </span>
          </button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Section */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl sm:text-4xl">👤</span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-900 border-2 border-background flex items-center justify-center hover:bg-gray-800 transition-colors">
              <Pencil className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 pt-2">
            <div className="flex items-center justify-between mb-1">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="flex-1 bg-muted border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveName}
                    className="h-8 px-2 bg-yellow-400 text-gray-900 hover:bg-yellow-500">
                    Save
                  </Button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 group cursor-pointer"
                  onClick={() => setIsEditingName(true)}>
                  <h3 className="text-lg font-bold text-foreground">
                    {name || "Set Name"}
                  </h3>
                  <Pencil className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-base sm:text-lg text-foreground">
                {userPhone}
              </span>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground text-left">
              Membership Id : {membershipId}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-3 bg-card hover:bg-muted/50"
            onClick={handleNotificationsClick}>
            <div className="relative">
              <Bell className="h-5 w-5" />
              {notificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-[10px] rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold">
                  {notificationsCount > 99 ? "99+" : notificationsCount}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm">Notifications</span>
          </Button>
          {/* E-com Order Button Removed */}
          <Button
            variant="outline"
            className="flex flex-col items-center gap-2 h-auto py-3 bg-card hover:bg-muted/50"
            onClick={() => setIsLogoutDialogOpen(true)}>
            <LogOut className="h-5 w-5 text-destructive" />
            <span className="text-xs sm:text-sm text-destructive">Logout</span>
          </Button>
        </div>

        {/* Logout Confirmation Dialog */}
        <ConfirmationDialog
          open={isLogoutDialogOpen}
          onOpenChange={setIsLogoutDialogOpen}
          onConfirm={() => {
            logout();
            toast.success("Logged out successfully");
          }}
          title="Logout"
          description="Are you sure you want to logout from your account?"
          variant="destructive"
          confirmText="Logout"
        />

        <AddressDialog
          open={isAddressDialogOpen}
          onOpenChange={setIsAddressDialogOpen}
        />

        {/* Service Preference */}
        <div className="space-y-3">
          <h2 className="text-md text-left px-4 sm:text-lg text-left font-semibold text-foreground">
            Choose Service Preference
          </h2>
          <div className="flex gap-4 text-center align-center justify-around">
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="servicePreference"
                  value="at-salon"
                  checked={servicePreference === "at-salon"}
                  onChange={() => handleServicePreferenceChange("at-salon")}
                  className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 checked:border-yellow-400 checked:bg-yellow-400 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-background transition-all"
                />
                {servicePreference === "at-salon" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <span className="text-sm sm:text-base text-foreground">
                At Salon
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  name="servicePreference"
                  value="at-home"
                  checked={servicePreference === "at-home"}
                  onChange={() => handleServicePreferenceChange("at-home")}
                  className="w-5 h-5 appearance-none rounded-full border-2 border-gray-400 checked:border-yellow-400 checked:bg-yellow-400 relative focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-background transition-all"
                />
                {servicePreference === "at-home" && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
              <span className="text-sm sm:text-base text-foreground">
                At Home
              </span>
            </label>
          </div>
        </div>

        {/* My Account */}
        <div className="space-y-3 text-left">
          <h2 className="text-md px-4 sm:text-lg text-left font-semibold text-foreground">
            My Account
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-muted/50"
              onClick={handleMyProfileClick}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-base">👤</span>
                </div>
                <span className="text-sm sm:text-base">My Profile</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-muted/50"
              onClick={handleManageAddressClick}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span className="text-sm sm:text-base">Manage Address</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-muted/50"
              onClick={handleMyReviewsClick}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm sm:text-base">My Reviews</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>

        {/* My Offer */}
        <div className="space-y-3 text-left ">
          <h2 className="text-md px-4 sm:text-lg text-left font-semibold text-foreground">
            My Offer
          </h2>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-muted/50"
              onClick={handleOffersDealsClick}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Percent className="h-4 w-4" />
                </div>
                <span className="text-sm sm:text-base">Offers & Deals</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
            <Button
              variant="outline"
              className="w-full justify-between h-auto py-3 px-4 bg-card hover:bg-muted/50"
              onClick={handleReferEarnClick}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-4 w-4" />
                </div>
                <span className="text-sm sm:text-base">Refer & Earn</span>
              </div>
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
