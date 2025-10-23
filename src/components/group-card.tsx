'use client';

import { Users, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { ARISAN_GROUP_ABI } from './smart-contract-integration';
import { useState } from 'react';

interface Group {
  id: number;
  name: string;
  installmentAmount: number;
  totalMembers: number;
  currentMembers: number;
  nextDrawDate: string;
  status: 'active' | 'drawing' | 'completed';
  address: string;
}

interface GroupCardProps {
  group: Group;
}

export function GroupCard({ group }: GroupCardProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined);
  const { writeContract } = useWriteContract();
  const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-200';
      case 'drawing':
        return 'bg-yellow-900 text-yellow-200';
      case 'completed':
        return 'bg-gray-700 text-gray-200';
      default:
        return 'bg-gray-700 text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'drawing':
        return 'Drawing';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const canJoin = group.status === 'active' && group.currentMembers < group.totalMembers;

  const handleJoin = async () => {
    setIsJoining(true);
    try {
      const result = await writeContract({
        address: group.address as `0x${string}`,
        abi: ARISAN_GROUP_ABI,
        functionName: 'joinGroup',
      });
      // result is void, so use onSuccess from wagmi or set txHash in onSuccess handler if needed
    } catch (e) {
      // Optionally handle error
    }
    setIsJoining(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-1">
            {group.name}
          </h3>
          <p className="text-sm text-gray-400">
            {group.address}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(group.status)}`}>
          {getStatusText(group.status)}
        </span>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Installment</span>
          </div>
          <span className="text-sm font-medium text-white">
            {formatAmount(group.installmentAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Members</span>
          </div>
          <span className="text-sm font-medium text-white">
            {group.currentMembers}/{group.totalMembers}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">Next Draw</span>
          </div>
          <span className="text-sm font-medium text-white">
            {formatDate(group.nextDrawDate)}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{Math.round((group.currentMembers / group.totalMembers) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(group.currentMembers / group.totalMembers) * 100}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors">
          View Details
        </button>
        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm rounded-lg transition-colors">
          <ExternalLink className="w-4 h-4" />
        </button>

        {canJoin && (
          <button
            className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors disabled:opacity-60"
            onClick={handleJoin}
            disabled={isJoining || isTxLoading}
          >
            {isJoining || isTxLoading ? 'Joining...' : 'Join'}
          </button>
        )}
      </div>
    </div>
  );
}