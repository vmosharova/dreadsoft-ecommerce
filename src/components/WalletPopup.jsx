const WalletPopup = ({ account, network, friendlyNetworkName, onClose, disconnectWallet, pendingTx, txSuccess, confirmInWallet, setPendingTx, setTxSuccess, setConfirmInWallet }) => {
    return (
        <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Wallet Details</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label className="form-label fw-bold">Connected Account:</label>
                            <p className="text-break small">{account}</p>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Network:</label>
                            <p className="small">{network ? friendlyNetworkName : 'Unknown Network'}</p>
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-bold">Transaction Status:</label>
                            {pendingTx && (
                                <div className="d-flex align-items-center">
                                    <div className="spinner-border spinner-border-sm me-2" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                    <span className="text-warning">Transaction Pending...</span>
                                </div>
                            )}
                            {confirmInWallet && (
                                <div className="text-info">
                                    <i className="fa fa-clock me-2"></i>
                                    Confirm in wallet
                                </div>
                            )}
                            {txSuccess && (
                                <div className="text-success">
                                    <i className="fa fa-check-circle me-2"></i>
                                    Minted!
                                </div>
                            )}
                            {!pendingTx && !confirmInWallet && !txSuccess && (
                                <p className="text-muted small">No active transactions</p>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer" style={{ display: 'block' }}>
                        <button 
                            type="button" 
                            className="btn btn-success me-2" 
                            onClick={() => setPendingTx(true)}
                            disabled={pendingTx}
                        >
                            Demo: Start Transaction
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-success me-2" 
                            onClick={() => setConfirmInWallet(true)}
                            disabled={confirmInWallet}
                        >
                            Demo: Confirm Prompt
                        </button>
                        <br></br>
                        <button 
                            type="button" 
                            className="btn btn-success me-2" 
                            onClick={() => {
                                setPendingTx(false);
                                setConfirmInWallet(false);
                                setTxSuccess(true);
                            }}
                        >
                            Demo: Success
                        </button>
                        <hr className="mt-4"></hr>
                        <button 
                            type="button" 
                            className="btn btn-danger"                            
                            onClick={disconnectWallet}>
                            Disconnect wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletPopup