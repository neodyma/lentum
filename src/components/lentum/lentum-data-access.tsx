import { getLentumProgram, getLentumProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'

import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

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

  const accountQuery = useQuery({
    queryKey: ['lentum', 'fetch', { cluster, account }],
    queryFn: () => program.account.lentum.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['lentum', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ lentum: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['lentum', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ lentum: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['lentum', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ lentum: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['lentum', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ lentum: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
