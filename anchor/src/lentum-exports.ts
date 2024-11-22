// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import LentumIDL from '../target/idl/lentum.json'
import type { Lentum } from '../target/types/lentum'

// Re-export the generated IDL and type
export { Lentum, LentumIDL }

// The programId is imported from the program IDL.
export const LENTUM_PROGRAM_ID = new PublicKey(LentumIDL.address)

// This is a helper function to get the Lentum Anchor program.
export function getLentumProgram(provider: AnchorProvider) {
  return new Program(LentumIDL as Lentum, provider)
}

// This is a helper function to get the program ID for the Lentum program depending on the cluster.
export function getLentumProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Lentum program on devnet and testnet.
      return new PublicKey('CounNZdmsQmWh7uVngV9FXW2dZ6zAgbJyYsvBpqbykg')
    case 'mainnet-beta':
    default:
      return LENTUM_PROGRAM_ID
  }
}
