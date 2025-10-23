export function useMiniKit() {
  return {
    isReady: false,
    user: null as { first_name?: string; last_name?: string } | null,
    theme: 'light' as 'light' | 'dark',
    webApp: null,
    showAlert: () => {},
    showConfirm: () => {},
    hapticFeedback: () => {},
    expand: () => {},
    close: () => {},
    connectWallet: () => {},
    disconnectWallet: () => {},
    isWalletConnected: false,
    sendTransaction: () => {},
    signMessage: () => {},
    setHeaderColor: () => {},
    setBackgroundColor: () => {},
    enableClosingConfirmation: () => {},
    disableClosingConfirmation: () => {},
  };
}
