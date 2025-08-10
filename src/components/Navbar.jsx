import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import WalletPopup from './WalletPopup'

const Navbar = () => {
    const state = useSelector(state => state.handleCart);
    const [isConnecting, setIsConnecting] = useState(false);
    const [account, setAccount] = useState('');
    const [showWalletPopup, setShowWalletPopup] = useState(false);
    const [network, setNetwork] = useState(null);

    useEffect(() => {
        if (window.ethereum) {
            const handleChainChanged = async (chainId) => {
                try {
                    const provider = new ethers.providers.Web3Provider(window.ethereum);
                    const network = await provider.getNetwork();
                    setNetwork(network);
                } catch (error) {
                    console.error('Error updating network:', error);
                }
            };

            const handleAccountsChanged = (accounts) => {
                if (accounts.length === 0) {
                    setAccount('');
                    setNetwork(null);
                    setShowWalletPopup(false);
                } else {
                    setAccount(accounts[0]);
                }
            };

            window.ethereum.on('chainChanged', handleChainChanged);
            window.ethereum.on('accountsChanged', handleAccountsChanged);

            return () => {
                window.ethereum.removeListener('chainChanged', handleChainChanged);
                window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
            };
        }
    }, []);

    async function connectWallet() {
        if (isConnecting) return; 
        try {
            if (!window.ethereum) {
                alert('Please install MetaMask!');
                return;
            }

            setIsConnecting(true);
            
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            
            setAccount(accounts[0]);
            setIsConnecting(false);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const network = await provider.getNetwork(); 
            setNetwork(network); 
        } catch (error) {
            console.error(error);
            setIsConnecting(false);
        }
    }

    const handleWalletClick = () => {
        if (account) {
            setShowWalletPopup(true);
        } else {
            connectWallet();
        }
    }

    const onCloseWalletPopup = () => {
        setShowWalletPopup(false);
    }

    const disconnectCurrentWallet = () => {
        setAccount(null);
        setShowWalletPopup(false);
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 sticky-top">
            <div className="container">
                <NavLink className="navbar-brand fw-bold fs-4 px-2" to="/"> React Ecommerce</NavLink>
                <button className="navbar-toggler mx-2" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav m-auto my-2 text-center">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/">Home </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/product">Products</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about">About</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact">Contact</NavLink>
                        </li>
                    </ul>
                    <div className="buttons text-center">
                        <NavLink to="/login" className="btn btn-outline-dark m-2"><i className="fa fa-sign-in-alt mr-1"></i> Login</NavLink>
                        <NavLink to="/register" className="btn btn-outline-dark m-2"><i className="fa fa-user-plus mr-1"></i> Register</NavLink>
                        <NavLink to="/cart" className="btn btn-outline-dark m-2"><i className="fa fa-cart-shopping mr-1"></i> Cart ({state.length}) </NavLink>
                        <button
                            onClick={handleWalletClick}
                            className="btn btn-outline-dark m-2"
                            style={{
                                color: 'black',
                                borderWidth: '1px',
                                backgroundColor: 'orange',
                            }}
                            disabled={isConnecting}
                        >
                            {isConnecting ? 'Connecting...' : (account ? `Details (${account.slice(0, 5)}...)` : 'Connect Wallet')}
                        </button>
                    </div>
                </div>

                {showWalletPopup && (
                    <WalletPopup 
                        account={account}
                        network={network}
                        onClose={onCloseWalletPopup} 
                        disconnectWallet={disconnectCurrentWallet} 
                    />
                )}
            </div>
        </nav>
    )
}

export default Navbar