import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../contexts/Web3Context';
import EthereumAccount from '../components/EthereumAccount';

function CarbonCreditDashboard() {
    const [creditsIssuedList, setCreditsIssuedList] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [creditAmount, setCreditAmount] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [accountBalance, setAccountBalance] = useState('');
    const { web3, carbonCreditContract } = useWeb3();

    useEffect(() => {
        if (accounts != null) {
            setSelectedAccount(accounts[0])
        }
    }, [accounts])

    const issueCarbonCredits = async () => {
        // In a real application, you would send a transaction to the smart contract
        // to record the carbon credit transaction and retrieve this data from the blockchain.
        if (!web3 || !carbonCreditContract) {
            console.log(web3);
            console.log(carbonCreditContract);
            console.log('no web3 or carbonCreditContract detected');
            return;
        }

        try {
            // Convert the credit amount to the contract's required format (if needed)
            // const creditAmountWei = etherToWei(creditAmount.toString(), 'ether');
            console.log(accountHolder);
            console.log(selectedAccount);
            if (web3.utils.toChecksumAddress(accountHolder) === web3.utils.toChecksumAddress(selectedAccount)) {

                // Send a transaction to the smart contract to record a carbon credit transaction
                const txResult = await carbonCreditContract.methods
                    .issueCarbonCredits(selectedAccount, creditAmount)
                    .send({
                        from: selectedAccount, // Use the selected Ethereum account
                    });

                console.log('Carbon credits issued:', txResult);

            } else {
                console.error('Only the account holder can issue carbon credits');
            }
            const newCreditIssue = {
                address: selectedAccount,
                credits: creditAmount,
                timestamp: new Date().toLocaleString(),
            };

            setCreditsIssuedList([...creditsIssuedList, newCreditIssue]);

            // Clear the input fields
            setCreditAmount(0);
            setSelectedAccount(accounts[0]);
        } catch (error) {
            console.error('Error adding transaction', error);
        }
    };

    const transferCarbonCredits = async () => {
        try {
            // Transfer carbon credits
            const txResult = await carbonCreditContract.methods.transferCarbonCredits(selectedAccount, creditAmount).send({
                from: accountHolder, // Use the selected Ethereum account
            });

            console.log('Carbon credits transferred:', txResult);

            // Update the UI or perform any other actions after the transaction is successful
            const transaction = {
                fromAddress: accountHolder,
                toAddress: selectedAccount,
                credits: creditAmount,
                timestamp: new Date().toLocaleString(),
            };

            setTransactions([...transactions, transaction]);

            // Clear the input fields
            setCreditAmount(0);
            setSelectedAccount(accounts[0]);
        } catch (error) {
            console.error('Error transferring carbon credits:', error);
        }
    };

    const getCreditBalance = async () => {
        if (!web3 || !carbonCreditContract) {
            return;
        }

        try {
            const creditBalance = await carbonCreditContract.methods
                .getCarbonCredits(selectedAccount)
                .call()
            console.log('Get Credits Balance:', creditBalance);
            setAccountBalance(creditBalance);
        } catch (error) {
            console.error('Error getting credit balance', error);
        }
    }
    return (
        <div className="carbon-trading-app">
            <EthereumAccount myAccount={accountHolder} setMyAccount={setAccountHolder} account={selectedAccount} accounts={accounts} setAccount={setSelectedAccount} setAccounts={setAccounts} />

            <h1>Carbon Credit Trading Dashboard</h1>
            <div className="transaction-form">
                <label>Select Company Account:</label>
                <select
                    type="text"
                    placeholder="Company Name"
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                >
                    {accounts != null ?
                        accounts.map((account) => (
                            <option key={account} value={account}>
                                {account}
                            </option>
                        )) : <></>}

                </select>
                <input
                    type="number"
                    placeholder="Credit Amount"
                    value={creditAmount}
                    onChange={(e) => setCreditAmount(parseInt(e.target.value, 10))}
                />
                <button onClick={issueCarbonCredits}>Issue Carbon Credits</button>
                <button onClick={getCreditBalance}>Get Credit Balance</button>
                <button onClick={transferCarbonCredits}>Transfer Credit</button>

            </div>
            <div className="credit-list">
                <h2>List of Credits Issued</h2>
                <ul>
                    {creditsIssuedList.map((credit, index) => (
                        <li key={index}>
                            <strong>Issuer:</strong> {credit.address} |
                            <strong>Credits:</strong> {credit.credits} |
                            <strong>Timestamp:</strong> {credit.timestamp}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="transaction-list">
                <h2>Recent Transactions </h2>
                <ul>
                    {transactions.map((transaction, index) => (
                        <li key={index}>
                            <strong>From:</strong> {transaction.fromAddress} |
                            <strong>To:</strong> {transaction.toAddress} |
                            <strong>Credits:</strong> {transaction.credits} |
                            <strong>Timestamp:</strong> {transaction.timestamp}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="credit-balance">
                <p>Credit Balance: {accountBalance}</p>
            </div>
        </div >
    );
}

export default CarbonCreditDashboard;