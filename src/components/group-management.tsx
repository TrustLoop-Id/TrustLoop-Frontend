'use client';

import { useState } from 'react';
import { useArisanContracts, useGroupData } from './smart-contract-integration';
import { 
  Users, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  XCircle,
  Plus,
  Coins,
  Trophy
} from 'lucide-react';

interface GroupCardProps {
  groupAddress: string;
  onJoin?: () => void;
  onView?: () => void;
}

export function GroupCard({ groupAddress, onJoin, onView }: GroupCardProps) {
  const { groupStats, members, maxMembers, groupName,  installmentAmount} = useGroupData(groupAddress);
  const { address} = useArisanContracts();

  if (!groupStats) {
    return (
      <div className="px-5 py-4 bg-gray-800 border border-gray-700 animate-pulse rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-[#2E2E2E] rounded-lg"></div>
          <div className="flex-1">
            <div className="h-5 bg-[#2E2E2E] rounded w-1/3 mb-3"></div>
            <div className="h-4 bg-[#2E2E2E] rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const isMember = address ? members.includes(address) : false;
  const isGroupFull = members.length >= Number(maxMembers);
  const isGroupActive = groupStats[4];

  const calculateReturn = () => {
  const monthlyRate = 0.03 / 12; // 5% APY per tahun
  const avgBalanceFactor = 0.5;  // rata-rata saldo di vault
  const months = Number(maxMembers); // total bulan = jumlah member
  const returnPercent = monthlyRate * months * avgBalanceFactor * 100;
  return returnPercent.toFixed(2);
};

  return (
    <div 
      onClick={onView}
      className={`px-6 py-5 bg-[#252525] border border-[#A57B00] hover:bg-[#A57B00]/30 transition-all rounded-lg ${onView ? 'cursor-pointer' : ''}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-12 h-12 bg-gradient-to-br from-[#7A5E00] to-[#D4AF37] rounded-lg flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-white truncate">
              {groupName || `Group #${groupAddress.slice(0, 8)}...`}
            </h3>
            <div className="flex items-center space-x-6 mt-2">
              <span className="text-base text-white">
                {members.length}/{maxMembers} members
              </span>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-400">Monthly:</span>
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-lg font-semibold text-white">
                  {installmentAmount}  
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm text-gray-400">Deposit:</span>
                <DollarSign className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-lg font-semibold text-white">
                  {installmentAmount} 
                </span>
              </div>
              <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-sm font-medium border border-[#D4AF37]/30">
                {calculateReturn()}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isMember ? (
            <span className="px-3 py-1 bg-gray-500/30 text-white rounded-full text-sm font-medium">
              Joined
            </span>
          ) : isGroupFull ? (
            <span className="px-3 py-1 bg-red-700/30 text-red-300 rounded-full text-sm font-medium">
              Full
            </span>
          ) : (
            <span className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm font-medium">
              Available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function CreateGroupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { createGroup, isPending, error } = useArisanContracts();
  const [formData, setFormData] = useState({
    groupName: '',
    installmentAmount: 50,
    securityDepositAmount: 50,
    maxMembers: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('handleSubmit triggered');
    console.log('Form Data:', formData);
    try {
      await createGroup(
        formData.groupName,
        formData.installmentAmount,
        formData.securityDepositAmount,
        formData.maxMembers
      );
      onClose();
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              className="w-full px-3 py-2 border border-white rounded-lg bg-[#252525] focus:bg-[#2E2E2E] focus:text-white"
              placeholder="Enter group name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium :text-white mb-2">
              Monthly Contribution (USDC)
            </label>
            <input
              type="number"
              value={formData.installmentAmount}
              onChange={(e) => setFormData({ ...formData, installmentAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-white rounded-lg bg-[#252525] focus:bg-[#2E2E2E] text-white"
              min="10"
              max="10000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Security Deposit (USDC)
            </label>
            <input
              type="number"
              value={formData.securityDepositAmount}
              onChange={(e) => setFormData({ ...formData, securityDepositAmount: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-white rounded-lg bg-[#252525] focus:bg-[#2E2E2E] text-white"
              min="10"
              max="10000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Members
            </label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-white rounded-lg bg-[#252525] focus:bg-[#2E2E2E] text-white"
              min="2"
              max="24"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 text-red-300 rounded-lg">
              {error.message}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-white hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-6 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Group</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function GroupDetails({ isOpen, groupAddress, onClose }: { isOpen: boolean; groupAddress: string; onClose: () => void }) {
  const { groupStats, members, paymentStatus, maxMembers, groupName, currentRoundWinner, contractUSDCBalance,installmentAmount, securityDepositAmount } = useGroupData(groupAddress);
  const { address, payInstallment, drawWinner, joinGroup, approveUSDCMax } = useArisanContracts();
  const [isPaying, setIsPaying] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  if (!groupStats) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-2xl">
          <div className="animate-pulse">
            <div className="bg-[#2E2E2E] rounded mb-4"></div>
            <div className="bg-[#2E2E2E] rounded mb-2"></div>
            <div className="bg-[#2E2E2E] rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  const isMember = address ? members.includes(address) : false;
  const paidMembers = paymentStatus ? paymentStatus[1].filter(Boolean).length : 0;
  const isGroupActive = groupStats[4];
  const isGroupFull = members.length >= maxMembers;

  const userHasPaid = (() => {
    if (!address || !paymentStatus) return false;
    const idx = paymentStatus[0].findIndex((a: string) => a.toLowerCase() === address.toLowerCase());
    return idx >= 0 ? Boolean(paymentStatus[1][idx]) : false;
  })();

  // Check if all members have paid
  const allMembersPaid = paymentStatus ? paymentStatus[1].every(Boolean) : false;
  
  // Check if current round is not completed
  const isRoundCompleted = groupStats ? Boolean(groupStats[6]) : false; // forfeitedFunds indicates completion
  
  // Check if it's time to draw (nextDrawTime has passed)
  const canDrawNow = groupStats ? Math.floor(Date.now() / 1000) >= Number(groupStats[5]) : false;
  
  // Check if user is the winner for this round
  const isWinner = 
    !!currentRoundWinner && 
    !!address && 
    currentRoundWinner.toLowerCase() === address.toLowerCase();

  const handleApprove = async () => {
    try {
      setIsApproving(true);
      
      // Parse string to number first
      const securityDeposit = parseFloat(securityDepositAmount);
      const installment = parseFloat(installmentAmount);
      const membersCount = Number(maxMembers);
      
      // Security deposit + (installment × jumlah member)
      const totalNeeded = securityDeposit + (installment * membersCount);
      
      await approveUSDCMax(groupAddress, totalNeeded.toString());
      setIsApproved(true);
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setIsApproving(false);
    }
  };

  const handleJoin = async () => {
    try {
      setIsJoining(true);
      await joinGroup(groupAddress);
      setIsApproved(false); // Reset setelah join berhasil
    } catch (error) {
      console.error('Join failed:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handlePayInstallment = async () => {
    try {
      setIsPaying(true);
      await payInstallment(groupAddress);
    } catch (_) {
    } finally {
      setIsPaying(false);
    }
  };

  const handleDrawWinner = async () => {
    try {
      setIsDrawing(true);
      await drawWinner(groupAddress);
    } catch (_) {
    } finally {
      setIsDrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {groupName || `Group #${groupAddress.slice(0, 8)}...`}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="p-4 bg-[#252525] rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-white">Members</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {members.length}/{maxMembers}
            </p>
          </div>

          <div className="p-4 bg-[#252525] rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="font-medium text-white">Total Money</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {contractUSDCBalance}
            </p>
            <div className="text-xs text-gray-400 mt-1">
              Security Deposit Included
            </div>
          </div>

          <div className="p-4 bg-[#252525] rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-white">Round</span>
            </div>
            {Number(groupStats[0]) >= Number(groupStats[1]) ? (
              <div className="flex items-center space-x-2">
                <p className="text-2xl font-bold text-white">Completed</p>
              </div>
            ) : (
              <p className="text-2xl font-bold text-white">
                {Number(groupStats[0])}/{Number(groupStats[1])}
              </p>
            )}
          </div>

          <div className="p-4 bg-[#252525] rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="font-medium text-white">Paid Members</span>
            </div>
            <p className="text-2xl font-bold text-white">
              {paidMembers}/{members.length}
            </p>
          </div>
        </div>

        {/* Action buttons moved inside the modal */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {/* Join Group button - for non-members */}
          {!isMember && isGroupActive && !isGroupFull && (
            !isApproved ? (
              <button
                onClick={handleApprove}
                disabled={isApproving}
                className="px-4 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-60 flex items-center space-x-2"
              >
                {isApproving ? 'Approving...' : 'Approve USDC'}
              </button>
            ) : (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="px-4 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-60 flex items-center space-x-2"
              >
                {isJoining ? 'Joining...' : 'Join Group'}
              </button>
            )
          )}

          {/* Pay Installment button - for members who haven't paid */}
          {isMember && isGroupActive && !userHasPaid && (
            <button
              onClick={handlePayInstallment}
              disabled={isPaying}
              className="px-4 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-60 flex items-center space-x-2"
            >
              <Coins className="w-4 h-4" />
              <span>{isPaying ? 'Paying...' : 'Pay Installment'}</span>
            </button>
          )}

          {/* Draw Winner button - only shown to current round winner */}
          {isMember && isGroupActive && isGroupFull && allMembersPaid && !isRoundCompleted && canDrawNow && 
           isWinner && (
            <button
              onClick={handleDrawWinner}
              disabled={isDrawing}
              className="px-4 py-2 bg-[#A57B00] text-white rounded-lg disabled:opacity-60 flex items-center space-x-2"
            >
              <Trophy className="w-4 h-4" />
              <span>{isDrawing ? 'Processing...' : 'Claim Win & Start Next Round'}</span>
            </button>
          )}

          {/* Status messages */}
          {isMember && isGroupActive && (
            <div className="text-sm text-white space-y-1 mb-6">
              {!isGroupFull && <p>• Group not full ({members.length}/{maxMembers})</p>}
              {isGroupFull && !allMembersPaid && <p>• Not all members have paid</p>}
              {isGroupFull && allMembersPaid && isRoundCompleted && <p>• Round already completed</p>}
              {isGroupFull && allMembersPaid && !isRoundCompleted && !canDrawNow && (
                <div>
                  <p>• Draw time not reached yet</p>
                  {groupStats && (
                    <p className="text-xs">
                      Next draw: {new Date(Number(groupStats[5]) * 1000).toLocaleString()}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Members
          </h3>
          <div className="space-y-2">
            {members.map((member, index) => {
              const hasPaid = paymentStatus ? paymentStatus[1][index] : false;
              return (
                <div key={member} className="flex items-center justify-between p-3 bg-[#A57B00]/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono text-[#D7AF37]">
                        {member.slice(0, 8)}...{member.slice(-4)}
                      </span>
                      {address && member.toLowerCase() === address.toLowerCase() && (
                        <span className="px-2 py-0.5 text-xs bg-gray-500/30 text-white rounded">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {hasPaid ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-white">
                      {hasPaid ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}