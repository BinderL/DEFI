import React, {useState, useEffect} from 'react'
import './App.css';
import Voting from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import CustomInput from "./component/CustomInput";
import CustomStatus from "./component/CustomStatus";
import CustomButton from "./component/CustomButton";
import CustomText from "./component/CustomText";

function App() {
	const [web3, setWeb3] = useState (null);
	const [accounts, setAccounts] = useState([]);
	const [contract, setContract] = useState(null)
	const [voter, setVoter] = useState("");
	const [voters, setVoters] = useState([]);
	const [proposal, setProposal] = useState("");
	const [id_proposal, setId_proposal] = useState(0);
	const [winner, setWinner] = useState("");	
			
	const updateWeb3 = async () => {
		let accounts = await web3.eth.getAccounts();
		setAccounts(accounts);
	}

	const lookForWeb3 = async () => {
		try {
			const web3 = await getWeb3();
			let accounts = await web3.eth.getAccounts();
			const _networkId = await web3.eth.net.getId();
			const _deployedNetwork = Voting.networks[_networkId];
			console.log(accounts);
			const instance = 	new web3.eth.Contract(
				Voting.abi,
				_deployedNetwork.address,
			);
			setWeb3(web3);
			setContract(instance);
			setAccounts(accounts);
			run();
		}
		catch (error) { 
			alert('failed to load web3, accounts or contract. Check console for details');
			console.error(error);
		}
	}
		
	const run = async () => {
		console.log("run");
	
	}

	lookForWeb3();

	useEffect(() => {
		if(web3)
			updateWeb3();
	});

	const registerVoter = async () => {
				await contract.methods.addVoter(voter).send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.VoterRegistered.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.VoterRegistered.returnValues.voterAddress);
		});
		setVoters((lastVoters) => [...lastVoters, {id:voters.length.toString(),title:voter}]);
		setVoter("");
	}
	
	const beginProposalSession = async () => {
		await contract.methods.startProposalsRegistering().send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.WorkflowStatusChange.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.WorkflowStatusChange.returnValues.previousStatus, result.events.WorkflowStatusChange.returnValues.newStatus);
		});
	}

  const registerProposal = async () => {
		await contract.methods.addProposal(proposal).send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.ProposalRegistered.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.ProposalRegistered.returnValues.proposalId);
		});
		setProposal("");
	}
				
	const endProposalSession = async () => {
		await contract.methods.endProposalsRegistering().send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.WorkflowStatusChange.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.WorkflowStatusChange.returnValues.previousStatus, result.events.WorkflowStatusChange.returnValues.newStatus);
		});
	}

	const beginVotingSession = async () => {
		await contract.methods.startVotingSession().send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.WorkflowStatusChange.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.WorkflowStatusChange.returnValues.previousStatus, result.events.WorkflowStatusChange.returnValues.newStatus);
		});
	}
	
	const endVotingSession = async () => {
		await contract.methods.endVotingSession().send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.WorkflowStatusChange.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.WorkflowStatusChange.returnValues.previousStatus, result.events.WorkflowStatusChange.returnValues.newStatus);
		});
	}

	const registerVote = async () => {
		console.log(accounts);
		await contract.methods.setVote(proposal).send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.Voted.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.Voted.returnValues.voter, result.events.Voted.returnValues.proposalId);
		});
		setId_proposal(0);
	}
	const compute = async () => {
		await contract.methods.tallyVotesDraw().send({ from: accounts[0] }).then((result) => {
						console.log("event: ", result.events.WorkflowStatusChange.event, "was emited and recorded on blockchain");
						console.log("data recorded: ",result.events.WorkflowStatusChange.returnValues.previousStatus, result.events.WorkflowStatusChange.returnValues.newStatus);
		});
	}

	const whoWin = async () => {
		let winningProposal = await contract.methods.getWinner().call({ from: accounts[0] });
		console.log(winningProposal);
		setWinner(winningProposal[0]);
	

	}
			
	lookForWeb3();

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
	the owner of the contract (by default).
			</p>
			<CustomText
				content={"Signer: " + accounts[0]}/>

			<CustomInput 
				data={voter} 
				commentaire="Voter Address, message signed by Owner" 
				action={setVoter}/>

			<CustomButton
				name="Add Voter"
				onPress={registerVoter} />
					
			<CustomStatus
				data={voters} 
				action={ () => {console.log("hello");}}/>

			<CustomButton
				name="Begin Proposal Session"
				onPress={beginProposalSession} />

			<CustomInput 
				data={proposal} 
				commentaire="proposal, message signed by Voter already registered" 
				action={setProposal}/>

			<CustomButton
				name="Add proposal"
				onPress={registerProposal} />
	
			<CustomButton
				name="End Proposal Session"
				onPress={endProposalSession} />

			<CustomButton
				name="Begin Voting Session"
				onPress={beginVotingSession} />

			<CustomInput 
				data={id_proposal} 
				commentaire="ID of a proposal already registered, message signed by Voter already registered" 
				action={setId_proposal}/>

			<CustomButton
				name="Vote for a proposal"
				onPress={registerVote} />
	
			<CustomButton
				name="End Voting Session"
				onPress={endVotingSession} />

			<CustomButton
				name="COMPUTE"
				onPress={compute} />

			<CustomButton
				name="Ask Winner"
				onPress={whoWin} />

			<CustomText
				content={winner}/>
			<p>
	Try changing the value stored on <strong>line 42</strong> of App.js.
			</p>
			<div>The stored value is: </div>
		</div>
	);
}


export default App;
