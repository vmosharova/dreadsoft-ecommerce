const WalletPopup = ({ account, network, friendlyNetworkName, onClose, disconnectWallet }) => {
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
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={disconnectWallet}>
                            Disconnect wallet
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WalletPopup