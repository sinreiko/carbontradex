// Web3Context.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import CarbonCreditContract from '../contracts/artifacts/CarbonCredit.json';

const Web3Context = createContext();

export function Web3Provider({ children }) {
    const [web3, setWeb3] = useState(null);
    const [carbonCreditContract, setCarbonCreditContract] = useState(null);

    useEffect(() => {
        // Check if the Ethereum provider (e.g., MetaMask) is available
        if (window.ethereum) {

            // Request account access using eth_requestAccounts
            window.ethereum.request({ method: 'eth_requestAccounts' })
                .then(() => {
                    console.log('Connected to MetaMask');
                    setWeb3(new Web3(window.ethereum));
                })
                .catch((error) => {
                    console.error('User denied account access');
                });
        } else {
            // Handle the case where there's no Ethereum provider available
            console.error('No web3 provider detected. Please install MetaMask or use a dApp browser.');
        }

    }, []);

    useEffect(() => {
        if (web3) {
            getCarbonCreditContract(web3);
        }
    }, [web3])


    const getCarbonCreditContract = async (web3) => {
        console.log(web3);
        try {
            const networkId = await web3.eth.net.getId();
            console.log('networkID:', networkId)
            // const deployedNetwork = await CarbonCreditContract.networks[networkId];
            // console.log('deployed Network:', deployedNetwork)
            // if (deployedNetwork) {
            const contractInstance = new web3.eth.Contract(
                CarbonCreditContract.abi,
                // deployedNetwork.address
                // '0x7d612A772344eEDdc6Fc1a930386ea555f999251'
                '0x7d612A772344eEDdc6Fc1a930386ea555f999251'
            );
            console.log('contractInstance:', contractInstance)
            setCarbonCreditContract(contractInstance);
            // } else {
            //     console.log('The contract is not deployed on the current network');
            // }
        } catch (error) {
            console.error('Error connecting to Web3', error);
        }
    }

    return (
        <Web3Context.Provider value={{ web3, carbonCreditContract }}>
            {children}
        </Web3Context.Provider>
    );
}

export function useWeb3() {
    return useContext(Web3Context);
}
