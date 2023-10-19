import React, { useState, useEffect } from 'react';

function EthereumAccount({ myAccount, setMyAccount, accounts, setAccounts }) {
    const [error, setError] = useState('');
    const [ethAddress, setEthAddress] = useState('');
    // Use useEffect to automatically run connectToMetaMask when the component mounts
    useEffect(() => {
        connectToMetaMask();
    }, []); // The empty dependency array ensures this runs only once when mounted


    const connectToMetaMask = async () => {
        try {
            const ethereumAccounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccounts(ethereumAccounts);
            const selectedAccount = ethereumAccounts[0];
            setEthAddress(selectedAccount);
            setMyAccount(selectedAccount);
        } catch (err) {
            if (err.code === 4001) {
                setError('Please connect to MetaMask.');
            } else {
                setError(err.message);
            }
        }
    };

    return (
        <div>
            <button onClick={connectToMetaMask}>Connect to MetaMask</button>
            {ethAddress && <p>Your Ethereum account: {ethAddress}</p>}
            {error && <p>Error: {error}</p>}
        </div>
    );
}

export default EthereumAccount;
