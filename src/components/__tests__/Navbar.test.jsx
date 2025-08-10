import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import Navbar from '../Navbar';

jest.mock('react-hot-toast');
jest.mock('../data/networkNames.jsx', () => ({
  NETWORK_NAME_MAP: { 1: 'Ethereum Mainnet', 4: 'Rinkeby' }
}));

const mockStore = createStore(() => ({
  handleCart: []
}));

const mockEthereum = {
  request: jest.fn(),
  on: jest.fn(),
  removeListener: jest.fn()
};

const renderWithProviders = (component) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('Navbar Wallet Integration', () => {
  beforeEach(() => {
    global.window.ethereum = mockEthereum;
    jest.clearAllMocks();
  });

  test('shows "Connect Wallet" button when not connected', () => {
    renderWithProviders(<Navbar />);
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  test('connects wallet on button click', async () => {
    mockEthereum.request.mockResolvedValue(['0x1234567890abcdef']);
    
    renderWithProviders(<Navbar />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(mockEthereum.request).toHaveBeenCalledWith({ method: 'eth_requestAccounts' });
    });
  });

  test('shows wallet details when connected', async () => {
    mockEthereum.request.mockResolvedValue(['0x1234567890abcdef']);
    
    renderWithProviders(<Navbar />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Details \(0x123\.\.\.\)/)).toBeInTheDocument();
    });
  });

  test('opens wallet popup when clicking details button', async () => {
    mockEthereum.request.mockResolvedValue(['0x1234567890abcdef']);
    
    renderWithProviders(<Navbar />);
    
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    await waitFor(() => {
      const detailsButton = screen.getByText(/Details \(0x123\.\.\.\)/);
      fireEvent.click(detailsButton);
      expect(screen.getByText('Wallet Details')).toBeInTheDocument();
    });
  });

  test('shows connecting state during wallet connection', async () => {
    mockEthereum.request.mockReturnValue(new Promise(() => {}));
    
    renderWithProviders(<Navbar />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
    });
  });

  test('handles MetaMask not installed', async () => {
    global.window.ethereum = undefined;
    window.alert = jest.fn();
    
    renderWithProviders(<Navbar />);
    
    const connectButton = screen.getByText('Connect Wallet');
    fireEvent.click(connectButton);
    
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Please install MetaMask!');
    }, { timeout: 5000 });
  });

  test('handles account changes when switching accounts', async () => {
    renderWithProviders(<Navbar />);
    
    await waitFor(() => {
      expect(mockEthereum.on).toHaveBeenCalledWith('accountsChanged', expect.any(Function));
    });
    
    const accountsChangedCall = mockEthereum.on.mock.calls.find(call => call[0] === 'accountsChanged');
    expect(accountsChangedCall).toBeDefined();
    
    const accountsChangedHandler = accountsChangedCall[1];
    
    accountsChangedHandler(['0xabcdef1234567890abcdef12']);
    
    await waitFor(() => {
      expect(screen.getByText(/Details \(0xabc\.\.\.\)/)).toBeInTheDocument();
    });
  });

  test('handles account changes when disconnected', async () => {
    mockEthereum.request.mockResolvedValue(['0x1234567890abcdef']);
    renderWithProviders(<Navbar />);
    
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    await waitFor(() => {
      expect(screen.getByText(/Details \(0x123\.\.\.\)/)).toBeInTheDocument();
    });
    
    const accountsChangedHandler = mockEthereum.on.mock.calls.find(call => call[0] === 'accountsChanged')[1];
    accountsChangedHandler([]);
    
    await waitFor(() => {
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });
  });
});