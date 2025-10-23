// Base network configuration
export const BASE_SEPOLIA = {
  id: 84532,
  name: 'Base Sepolia',
  network: 'base-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://sepolia.base.org'] },
    default: { http: ['https://sepolia.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://sepolia.basescan.org' },
  },
  testnet: true,
} as const;

export const BASE_MAINNET = {
  id: 8453,
  name: 'Base',
  network: 'base',
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://mainnet.base.org'] },
    default: { http: ['https://mainnet.base.org'] },
  },
  blockExplorers: {
    default: { name: 'BaseScan', url: 'https://basescan.org' },
  },
  testnet: false,
} as const;

// Contract addresses: prefer environment variables when provided
const ENV_CONTRACT_ADDRESSES = {
  // Defaults populated from smart-contracts/deployments/base-sepolia.json
  MOCK_USDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS || '',
  REPUTATION_TOKEN: process.env.NEXT_PUBLIC_REPUTATION_TOKEN_ADDRESS || '',
  ARISAN_FACTORY: process.env.NEXT_PUBLIC_ARISAN_FACTORY_ADDRESS || '',
} as const;

export const CONTRACT_ADDRESSES = {
  // Base Sepolia
  [BASE_SEPOLIA.id]: {
    MOCK_USDC: ENV_CONTRACT_ADDRESSES.MOCK_USDC,
    REPUTATION_TOKEN: ENV_CONTRACT_ADDRESSES.REPUTATION_TOKEN,
    ARISAN_FACTORY: ENV_CONTRACT_ADDRESSES.ARISAN_FACTORY,
  },
  // Base Mainnet
  [BASE_MAINNET.id]: {
    MOCK_USDC: '0x...', // Fill when deploying to mainnet
    REPUTATION_TOKEN: '0x...',
    ARISAN_FACTORY: '0x...',
  },
} as const;

// App configuration
export const APP_CONFIG = {
  name: 'ArisanLink',
  description: 'Decentralized Arisan Platform on Base',
  url: 'https://arisanlink.app',
  social: {
    twitter: 'https://twitter.com/arisanlink',
  },
} as const;

// Default arisan group settings
export const DEFAULT_ARISAN_SETTINGS = {
  minMembers: 2,
  maxMembers: 50,
  minInstallmentAmount: 10, // 10 USDC
  maxInstallmentAmount: 10000, // 10,000 USDC
  defaultSecurityDepositMultiplier: 1, // 1x installment amount
  maxSecurityDepositMultiplier: 3, // 3x installment amount
  defaultRoundDuration: 30, // 30 days
  minRoundDuration: 7, // 7 days
  maxRoundDuration: 365, // 1 year
} as const;

// UI configuration
export const UI_CONFIG = {
  animations: {
    duration: 300,
    easing: 'ease-in-out',
  },
  colors: {
    primary: '#2563eb',
    secondary: '#1e40af',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ACCOUNT_ABSTRACTION: true,
  ENABLE_SMART_DEPOSIT: true,
  ENABLE_ESCROW_SYSTEM: true,
  ENABLE_REPUTATION_SYSTEM: true, // Now implemented
  ENABLE_PRODUCTIVE_COLLATERAL: false, // Future feature
  ENABLE_CHAINLINK_VRF: false, // Future feature
} as const;
