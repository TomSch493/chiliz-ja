"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useWalletAuth } from "@/hooks/useWalletAuth";
import { useNativeChzPayment } from "@/hooks/useNativeChzPayment";
import { Loader2, Wallet, DollarSign, CheckCircle2, AlertCircle } from "lucide-react";

type Step = 1 | 2 | 3;

export function OnboardingFlow() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { 
    address, 
    isConnecting, 
    connect, 
    disconnect,
    isAuthenticated 
  } = useWalletAuth();

  const {
    pay,
    isPaying,
    paymentStatus,
    balance,
    isLoadingBalance,
    fetchBalance,
  } = useNativeChzPayment(address); // Pass authenticated address to native payment hook

  // Étape 1 → Étape 2 automatiquement après connexion
  useEffect(() => {
    if (address && isAuthenticated && currentStep === 1) {
      setCurrentStep(2);
    }
  }, [address, isAuthenticated, currentStep]);

  // Étape 2 → Étape 3 automatiquement après paiement réussi
  useEffect(() => {
    if (paymentStatus === "confirmed" && currentStep === 2) {
      setCurrentStep(3);
      // Redirection après 2 secondes
      setTimeout(() => {
        router.push("/app");
      }, 2000);
    }
  }, [paymentStatus, currentStep, router]);

  // Fetch balance when entering step 2
  useEffect(() => {
    if (currentStep === 2 && address && fetchBalance) {
      fetchBalance();
    }
  }, [currentStep, address, fetchBalance]);

  const handleConnectWallet = async () => {
    try {
      setError(null);
      setIsProcessing(true);
      await connect();
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePay = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // No approval needed for native CHZ! Just send the payment
      console.log("Processing native CHZ payment...");
      await pay();

    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 p-4">
      <Card className="w-full max-w-2xl p-8 shadow-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <StepIndicator number={1} label="Connect" active={currentStep === 1} completed={currentStep > 1} />
            <div className={`flex-1 h-1 mx-2 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <StepIndicator number={2} label="Pay" active={currentStep === 2} completed={currentStep > 2} />
            <div className={`flex-1 h-1 mx-2 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'}`} />
            <StepIndicator number={3} label="Done" active={currentStep === 3} completed={false} />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">Error</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Step 1: Connect Wallet */}
        {currentStep === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome to Chiliz App
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Connect your MetaMask wallet to get started
            </p>

            {!address ? (
              <button
                onClick={handleConnectWallet}
                disabled={isConnecting || isProcessing}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isConnecting || isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Connect MetaMask
                  </span>
                )}
              </button>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-700 dark:text-green-300 font-medium">
                  Connected: {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}

            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              Make sure MetaMask is on Chiliz Spicy Testnet (Chain ID: 88882)
            </p>
            <p className="mt-2 text-xs text-blue-500 dark:text-blue-400">
              Need testnet CHZ? Get free tokens at{" "}
              <a 
                href="https://spicy-faucet.chiliz.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="underline hover:text-blue-600"
              >
                Chiliz Faucet
              </a>
            </p>
          </div>
        )}

        {/* Step 2: Pay 1 CHZ */}
        {currentStep === 2 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <DollarSign className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pay to Access
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-2 text-lg">
              One-time payment to unlock full access
            </p>
            <p className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
              1 CHZ
              <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-2">
                (~$0.10 USD)
              </span>
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-700 dark:text-blue-300 mb-2 font-medium">
                💡 How it works:
              </p>
              <ul className="text-xs text-blue-600 dark:text-blue-400 text-left space-y-1">
                <li>• Pay with native CHZ (no tokens needed!)</li>
                <li>• 80% goes to wallet 1 (0x133e...042e)</li>
                <li>• 20% goes to wallet 2 (0x133e...042f)</li>
                <li>• Payment is instant via smart contract</li>
              </ul>
            </div>

            {address && (
              <>
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Wallet</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {address.slice(0, 10)}...{address.slice(-8)}
                  </p>
                </div>

                {/* Balance Display */}
                <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Your Balance</p>
                      {isLoadingBalance ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
                        </div>
                      ) : balance !== null ? (
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {balance} <span className="text-sm font-normal text-gray-500">CHZ</span>
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Unable to load</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Required</p>
                      <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                        1.00 CHZ
                      </p>
                    </div>
                  </div>
                  
                  {/* Warning if insufficient balance */}
                  {balance !== null && parseFloat(balance) < 1 && (
                    <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mb-2">
                        <AlertCircle className="w-3 h-3" />
                        Insufficient balance. You need at least 1 CHZ to proceed.
                      </p>
                      <div className="text-xs bg-blue-50 dark:bg-blue-900/30 p-2 rounded border border-blue-200 dark:border-blue-800">
                        <p className="text-blue-700 dark:text-blue-300 font-medium mb-1">
                          💰 You need native CHZ
                        </p>
                        <p className="text-blue-600 dark:text-blue-400">
                          • Get testnet CHZ from the faucet
                        </p>
                        <p className="text-blue-600 dark:text-blue-400 mt-1">
                          💡{" "}
                          <a 
                            href="https://spicy-faucet.chiliz.com" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-700 font-medium"
                          >
                            Get free testnet CHZ here
                          </a>
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {/* Success indicator if sufficient balance */}
                  {balance !== null && parseFloat(balance) >= 1 && (
                    <div className="mt-3 pt-3 border-t border-purple-200 dark:border-purple-800">
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Sufficient balance to proceed ✅
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}

            <button
              onClick={handlePay}
              disabled={isPaying || isProcessing || paymentStatus === "confirming"}
              className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isPaying || isProcessing || paymentStatus === "confirming" ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Payment...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pay 1 CHZ (Native)
                </span>
              )}
            </button>

            <button
              onClick={() => {
                disconnect();
                setCurrentStep(1);
              }}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Disconnect & go back
            </button>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Welcome to the app! Redirecting...
            </p>

            <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Redirecting to app...</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

// Step Indicator Component
function StepIndicator({ 
  number, 
  label, 
  active, 
  completed 
}: { 
  number: number; 
  label: string; 
  active: boolean; 
  completed: boolean;
}) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
          completed
            ? "bg-green-500 text-white"
            : active
            ? "bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800"
            : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        }`}
      >
        {completed ? <CheckCircle2 className="w-5 h-5" /> : number}
      </div>
      <span
        className={`text-xs mt-2 font-medium ${
          active || completed
            ? "text-gray-900 dark:text-white"
            : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {label}
      </span>
    </div>
  );
}
