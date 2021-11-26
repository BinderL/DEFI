const { BN, ether, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const constants = require('@openzeppelin/test-helpers/src/constants');
// const expectEvent = require('@openzeppelin/test-helpers/src/expectEvent');
const { expect } = require('chai');
const { assert } = require('console');
// const { address } = require('faker');

const Voting = artifacts.require('Voting');

contract("Voting.sol", function (accounts) {
  const owner = accounts[0];
  const v1 = accounts[1];
  const v2 = accounts[2];
  const v3 = accounts[3];
  

  let voting;

  context("fonctions", function() {

    beforeEach(async function () {
      voting = await Voting.new({from:owner});
    });

    it("... teste de la fonction addVoter", async () => {
      let result = await voting.addVoter(v1, {from: owner});
      await expectRevert(voting.addVoter(v1, {from: v2}), 'Ownable: caller is not the owner');
      await expectRevert(voting.addVoter(v1, {from: owner}), "Already registered");

      const voter = await voting.getVoter(v1, {from: v1});

      expectEvent(result, 'VoterRegistered', {voterAddress: v1});
      expect(voter.isRegistered).to.equal(true, "not registered");
    });

    it("... teste de la fonction addProposal", async () => {

      await expectRevert(voting.addProposal("proposal", {from: owner}), "You're not a voter");
      await voting.addVoter(v1, {from: owner});
      await expectRevert(voting.addProposal("proposal", {from: v1}), "Proposals are not allowed yet");
      await voting.startProposalsRegistering();
      let result = await voting.addProposal("proposal",{from: v1});
      expectEvent(result, 'ProposalRegistered', {proposalId: new BN(0)});

      prop = await voting.getOneProposal(0);
      await expectRevert(voting.addProposal("",{from:v1}), "Vous ne pouvez pas ne rien proposer");
      expect(prop.description).to.equal("proposal", "Doit etre le mot : proposal");
    });

    it("... teste de la fonction setVote", async () => {
      
      await expectRevert(voting.setVote(0),"You're not a voter");
      await voting.addVoter(v1, {from: owner});
      await voting.startProposalsRegistering(); 
      await voting.addProposal("proposal",{from: v1});
      await voting.endProposalsRegistering(); 
      
      await expectRevert(voting.setVote(0,{from:v1}),"Voting session havent started yet");
      await voting.startVotingSession(); 
      await expectRevert(voting.setVote(2,{from:v1}),"Proposal not found");
      result = await voting.setVote(0,{from:v1});
      await expectRevert(voting.setVote(0,{from:v1}),"You have already voted");
      await expectEvent(result, 'Voted', {voter : v1, proposalId: new BN(0)});
   
    });    
    it("... teste de la function getWinner", async () => {
      await expectRevert(voting.getWinner(),"Votes are not tallied yet");
      await voting.addVoter(v1, {from: owner});
      await voting.startProposalsRegistering(); 
      await voting.addProposal("proposal",{from: v1});
      await voting.endProposalsRegistering(); 
      await voting.startVotingSession(); 
      await voting.setVote(0,{from:v1});
      await voting.endVotingSession();
      await voting.tallyVotes();
      prop = await voting.getWinner();
      expect(prop.description).to.equal("proposal", "Doit etre la prop 0: proposaaaal");
    });
  });

  context("Transitoire", function() {

    beforeEach(async function () { 
    });

    async function wrapper(fct1){
      await expectRevert(fct1({from:owner}), 'Registering proposals cant be started now');
    }

    it("... teste des phases exclusifs", async () => {
      voting = await Voting.new({from:owner});
      fcts = [voting.startProposalsRegistering, 
	      voting.endProposalsRegistering, 
	      voting.startVotingSession,
	      voting.endVotingSession,
	      voting.tallyVotes
      ]
      result = await voting.startProposalsRegistering({from: owner});
      expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(0), newStatus:new BN(1)});
	
      await expectRevert(voting.startProposalsRegistering({from:owner}), 'Registering proposals cant be started now');
      await expectRevert(voting.startVotingSession({from:owner}), 'Registering proposals phase is not finished');

      result = await voting.endProposalsRegistering({from: owner}); 
      expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(1), newStatus:new BN(2)});

      result = await voting.startVotingSession({from: owner}); 
      expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(2), newStatus:new BN(3)});

      result = await voting.endVotingSession({from: owner}); 
      expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(3), newStatus:new BN(4)});

      result = await voting.tallyVotes({from: owner}); 
      expectEvent(result, 'WorkflowStatusChange', {previousStatus: new BN(4), newStatus:new BN(5)});

    });
 });
})

