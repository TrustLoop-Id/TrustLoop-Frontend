'use client';

import { useArisanContracts } from './smart-contract-integration';
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Award,
  Target
} from 'lucide-react';

// Helper functions
const getMaxContributionLimit = (level: number | bigint) => {
  const numLevel = Number(level);
  if (numLevel >= 10) return 1000;
  if (numLevel >= 8) return 800;
  if (numLevel >= 5) return 500;
  if (numLevel >= 3) return 300;
  if (numLevel >= 2) return 200;
  if (numLevel >= 1) return 100;
  return 50;
};

const getReputationBenefits = (level: number | bigint) => {
  const numLevel = Number(level);
  if (numLevel >= 8) return [
    'Access to high-value groups (up to 800 USDC)',
    'Priority in group selection',
    'Reduced security deposit requirements',
    'Early access to new features'
  ];
  if (numLevel >= 5) return [
    'Access to medium-value groups (up to 500 USDC)',
    'Standard security deposit requirements',
    'Regular group access'
  ];
  if (numLevel >= 3) return [
    'Access to low-value groups (up to 300 USDC)',
    'Standard security deposit requirements',
    'Limited group access'
  ];
  return [
    'Access to basic groups (up to 50 USDC)',
    'Higher security deposit requirements',
    'Limited group access'
  ];
};

export function ReputationCard() {
  const { reputationLevel, reputationInfo, address, mounted } = useArisanContracts();

  if (!address) {
    return (
      <div className="p-4 bg-[#232323] rounded-xl border border-[#A57B00]">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Connect wallet to view reputation
        </p>
      </div>
    );
  }

  // Show default values for new users (score = 0)
  const displayLevel = mounted ? Number(reputationLevel) : 0;
  const displayInfo = reputationInfo || {
    level: 0n,
    score: 0n,
    joinCount: 0n,
    completeCount: 0n,
    defaultCount: 0n,
    lastUpdated: 0n
  };

  const getReputationColor = (level: number | bigint) => {
    const numLevel = Number(level);
    if (numLevel >= 8) return 'text-green-600';
    if (numLevel >= 5) return 'text-blue-600';
    if (numLevel >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getReputationLabel = (level: number | bigint) => {
    const numLevel = Number(level);
    if (numLevel >= 8) return 'Excellent';
    if (numLevel >= 5) return 'Good';
    if (numLevel >= 3) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="p-6 bg-[#232323] rounded-xl border border-[#A57B00]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reputation Score
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
          </div>
          <p className={`text-xl font-bold ${getReputationColor(displayLevel)}`}>
            {displayLevel}/10
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {getReputationLabel(displayLevel)}
          </p>
        </div>

        <div className="p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-2 mb-1">
            <Target className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Score</span>
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            {displayInfo.score.toString()}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            out of 1000
          </p>
        </div>
      </div>

      <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
        <div className="flex items-center space-x-2 mb-1">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Contribution Limit
          </span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400">
          You can join groups up to {getMaxContributionLimit(displayLevel)} USDC
        </p>
      </div>
    </div>
  );
}

export function ReputationHistory() {
  const { reputationInfo, mounted } = useArisanContracts();

  // Show default values for new users
  const displayInfo = reputationInfo || {
    level: 0n,
    score: 0n,
    joinCount: 0n,
    completeCount: 0n,
    defaultCount: 0n,
    lastUpdated: 0n
  };

  const getReputationTrend = () => {
    const joinCount = Number(displayInfo.joinCount);
    const completeCount = Number(displayInfo.completeCount);
    const completionRate = joinCount > 0 
      ? (completeCount * 100) / joinCount
      : 0;
    
    if (completionRate >= 80) return { icon: TrendingUp, color: 'text-green-600', label: 'Excellent' };
    if (completionRate >= 60) return { icon: TrendingUp, color: 'text-blue-600', label: 'Good' };
    if (completionRate >= 40) return { icon: TrendingDown, color: 'text-yellow-600', label: 'Fair' };
    return { icon: TrendingDown, color: 'text-red-600', label: 'Poor' };
  };

  const trend = getReputationTrend();
  const TrendIcon = trend.icon;

  return (
    <div className="p-6 bg-[#232323] rounded-xl border border-[#A57B00]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Reputation History
        </h3>
        <div className="flex items-center space-x-2">
          <TrendIcon className={`w-5 h-5 ${trend.color}`} />
          <span className={`text-sm font-medium ${trend.color}`}>
            {trend.label}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Groups Joined</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayInfo.joinCount.toString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Groups Completed</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayInfo.completeCount.toString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-3">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Defaults</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {displayInfo.defaultCount.toString()}
          </span>
        </div>

        <div className="flex items-center justify-between p-3 bg-[#333] rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {Number(displayInfo.lastUpdated) > 0 
              ? new Date(Number(displayInfo.lastUpdated) * 1000).toLocaleDateString()
              : 'Never'}
          </span>
        </div>
      </div>
    </div>
  );
}