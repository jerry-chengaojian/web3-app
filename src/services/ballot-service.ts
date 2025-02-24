import { ethers } from 'ethers';
import BallotABI from '@/contracts/Ballot.json';
import { getContract, getReadOnlyContract } from '@/utils/ethereum';

const CONTRACT_ADDRESS = '0x5fbdb2315678afecb367f032d93f642f64180aa3';

export interface Proposal {
  name: string;
  voteCount: number;
}

export interface Ballot {
  id: string;
  chairperson: string;
  proposals: Proposal[];
  voterCount: number;
}

export class BallotService {
  private contract: ethers.Contract;
  private readOnlyContract: ethers.Contract;

  constructor() {
    this.contract = getContract(CONTRACT_ADDRESS, BallotABI.abi);
    this.readOnlyContract = getReadOnlyContract(CONTRACT_ADDRESS, BallotABI.abi);
  }

  async getChairperson(): Promise<string> {
    return await this.readOnlyContract.chairperson();
  }

  async getProposals(): Promise<Proposal[]> {
    return await this.readOnlyContract.proposalList();
  }

  async getVoterInfo(address: string) {
    return await this.readOnlyContract.voters(address);
  }

  async vote(proposalIndex: number, signer: ethers.Signer) {
    const contractWithSigner = this.contract.connect(signer);
    const tx = await contractWithSigner.vote(proposalIndex);
    await tx.wait();
  }

  async delegate(to: string, signer: ethers.Signer) {
    const contractWithSigner = this.contract.connect(signer);
    const tx = await contractWithSigner.delegate(to);
    await tx.wait();
  }

  async giveRightToVote(voters: string[]) {
    const tx = await this.contract.giveRightToVote(voters);
    await tx.wait();
  }

  async createBallot(proposalNames: string[]) {
    const factory = new ethers.ContractFactory(
      BallotABI.abi,
      BallotABI.bytecode,
      this.contract.signer
    );
    const ballot = await factory.deploy(proposalNames);
    await ballot.deployed();
    return ballot.address;
  }
}

export const ballotService = new BallotService(); 