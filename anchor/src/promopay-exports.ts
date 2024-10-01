// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import PromopayIDL from '../target/idl/promopay.json';
import type { Promopay } from '../target/types/promopay';

// Re-export the generated IDL and type
export { Promopay, PromopayIDL };

// The programId is imported from the program IDL.
export const PROMOPAY_PROGRAM_ID = new PublicKey(PromopayIDL.address);

// This is a helper function to get the Promopay Anchor program.
export function getPromopayProgram(provider: AnchorProvider) {
  return new Program(PromopayIDL as Promopay, provider);
}

// This is a helper function to get the program ID for the Promopay program depending on the cluster.
export function getPromopayProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return PROMOPAY_PROGRAM_ID;
  }
}
