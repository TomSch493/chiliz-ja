"use client";

import { useEffect, useState } from "react";
import { Loader2, Sword, Trophy, User, LogOut } from "lucide-react";
import { OnboardingFlow } from "@/components/onboarding-flow";
import LeaderboardPage from "@/components/leaderboard-page";
import InventoryPage from "@/components/inventory-page";
import ChallengesPage from "@/components/challenges-page";
import ProfilePage from "@/components/profile-page";

export default function HomePage() {
  const [isChecking, setIsChecking] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activePage, setActivePage] = useState("leaderboard");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      console.log("🔍 Checking login status...");
      
      const response = await fetch("/api/auth/status", {
        credentials: 'include',
        cache: 'no-store',
      });
      
      if (!response.ok) {
        console.log("❌ Status check failed");
        setIsLoggedIn(false);
        setIsChecking(false);
        return;
      }

      const data = await response.json();
      console.log("📊 Login status:", data);
      
      setIsLoggedIn(data.isLoggedIn || false);
      setIsChecking(false);
    } catch (error) {
      console.error("❌ Error checking login status:", error);
      setIsLoggedIn(false);
      setIsChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      console.log("🔓 Logging out...");

      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("✅ Logged out successfully");
        // Reload page to show login screen
        window.location.href = "/";
      } else {
        console.error("❌ Logout failed");
        // Still reload to be safe
        window.location.href = "/";
      }
    } catch (error) {
      console.error("❌ Logout error:", error);
      // Force reload anyway
      window.location.href = "/";
    }
  };

  const renderPage = () => {
    switch (activePage) {
      case "leaderboard":
        return <LeaderboardPage />;
      case "inventory":
        return <InventoryPage />;
      case "challenges":
        return <ChallengesPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <LeaderboardPage />;
    }
  };

  // Show loading screen while checking
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Checking login status...</p>
        </div>
      </div>
    );
  }

  // Show login/payment flow if not logged in
  if (!isLoggedIn) {
    return <OnboardingFlow />;
  }

  // Show main JA app after successful login
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Mobile App Container */}
      <div className="flex-1 max-w-md mx-auto w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 shadow-lg overflow-hidden flex flex-col">
        {/* Header with Logout Button */}
        <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
          <div className="flex justify-between items-center px-4 py-3">
            <div>
              <h1 className="text-lg font-bold text-white">FidelyCheck</h1>
              <p className="text-xs text-slate-400">Web3 Loyalty Platform</p>
            </div>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto pb-20">{renderPage()}</div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 max-w-md w-full shadow-2xl">
          <div className="flex justify-around items-center py-3 px-2 bg-slate-900">
            <NavButton
              icon={<Trophy size={24} />}
              label="Leaderboard"
              isActive={activePage === "leaderboard"}
              onClick={() => setActivePage("leaderboard")}
            />
            <NavButton
              icon={<Sword size={24} />}
              label="My Memories"
              isActive={activePage === "inventory"}
              onClick={() => setActivePage("inventory")}
            />
            <NavButton
              icon={<Trophy size={24} />}
              label="Challenges"
              isActive={activePage === "challenges"}
              onClick={() => setActivePage("challenges")}
            />
            <NavButton
              icon={<User size={24} />}
              label="Profile"
              isActive={activePage === "profile"}
              onClick={() => setActivePage("profile")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, isActive, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all ${
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
