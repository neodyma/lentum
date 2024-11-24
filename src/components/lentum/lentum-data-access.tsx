import { getLentumProgram, getLentumProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

export function useLentumProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getLentumProgramId(cluster.network as Cluster), [cluster])
  const program = getLentumProgram(provider)

  const accounts = useQuery({
    queryKey: ['lentum', 'all', { cluster }],
    queryFn: () => program.account.market.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['lentum', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) => {
      const [marketPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("lentumMarket")],
        program.programId
      )
      return program.methods.initializeMarket()
        .accountsPartial({
          market: marketPDA,
        })
        .signers([keypair])
        .rpc()
    },
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize market.'),
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useLentumProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useLentumProgram()

  const provider = useAnchorProvider()


  const accountQuery = useQuery({
    queryKey: ['lentum', 'fetch', { cluster, account }],
    queryFn: () => program.account.market.fetch(account),
  })

  const depositMutation = useMutation({
    mutationKey: ['lentum', 'deposit', { cluster, account }],
    mutationFn: async ({ amount, userTokenAccount, lenTokenMint }: { amount: number; userTokenAccount: PublicKey; lenTokenMint: PublicKey }) => {
      const [marketPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("lentumMarket")],
        program.programId
      );

      return program.methods
        .depositTokens(amount) // Pass the deposit amount
        .accountsPartial({
          market: marketPDA,
          userAccount: account, // User's public key
          userLenAccount: undefined, // TODO change this
          userTokenAccount, // Associated token account for the user
          lenMint: new PublicKey("AM2UdPbBLBCfr9sShJicSTPSQM8ryq8faioD2oQ6G7t6"), // The mint of the token being deposited
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
    onError: () => toast.error('Failed to complete deposit.'),
  })

  const withdrawMutation = useMutation({
    mutationKey: ['lentum', 'withdraw', { cluster, account }],
    mutationFn: async ({ amount, userTokenAccount, lenTokenMint }: { amount: number; userTokenAccount: PublicKey; lenTokenMint: PublicKey }) => {
      const [marketPDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("lentumMarket")],
        program.programId
      );

      return program.methods
        .withdrawTokens(amount) // Pass the withdraw amount
        .accountsPartial({
          market: marketPDA,
          userAccount: account, // User's public key
          userLenAccount: undefined, // TODO change this
          userTokenAccount, // Associated token account for the user
          lenMint: new PublicKey("AM2UdPbBLBCfr9sShJicSTPSQM8ryq8faioD2oQ6G7t6"), // The mint of the token being deposited
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .rpc();
    },
    onSuccess: (tx) => {
      transactionToast(tx);
      return accountQuery.refetch();
    },
    onError: () => toast.error('Failed to complete withdraw.'),
  })



  return {
    accountQuery,
    depositMutation,
    withdrawMutation,
  }
}
