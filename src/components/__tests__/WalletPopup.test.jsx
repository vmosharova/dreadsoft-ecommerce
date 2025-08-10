import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import WalletPopup from '../WalletPopup';

describe('WalletPopup Component', () => {
  const mockProps = {
    account: '0x1234567890abcdef1234567890abcdef12345678',
    network: { chainId: 1, name: 'homestead' },
    friendlyNetworkName: 'Ethereum Mainnet',
    onClose: jest.fn(),
    disconnectWallet: jest.fn(),
    pendingTx: false,
    txSuccess: false,
    confirmInWallet: false,
    setPendingTx: jest.fn(),
    setTxSuccess: jest.fn(),
    setConfirmInWallet: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders wallet details correctly', () => {
    render(<WalletPopup {...mockProps} />);
    
    expect(screen.getByText('Wallet Details')).toBeInTheDocument();
    expect(screen.getByText(mockProps.account)).toBeInTheDocument();
    expect(screen.getByText('Ethereum Mainnet')).toBeInTheDocument();
  });

  test('closes popup when close button clicked', () => {
    render(<WalletPopup {...mockProps} />);
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    
    expect(mockProps.onClose).toHaveBeenCalled();
  });

  test('shows pending transaction state', () => {
    render(<WalletPopup {...mockProps} pendingTx={true} />);
    
    expect(screen.getByText('Transaction Pending...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument(); // spinner
  });

  test('shows confirm in wallet state', () => {
    render(<WalletPopup {...mockProps} confirmInWallet={true} />);
    
    expect(screen.getByText('Confirm in wallet')).toBeInTheDocument();
  });

  test('shows transaction success state', () => {
    render(<WalletPopup {...mockProps} txSuccess={true} />);
    
    expect(screen.getByText('Minted!')).toBeInTheDocument();
  });

  test('shows no active transactions when all states are false', () => {
    render(<WalletPopup {...mockProps} />);
    
    expect(screen.getByText('No active transactions')).toBeInTheDocument();
  });

  test('disconnect wallet button works', () => {
    render(<WalletPopup {...mockProps} />);
    
    const disconnectButton = screen.getByText('Disconnect wallet');
    fireEvent.click(disconnectButton);
    
    expect(mockProps.disconnectWallet).toHaveBeenCalled();
  });

  test('handles unknown network gracefully', () => {
    render(<WalletPopup {...mockProps} network={null} />);
    
    expect(screen.getByText('Unknown Network')).toBeInTheDocument();
  });

  test('shows chain ID when network object is present', () => {
    const propsWithNetwork = {
      ...mockProps,
      network: { chainId: 137, name: 'matic' },
      friendlyNetworkName: 'Polygon'
    };
    
    render(<WalletPopup {...propsWithNetwork} />);
    
    expect(screen.getByText('Polygon')).toBeInTheDocument();
  });
});