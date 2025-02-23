import { ethers } from 'ethers';

export const getProvider = () => {
  return new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
};

export const getContract = (address: string, abi: any) => {
  const provider = getProvider();
  return new ethers.Contract(address, abi, provider);
}; 