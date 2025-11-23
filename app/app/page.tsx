"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Trophy, Target, TrendingUp, Users } from "lucide-react";

export default function AppPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  const checkAccess = async () => {
    try {
      // Check if user is authenticated
      const authResponse = await fetch("/api/auth/me");
      if (!authResponse.ok) {
        router.push("/");
        return;
      }

      const authData = await authResponse.json();
      
      // Check if user has paid
      const paymentsResponse = await fetch("/api/payment/check");
      if (!paymentsResponse.ok) {
        router.push("/");
        return;
      }

      const paymentsData = await paymentsResponse.json();
      
      if (paymentsData.hasPaid) {
        setHasAccess(true);
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Access check error:", error);
      router.push("/");
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Chiliz App
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome to the exclusive area</p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">
              ✓ Premium Access
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            🎉 Welcome to Your Dashboard!
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            You now have full access to all features. Let's get started!
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Challenges"
            description="Complete challenges and earn rewards"
            color="from-yellow-500 to-orange-500"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Shop"
            description="Browse exclusive items and collectibles"
            color="from-purple-500 to-pink-500"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Leaderboard"
            description="Compete with other players"
            color="from-blue-500 to-cyan-500"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Community"
            description="Connect with other members"
            color="from-green-500 to-emerald-500"
          />
          <FeatureCard
            icon={<Trophy className="w-8 h-8" />}
            title="Inventory"
            description="Manage your items and assets"
            color="from-red-500 to-pink-500"
          />
          <FeatureCard
            icon={<Target className="w-8 h-8" />}
            title="Profile"
            description="Customize your profile"
            color="from-indigo-500 to-purple-500"
          />
        </div>

        {/* Stats Section */}
        <Card className="p-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white">
          <h3 className="text-2xl font-bold mb-6">Your Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatItem label="Challenges Completed" value="0" />
            <StatItem label="Rewards Earned" value="0 CHZ" />
            <StatItem label="Rank" value="#—" />
            <StatItem label="Items Owned" value="0" />
          </div>
        </Card>
      </main>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  color: string;
}) {
  return (
    <Card className="p-6 hover:shadow-xl transition-all cursor-pointer group">
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
        <div className="text-white">{icon}</div>
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </Card>
  );
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-sm opacity-90">{label}</p>
    </div>
  );
}
