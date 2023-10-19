import React, { Component } from 'react';
import getWeb3 from '../utils/getWeb3'; // Utility to get web3 instance
import MyContract from '../contracts/MyContract.json'; // ABI and address of the smart contract

class ContractInteraction extends Component {
    state = {
        web3: null,
        accounts: [],
        contract: null,
        inputValue: '',
        result: '',
    };

    async componentDidMount() {
        try {
            const web3 = await getWeb3(); // Initialize web3
            const accounts = await web3.eth.getAccounts(); // Get user accounts
            const networkId = await web3.eth.net.getId(); // Get network ID
            const deployedNetwork = MyContract.networks[networkId]; // Get contract network details
            const contract = new web3.eth.Contract(
                MyContract.abi,
                deployedNetwork && deployedNetwork.address
            ); // Initialize contract instance

            this.setState({ web3, accounts, contract });
        } catch (error) {
            console.error('Error connecting to web3', error);
        }
    }

    handleChange = (event) => {
        this.setState({ inputValue: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        const { contract, accounts, inputValue } = this.state;

        try {
            await contract.methods
                .yourContractFunction(inputValue)
                .send({ from: accounts[0] }); // Call a contract function
            const result = await contract.methods
                .getSomeValue()
                .call(); // Call a view function
            this.setState({ result });
        } catch (error) {
            console.error('Contract interaction error', error);
        }
    };

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input
                        type="text"
                        value={this.state.inputValue}
                        onChange={this.handleChange}
                    />
                    <button type="submit">Interact with Contract</button>
                </form>
                <div>
                    <p>Result: {this.state.result}</p>
                </div>
            </div>
        );
    }
}

export default ContractInteraction;
