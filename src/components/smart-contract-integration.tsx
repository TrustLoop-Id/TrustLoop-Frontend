'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits, formatUnits } from 'viem';
import { CONTRACT_ADDRESSES, BASE_SEPOLIA } from '@/lib/config';

// Smart contract ABIs (simplified for frontend)
const ARISAN_FACTORY_ABI = [
  {
    "inputs": [
      {"name": "_groupName", "type": "string"},
      {"name": "_installmentAmount", "type": "uint256"},
      {"name": "_securityDepositAmount", "type": "uint256"},
      {"name": "_maxMembers", "type": "uint256"}
    ],
    "name": "createArisanGroup",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllGroups",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "creator", "type": "address"}],
    "name": "getGroupsByCreator",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ARISAN_GROUP_ABI = [
  {
    "inputs": [],
    "name": "joinGroup",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "payInstallment",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "drawWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getGroupStats",
    "outputs": [
      {"name": "_currentRound", "type": "uint256"},
      {"name": "_totalRounds", "type": "uint256"},
      {"name": "_totalPot", "type": "uint256"},
      {"name": "_memberCount", "type": "uint256"},
      {"name": "_groupActive", "type": "bool"},
      {"name": "_nextDrawTime", "type": "uint256"},
      {"name": "_forfeitedFunds", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "member", "type": "address"}],
    "name": "getMemberInfo",
    "outputs": [
      {
        "components": [
          {"name": "isMember", "type": "bool"},
          {"name": "hasPaidCurrentRound", "type": "bool"},
          {"name": "securityDeposits", "type": "uint256"},
          {"name": "hasDefaulted", "type": "bool"},
          {"name": "isLastWinner", "type": "bool"},
          {"name": "escrowAmounts", "type": "uint256"},
          {"name": "creditScore", "type": "uint256"},
          {"name": "lastPaymentTime", "type": "uint256"},
          {"name": "joinTime", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMembers",
    "outputs": [{"name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPaymentStatus",
    "outputs": [
      {"name": "", "type": "address[]"},
      {"name": "", "type": "bool[]"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "maxMembers",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "groupName",
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  // ADDED: New functions from updated contract
  {
    "inputs": [{"name": "member", "type": "address"}],
    "name": "getClaimableAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalEscrowAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalEscrowPool",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "installmentAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "securityDepositAmount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "round", "type": "uint256"}],
    "name": "roundWinners",
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const REPUTATION_TOKEN_ABI = [
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getReputationLevel",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "user", "type": "address"}],
    "name": "getReputationInfo",
    "outputs": [
      {
        "components": [
          {"name": "level", "type": "uint256"},
          {"name": "score", "type": "uint256"},
          {"name": "joinCount", "type": "uint256"},
          {"name": "completeCount", "type": "uint256"},
          {"name": "defaultCount", "type": "uint256"},
          {"name": "lastUpdated", "type": "uint256"}
        ],
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

const MOCK_USDC_ABI = [
  {
    "inputs": [{"name": "to", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "spender", "type": "address"}, {"name": "amount", "type": "uint256"}],
    "name": "approve",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "owner", "type": "address"}, {"name": "spender", "type": "address"}],
    "name": "allowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "faucet",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;

// Hook for smart contract interactions
export function useArisanContracts() {
  const { address, isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get contract addresses for current network
  const getContractAddresses = () => {
    const chainId = BASE_SEPOLIA.id;
    return CONTRACT_ADDRESSES[chainId] || {
      MOCK_USDC: '0x...',
      REPUTATION_TOKEN: '0x...',
      ARISAN_FACTORY: '0x...',
    };
  };

  const contractAddresses = getContractAddresses();

  // Read user's USDC balance
  const { data: usdcBalance } = useReadContract({
    address: contractAddresses.MOCK_USDC as `0x${string}`,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  });

  // Read user's reputation
  const { data: reputationLevel } = useReadContract({
    address: contractAddresses.REPUTATION_TOKEN as `0x${string}`,
    abi: REPUTATION_TOKEN_ABI,
    functionName: 'getReputationLevel',
    args: address ? [address] : undefined,
  });

  const { data: reputationInfo } = useReadContract({
    address: contractAddresses.REPUTATION_TOKEN as `0x${string}`,
    abi: REPUTATION_TOKEN_ABI,
    functionName: 'getReputationInfo',
    args: address ? [address] : undefined,
  });

  // Get all groups
  const { data: allGroups } = useReadContract({
    address: contractAddresses.ARISAN_FACTORY as `0x${string}`,
    abi: ARISAN_FACTORY_ABI,
    functionName: 'getAllGroups',
  });

  // Get user's created groups
  const { data: userGroups } = useReadContract({
    address: contractAddresses.ARISAN_FACTORY as `0x${string}`,
    abi: ARISAN_FACTORY_ABI,
    functionName: 'getGroupsByCreator',
    args: address ? [address] : undefined,
  });

  // FIXED: Helper function to check and approve USDC
  const checkAndApproveUSDC = async (spenderAddress: string, requiredAmount: bigint) => {
    if (!address) throw new Error('Wallet not connected');
    
    // This function should be called separately before join/pay
    // We'll return a boolean indicating if approval is needed
    return true; // Always return true, let the calling function handle approval
  };

  // ADDED: Separate hook to check USDC allowance
  const useUSDCAllowance = (spenderAddress: string) => {
    const { data: allowance } = useReadContract({
      address: contractAddresses.MOCK_USDC as `0x${string}`,
      abi: MOCK_USDC_ABI,
      functionName: 'allowance',
      args: address && spenderAddress ? [address, spenderAddress as `0x${string}`] : undefined,
    });

    return allowance as bigint | undefined;
  };

  // Contract interaction functions
  const createGroup = async (
    groupName: string,
    installmentAmount: number,
    securityDepositAmount: number,
    maxMembers: number
  ) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: contractAddresses.ARISAN_FACTORY as `0x${string}`,
      abi: ARISAN_FACTORY_ABI,
      functionName: 'createArisanGroup',
      args: [
        groupName,
        parseUnits(installmentAmount.toString(), 6),
        parseUnits(securityDepositAmount.toString(), 6),
        BigInt(maxMembers)
      ],
    });
  };

  // UPDATED: joinGroup - simplified without auto-approval
  const joinGroup = async (groupAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    // Note: User must approve USDC manually before calling this
    // Use approveUSDCMax(groupAddress) first
    
    return writeContract({
      address: groupAddress as `0x${string}`,
      abi: ARISAN_GROUP_ABI,
      functionName: 'joinGroup',
    });
  };

  // UPDATED: payInstallment - simplified without auto-approval
  const payInstallment = async (groupAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    // Note: User must approve USDC manually before calling this
    // Use approveUSDCMax(groupAddress) first
    
    return writeContract({
      address: groupAddress as `0x${string}`,
      abi: ARISAN_GROUP_ABI,
      functionName: 'payInstallment',
    });
  };

  const drawWinner = async (groupAddress: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: groupAddress as `0x${string}`,
      abi: ARISAN_GROUP_ABI,
      functionName: 'drawWinner',
    });
  };

  const { writeContractAsync } = useWriteContract(); 

  const getUSDC = async () => {
    if (!address) throw new Error('Wallet not connected');
    
    return writeContract({
      address: contractAddresses.MOCK_USDC as `0x${string}`,
      abi: MOCK_USDC_ABI,
      functionName: 'faucet',
    });
  };

  const updateMyReputation = async (groupAddresses: string[]) => {
  if (!address) throw new Error('Wallet not connected');
  
  return writeContract({
    address: contractAddresses.REPUTATION_TOKEN as `0x${string}`,
    abi: REPUTATION_TOKEN_ABI, // perlu update ABI
    functionName: 'updateMyReputation',
    args: [groupAddresses],
  });
};

  const approveUSDCMax = async (spenderAddress: string, amount: string) => {
    if (!address) throw new Error('Wallet not connected');
    
    // Approve hanya sejumlah yang dibutuhkan
    const approvalAmount = parseUnits(amount, 6);
    
    const hash = await writeContractAsync({
      address: contractAddresses.MOCK_USDC as `0x${string}`,
      abi: MOCK_USDC_ABI,
      functionName: 'approve',
      args: [spenderAddress as `0x${string}`, approvalAmount],
    });
    
    return hash;
  };
  
  return {
    // State
    isConnected: mounted ? isConnected : false,
    address: mounted ? address : undefined,
    isPending,
    isConfirming,
    isConfirmed,
    error,
    mounted,
    
    // Data
    usdcBalance: mounted && usdcBalance ? formatUnits(usdcBalance as bigint, 6) : '0',
    reputationLevel: mounted ? (reputationLevel || 0) : 0,
    reputationInfo: mounted ? reputationInfo : undefined,
    allGroups: mounted ? (allGroups || []) : [],
    userGroups: mounted ? (userGroups || []) : [],
    
    // Functions
    createGroup,
    joinGroup,
    payInstallment,
    drawWinner,
    getUSDC,
    approveUSDCMax,
    
    // Contract addresses
    contractAddresses,
  };
}

// UPDATED: Hook for group data with contract USDC balance
export function useGroupData(groupAddress: string) {
  const { address } = useAccount();

  // Get contract addresses
  const getContractAddresses = () => {
    const chainId = BASE_SEPOLIA.id;
    return CONTRACT_ADDRESSES[chainId] || {
      MOCK_USDC: '0x...',
      REPUTATION_TOKEN: '0x...',
      ARISAN_FACTORY: '0x...',
    };
  };

  const contractAddresses = getContractAddresses();

  const { data: groupStats } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'getGroupStats',
  });

  const { data: members } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'getMembers',
  });

  const { data: paymentStatus } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'getPaymentStatus',
  });

  const { data: maxMembers } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'maxMembers',
  });

  const { data: groupName } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'groupName',
  });

  const { data: installmentAmount } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'installmentAmount',
  });

  const { data: securityDepositAmount } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'securityDepositAmount',
  });

  // ADDED: Get total escrow pool
  const { data: totalEscrowPool } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'totalEscrowPool',
  });

  // ADDED: Get claimable amount for current user
  const { data: claimableAmount } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'getClaimableAmount',
    args: address ? [address] : undefined,
  });

  // ADDED: Get contract USDC balance - INI YANG DIBUTUHKAN
  const { data: contractUSDCBalance } = useReadContract({
    address: contractAddresses.MOCK_USDC as `0x${string}`,
    abi: MOCK_USDC_ABI,
    functionName: 'balanceOf',
    args: [groupAddress as `0x${string}`],
  });

  // Get current round info
  const currentRound = groupStats ? Number(groupStats[0]) : 0;

  // Check if user is winner based on join order
  // Current round winner is members[currentRound - 1]
  const currentRoundWinner = members && currentRound > 0 && currentRound <= members.length 
    ? members[currentRound - 1]
    : null;

  return {
    groupStats,
    members: members || [],
    paymentStatus,
    maxMembers: groupStats ? Number(groupStats[1]) : 0,
    groupName: groupName || '',
    installmentAmount: installmentAmount ? formatUnits(installmentAmount as bigint, 6) : '0',
    securityDepositAmount: securityDepositAmount ? formatUnits(securityDepositAmount as bigint, 6) : '0',
    // ADDED: New data
    totalEscrowPool: totalEscrowPool ? formatUnits(totalEscrowPool as bigint, 6) : '0',
    claimableAmount: claimableAmount ? formatUnits(claimableAmount as bigint, 6) : '0',
    // ADDED: Contract USDC balance - REAL TOTAL MONEY
    contractUSDCBalance: contractUSDCBalance ? formatUnits(contractUSDCBalance as bigint, 6) : '0',
    currentRoundWinner: currentRoundWinner, // Winner is determined by join order
    // Helper computed values
    currentRound: groupStats ? Number(groupStats[0]) : 0,
    isGroupActive: groupStats ? groupStats[4] : false,
    nextDrawTime: groupStats ? Number(groupStats[5]) : 0,
  };
}

// Hook for member data
export function useMemberData(groupAddress: string, memberAddress: string) {
  const { data: memberInfo } = useReadContract({
    address: groupAddress as `0x${string}`,
    abi: ARISAN_GROUP_ABI,
    functionName: 'getMemberInfo',
    args: [memberAddress as `0x${string}`],
  });

  return {
    memberInfo,
    // FIXED: Access by property name instead of index
    isMember: memberInfo ? memberInfo.isMember : false,
    hasPaidCurrentRound: memberInfo ? memberInfo.hasPaidCurrentRound : false,
    hasDefaulted: memberInfo ? memberInfo.hasDefaulted : false,
    isLastWinner: memberInfo ? memberInfo.isLastWinner : false,
    creditScore: memberInfo ? Number(memberInfo.creditScore) : 0,
    securityDeposits: memberInfo ? formatUnits(memberInfo.securityDeposits, 6) : '0',
    escrowAmounts: memberInfo ? formatUnits(memberInfo.escrowAmounts, 6) : '0',
    lastPaymentTime: memberInfo ? Number(memberInfo.lastPaymentTime) : 0,
    joinTime: memberInfo ? Number(memberInfo.joinTime) : 0,
  };
}