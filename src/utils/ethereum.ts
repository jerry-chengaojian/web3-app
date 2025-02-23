import { ethers } from 'ethers';

// Create shared provider instance
export const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');

// Test private key - Hardhat default first account
export const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';

// Create shared wallet instance
export const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Helper function to get contract instance
export function getContract(address: string, abi: any) {
  return new ethers.Contract(address, abi, wallet);
}

// Helper function to get read-only contract instance
export function getReadOnlyContract(address: string, abi: any) {
  return new ethers.Contract(address, abi, provider);
} 