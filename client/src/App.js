import React, {useState} from 'react'
import './App.css';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";

function App() {
  const [storageValue, setStorageValue] = useState (0);
	const [web3, setWeb3] = useState (null);
	var state = {accounts: null,contract: null };

	const lookForWeb3 = async (state) => {
		try {
			const _web3 = await getWeb3();
			const accounts = await _web3.eth.getAccounts();
			const networkId = await _web3.eth.net.getId();
			const deployedNetwork = SimpleStorageContract.networks[networkId];
			const instance = 	new _web3.eth.Contract(
				SimpleStorageContract.abi,
				deployedNetwork.address,
			);
			setWeb3(_web3)
			state.contract = instance;
			state.accounts = accounts
			run(state);
		}
		catch (error) { 
			alert('failed to load web3, accounts or contract. Check console for details');
			console.error(error);
		}
	}
		
	const run = async (state) => {
		await state.contract.methods.set(5).send({from: state.accounts[0]});
		const response = await state.contract.methods.get().call();
		setStorageValue(response);
	}

	lookForWeb3(state);

	if (!web3) {
		return <div>Loading Web3, accounts, and contract...... </div>;
	}
	return (
		<div className="App">
			<h1>Good to Go!</h1>
			<p>Your Truffle Box is installed and ready.</p>
			<h2>Smart Contract Example</h2>
			<p>
				If your contracts compiled and migrated successfully, below will show
	a stored value of 5 (by default).
			</p>
			<p>
	Try changing the value stored on <strong>line 42</strong> of App.js.
			</p>
			<div>The stored value is: {storageValue}</div>
		</div>
	);
}


export default App;
