// Arisan Group Types
export interface ArisanGroup {
  address: string;
  name: string;
  installmentAmount: bigint;
  securityDepositAmount: bigint;
  maxMembers: number;
  currentRound: number;
  totalRounds: number;
  totalPot: bigint;
  memberCount: number;
  isActive: boolean;
  nextDrawTime: number;
  owner: string;
}

// Member Types
export interface Member {
  address: string;
  hasPaidCurrentRound: boolean;
  securityDeposit: bigint;
  escrowAmount: bigint;
  hasDefaulted: boolean;
  joinedAt: number;
}

// Round Types
export interface Round {
  roundNumber: number;
  winner: string;
  payoutAmount: bigint;
  isCompleted: boolean;
  completedAt: number;
}

// Payment Status Types
export interface PaymentStatus {
  members: string[];
  paidStatus: boolean[];
}

// Group Statistics Types
export interface GroupStats {
  currentRound: number;
  totalRounds: number;
  totalPot: bigint;
  memberCount: number;
  isActive: boolean;
  nextDrawTime: number;
}

// Member Amounts Types
export interface MemberAmounts {
  securityDeposit: bigint;
  escrowAmount: bigint;
  hasDefaulted: boolean;
}

// Contract Events Types
export interface MemberJoinedEvent {
  member: string;
  installmentAmount: bigint;
  securityDeposit: bigint;
}

export interface PaymentMadeEvent {
  member: string;
  round: number;
  amount: bigint;
}

export interface WinnerDrawnEvent {
  round: number;
  winner: string;
  payoutAmount: bigint;
}

export interface EscrowReleasedEvent {
  member: string;
  amount: bigint;
}

export interface MemberDefaultedEvent {
  member: string;
  round: number;
}

// Transaction Types
export interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: bigint;
  gasUsed: bigint;
  gasPrice: bigint;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
}

// Error Types
export interface ContractError {
  code: string;
  message: string;
  data?: any;
}

// Telegram Types
export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
}

export interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    chat_instance?: string;
    chat_type?: string;
    auth_date?: number;
    hash?: string;
  };
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  isClosingConfirmationEnabled: boolean;
  isVerticalSwipesEnabled: boolean;
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  showPopup: (params: any, callback?: (buttonId: string) => void) => void;
  showScanQrPopup: (params: any, callback?: (text: string) => void) => void;
  closeScanQrPopup: () => void;
  readTextFromClipboard: (callback?: (text: string) => void) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (granted: boolean) => void) => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  ready: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  onEvent: (eventType: string, eventHandler: () => void) => void;
  offEvent: (eventType: string, eventHandler: () => void) => void;
}

// App State Types
export interface AppState {
  isConnected: boolean;
  address: string | null;
  chainId: number | null;
  user: TelegramUser | null;
  currentGroup: ArisanGroup | null;
  groups: ArisanGroup[];
  loading: boolean;
  error: string | null;
}

// Form Types
export interface CreateGroupForm {
  name: string;
  installmentAmount: string;
  securityDepositAmount: string;
  maxMembers: string;
}

export interface JoinGroupForm {
  groupAddress: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

// Settings Types
export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: {
    payments: boolean;
    winners: boolean;
    defaults: boolean;
  };
  currency: {
    symbol: string;
    decimals: number;
  };
}
