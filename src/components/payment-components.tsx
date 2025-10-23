'use client';

import { useArisanContracts, useGroupData, useMemberData } from './smart-contract-integration';
import { formatUnits } from 'viem';
import { 
  DollarSign, 
  Shield, 
  Clock, 
  CheckCircle,  
  AlertCircle,
  Coins,
  CreditCard,
  TrendingUp,
  Users,
  Trophy
} from 'lucide-react';

interface PaymentStatusProps {
  groupAddress: string;
}

export function PaymentStatus({ groupAddress }: PaymentStatusProps) {
  const { groupStats, paymentStatus } = useGroupData(groupAddress);
  const { address } = useArisanContracts();

  if (!groupStats || !paymentStatus) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const paidMembers = paymentStatus[1].filter(Boolean).length;
  const totalMembers = paymentStatus[0].length;
  const paymentProgress = (paidMembers / totalMembers) * 100;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Payment Status
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Round {groupStats[0]}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {paidMembers}/{totalMembers} members paid
          </span>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {paymentProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${paymentProgress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Total Pot: {formatUnits(groupStats[2], 6)} USDC
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-orange-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Round {groupStats[0]}/{groupStats[1]}
          </span>
        </div>
      </div>
    </div>
  );
}

interface PaymentButtonProps {
  groupAddress: string;
  onSuccess?: () => void;
}

export function PaymentButton({ groupAddress, onSuccess }: PaymentButtonProps) {
  const { payInstallment, isPending, isConfirming, isConfirmed, error } = useArisanContracts();
  const { groupStats } = useGroupData(groupAddress);
  const { address } = useArisanContracts();
  const { memberInfo } = useMemberData(groupAddress, address || '');

  const handlePayment = async () => {
    try {
      await payInstallment(groupAddress);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Payment failed:', err);
    }
  };

  if (!memberInfo) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Loading member information...
        </p>
      </div>
    );
  }

  const hasPaid = memberInfo.hasPaidCurrentRound;
  const isMember = memberInfo.isMember;

  if (!isMember) {
    return (
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-sm text-yellow-700 dark:text-yellow-300">
            You are not a member of this group
          </span>
        </div>
      </div>
    );
  }

  if (hasPaid) {
    return (
      <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-sm text-green-700 dark:text-green-300">
            Payment completed for this round
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Make Payment
        </h3>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {groupStats ? formatUnits(groupStats[2], 6) : '0'} USDC
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Security deposit: {formatUnits(memberInfo.securityDeposits, 6)} USDC
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <CreditCard className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Credit score: {memberInfo.creditScore}
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
          {error.message}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isPending || isConfirming}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing...</span>
          </>
        ) : isConfirming ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Confirming...</span>
          </>
        ) : isConfirmed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Payment Successful!</span>
          </>
        ) : (
          <>
            <DollarSign className="w-4 h-4" />
            <span>Pay Installment</span>
          </>
        )}
      </button>
    </div>
  );
}

interface WinnerDrawProps {
  groupAddress: string;
  onSuccess?: () => void;
}

export function WinnerDraw({ groupAddress, onSuccess }: WinnerDrawProps) {
  const { drawWinner, isPending, isConfirming, isConfirmed, error } = useArisanContracts();
  const { groupStats, paymentStatus } = useGroupData(groupAddress);

  const handleDrawWinner = async () => {
    try {
      await drawWinner(groupAddress);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Draw winner failed:', err);
    }
  };

  if (!groupStats || !paymentStatus) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const paidMembers = paymentStatus[1].filter(Boolean).length;
  const totalMembers = paymentStatus[0].length;
  const canDraw = paidMembers === totalMembers;

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Draw Winner
        </h3>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Round {groupStats[0]}
          </span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <Users className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {paidMembers}/{totalMembers} members paid
          </span>
        </div>
        <div className="flex items-center space-x-2 mb-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Pot: {formatUnits(groupStats[2], 6)} USDC
          </span>
        </div>
      </div>

      {!canDraw && (
        <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">
              All members must pay before drawing winner
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
          {error.message}
        </div>
      )}

      <button
        onClick={handleDrawWinner}
        disabled={!canDraw || isPending || isConfirming}
        className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Drawing...</span>
          </>
        ) : isConfirming ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Confirming...</span>
          </>
        ) : isConfirmed ? (
          <>
            <CheckCircle className="w-4 h-4" />
            <span>Winner Drawn!</span>
          </>
        ) : (
          <>
            <Trophy className="w-4 h-4" />
            <span>Draw Winner</span>
          </>
        )}
      </button>
    </div>
  );
}

interface USDCBalanceProps {
  onGetUSDC?: () => void;
}

export function USDCBalance({ onGetUSDC }: USDCBalanceProps) {
  const { usdcBalance, getUSDC, isPending, error } = useArisanContracts();

  const handleGetUSDC = async () => {
    try {
      await getUSDC();
      if (onGetUSDC) onGetUSDC();
    } catch (err) {
      console.error('Get USDC failed:', err);
    }
  };

  return (
    <div className="p-4 bg-[#252525] rounded-xl border border-[#A57B00]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          USDC Balance
        </h3>
        <div className="flex items-center space-x-2">
          <Coins className="w-5 h-5 text-white" />
          <span className="text-sm font-medium text-white">
            {parseFloat(usdcBalance).toLocaleString()} USDC
          </span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg mb-4">
          {error.message}
        </div>
      )}

      <button
        onClick={handleGetUSDC}
        disabled={isPending}
        className="w-full px-4 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
      >
        {isPending ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Getting USDC...</span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4" />
            <span>Get Test USDC</span>
          </>
        )}
      </button>
    </div>
  );
}
