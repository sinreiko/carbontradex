import Web3 from 'web3';

const getWeb3 = async () => {
    if (window.ethereum) {
        const web3 = new Web3(window.ethereum);

        try {
            // Request account access using eth_requestAccounts
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            return web3;
        } catch (error) {
            throw new Error('User denied account access');
        }
    } else if (window.web3) {
        const web3 = new Web3(window.web3.currentProvider);
        // const accounts = await web3.eth.getAccounts();
        return web3;
    } else {
        // Non-dapp browsers or no web3 provider
        throw new Error('No web3 provider detected. Please install MetaMask or use a dapp browser.');
    }
};
export default getWeb3;
