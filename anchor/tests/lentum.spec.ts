import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Lentum } from '../target/types/lentum'
import {
  createInitializeAccountInstruction,
  createInitializeMintInstruction,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'

describe('lentum', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet
  const program = anchor.workspace.Lentum as Program<Lentum>

  // Define variables to hold various mints and token accounts
  let lenbonkMint: PublicKey
  let borbonkMint: PublicKey
  let marketPDA: PublicKey
  let marketBump: number
  let userAccount: Keypair
  let initializeParams: {
    owner: PublicKey,
    reserve: PublicKey,
    interest_rate_model: PublicKey,
    initial_liquidity: number,
    fee_percentage: number,
  }
  let marketReserveTokenAccount: PublicKey
  let userDepositTokenAccount: PublicKey
  let userLenBonkAccount: PublicKey
  let userBorBonkAccount: PublicKey

  // Helper function to derive PDAs for mints
  const findMintPDA = (lenbor: string, symbol: string): [PublicKey, number] => {
    return PublicKey.findProgramAddressSync(
      [Buffer.from(lenbor), Buffer.from(symbol.toLowerCase()), Buffer.from('_mint')],
      program.programId
    )
  }

  it('Airdrop SOL to user', async () => {
    const airdropSignature = await provider.connection.requestAirdrop(
      payer.publicKey,
      LAMPORTS_PER_SOL
    )
    await provider.connection.confirmTransaction(airdropSignature)
    const userBalance = await provider.connection.getBalance(payer.publicKey)
    expect(userBalance).toBeGreaterThan(0)
  })

  it('Initialize Lentum Mints', async () => {
    // Initialize lenbonk_mint
    const [lenbonkMintPDA, _lenbonkMintBump] = findMintPDA('bonk', 'LENBONK')
    lenbonkMint = lenbonkMintPDA

    await program.methods
      .initializeLentumMint('bonk', 'Lentum Bonk', 'LENBONK')
      .accounts({
        admin: payer.publicKey,
        mint: lenbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    // Initialize borbonk_mint
    const [borbonkMintPDA, _borbonkMintBump] = findMintPDA('bonk', 'BORBONK')
    borbonkMint = borbonkMintPDA

    await program.methods
      .initializeLentumMint('bonk', 'Borrow Bonk', 'BORBONK')
      .accounts({
        admin: payer.publicKey,
        mint: borbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc()

    // Verify mints have been initialized
    const lenbonkMintAccount = await provider.connection.getAccountInfo(lenbonkMint)
    expect(lenbonkMintAccount).not.toBeNull()

    const borbonkMintAccount = await provider.connection.getAccountInfo(borbonkMint)
    expect(borbonkMintAccount).not.toBeNull()
  })

  it('Initialize Market as PDA', async () => {
    // Derive the PDA for the market account
    [marketPDA, marketBump] = PublicKey.findProgramAddressSync(
      [Buffer.from('lentumMarket')],
      program.programId
    )

    // Define InitializeParams
    initializeParams = {
      owner: payer.publicKey,
      reserve: Keypair.generate().publicKey, // For simplicity, generating a random reserve
      interest_rate_model: Keypair.generate().publicKey, // Generating a random interest rate model
      initial_liquidity: 1_000_000, // Example initial liquidity
      fee_percentage: 2, // 2%
    }

    // Initialize other mints with random public keys (for simplicity)
    const lenjupMint = Keypair.generate().publicKey
    const lenlinkMint = Keypair.generate().publicKey
    const lensolMint = Keypair.generate().publicKey
    const lenusdcMint = Keypair.generate().publicKey
    const lenusdtMint = Keypair.generate().publicKey
    const lenwifMint = Keypair.generate().publicKey

    const borjupMint = Keypair.generate().publicKey
    const borlinkMint = Keypair.generate().publicKey
    const borsolMint = Keypair.generate().publicKey
    const borusdcMint = Keypair.generate().publicKey
    const borusdtMint = Keypair.generate().publicKey
    const borwifMint = Keypair.generate().publicKey

    // Initialize the market as PDA
    await program.methods
      .initializeMarket(initializeParams)
      .accountsPartial({
        market: marketPDA,
        user: payer.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenProgram: TOKEN_PROGRAM_ID,
        lenbonkMint: lenbonkMint,
        lenjupMint: lenjupMint,
        lenlinkMint: lenlinkMint,
        lensolMint: lensolMint,
        lenusdcMint: lenusdcMint,
        lenusdtMint: lenusdtMint,
        lenwifMint: lenwifMint,
        borbonkMint: borbonkMint,
        borjupMint: borjupMint,
        borlinkMint: borlinkMint,
        borsolMint: borsolMint,
        borusdcMint: borusdcMint,
        borusdtMint: borusdtMint,
        borwifMint: borwifMint,
      })
      .rpc()

    // Fetch and assert market data
    const marketAccount = await program.account.market.fetch(marketPDA)
    expect(marketAccount.owner.toBase58()).toEqual(initializeParams.owner.toBase58())
    expect(marketAccount.reserve.toBase58()).toEqual(initializeParams.reserve.toBase58())
    expect(marketAccount.interestRateModel.toBase58()).toEqual(
      initializeParams.interest_rate_model.toBase58()
    )
    expect(marketAccount.liquidity.toNumber()).toEqual(initializeParams.initial_liquidity)
    expect(marketAccount.totalBorrows.toNumber()).toEqual(0)
    expect(marketAccount.feePercentage).toEqual(initializeParams.fee_percentage)
  })

  it('Create User Account', async () => {
    userAccount = Keypair.generate()

    await program.methods
      .initializeUserAccount()
      .accounts({
        userAccount: userAccount.publicKey,
        user: userAccount.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([userAccount, userAccount])
      .rpc()

    // Fetch and verify user account
    const fetchedUserAccount = await program.account.userAccount.fetch(userAccount.publicKey)
    expect(fetchedUserAccount.owner.toBase58()).toEqual(userAccount.publicKey.toBase58())
    expect(fetchedUserAccount.deposits.length).toEqual(0)
    expect(fetchedUserAccount.borrows.length).toEqual(0)
  })

  it('Create Token Accounts for User and Market', async () => {
    // Create associated token account for user to hold deposit tokens
    const reserveMint = initializeParams.reserve // Replace with actual reserve mint if different
    userDepositTokenAccount = await getAssociatedTokenAddress(
      reserveMint,
      userAccount.publicKey
    )

    // Create the user deposit token account if it doesn't exist
    const userDepositTokenAccountInfo = await provider.connection.getAccountInfo(userDepositTokenAccount)
    if (!userDepositTokenAccountInfo) {
      const createUserDepositTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: userDepositTokenAccount,
          space: 165, // Token account size
          lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          reserveMint,
          userDepositTokenAccount,
          userAccount.publicKey,
          TOKEN_PROGRAM_ID
        )
      )
      await provider.sendAndConfirm(createUserDepositTx, [])
    }

    // Create reserve token account for the market
    marketReserveTokenAccount = await getAssociatedTokenAddress(
      initializeParams.reserve,
      marketPDA
    )

    const marketReserveTokenAccountInfo = await provider.connection.getAccountInfo(marketReserveTokenAccount)
    if (!marketReserveTokenAccountInfo) {
      const createMarketReserveTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: marketReserveTokenAccount,
          space: 165, // Token account size
          lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          initializeParams.reserve,
          marketReserveTokenAccount,
          marketPDA,
          TOKEN_PROGRAM_ID
        )
      )
      await provider.sendAndConfirm(createMarketReserveTx, [])
    }

    // Create user's lenbonk token account
    userLenBonkAccount = await getAssociatedTokenAddress(lenbonkMint, userAccount.publicKey)
    const userLenBonkAccountInfo = await provider.connection.getAccountInfo(userLenBonkAccount)
    if (!userLenBonkAccountInfo) {
      const createUserLenBonkTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: userLenBonkAccount,
          space: 165,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          lenbonkMint,
          userLenBonkAccount,
          userAccount.publicKey,
          TOKEN_PROGRAM_ID
        )
      )
      await provider.sendAndConfirm(createUserLenBonkTx, [])
    }

    // Create user's borbonk token account
    userBorBonkAccount = await getAssociatedTokenAddress(borbonkMint, userAccount.publicKey)
    const userBorBonkAccountInfo = await provider.connection.getAccountInfo(userBorBonkAccount)
    if (!userBorBonkAccountInfo) {
      const createUserBorBonkTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: userBorBonkAccount,
          space: 165,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(165),
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          borbonkMint,
          userBorBonkAccount,
          userAccount.publicKey,
          TOKEN_PROGRAM_ID
        )
      )
      await provider.sendAndConfirm(createUserBorBonkTx, [])
    }
  })

  it('Initialize Reserve Token Supply', async () => {
    const reserveMint = initializeParams.reserve

    // Check if reserveMint is already a mint; if not, create and initialize it
    const reserveMintInfo = await provider.connection.getAccountInfo(reserveMint)
    if (!reserveMintInfo) {
      const reserveMintKeypair = Keypair.generate()
      const createReserveMintTx = new Transaction().add(
        SystemProgram.createAccount({
          fromPubkey: payer.publicKey,
          newAccountPubkey: reserveMint,
          space: 82, // Mint size
          lamports: await provider.connection.getMinimumBalanceForRentExemption(82),
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          reserveMint,
          9, // decimals
          payer.publicKey,
          payer.publicKey,
          TOKEN_PROGRAM_ID
        )
      )
      await provider.sendAndConfirm(createReserveMintTx, [])
    }

    // Mint tokens to the market reserve token account
    await mintTo(
      provider.connection,
      payer.payer,
      reserveMint,
      marketReserveTokenAccount,
      payer.payer,
      initializeParams.initial_liquidity
    )
  })

  it('Deposit Tokens', async () => {
    const reserveMint = initializeParams.reserve

    // Mint tokens to user's deposit token account
    await mintTo(
      provider.connection,
      payer.payer,
      reserveMint,
      userDepositTokenAccount,
      payer.payer,
      500_000
    )

    // Deposit tokens
    await program.methods
      .depositTokens(new anchor.BN(500_000))
      .accountsPartial({
        userAccount: userAccount.publicKey,
        market: marketPDA,
        reserveTokenAccount: marketReserveTokenAccount,
        userTokenAccount: userDepositTokenAccount,
        userLenAccount: userLenBonkAccount,
        authority: userAccount.publicKey,
        lenMint: lenbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([userAccount])
      .rpc()

    // Fetch and assert user account data
    const fetchedUserAccount = await program.account.userAccount.fetch(userAccount.publicKey)
    expect(fetchedUserAccount.deposits.length).toEqual(1)
    expect(fetchedUserAccount.deposits[0].amount.toNumber()).toEqual(500_000)
    expect(fetchedUserAccount.deposits[0].available.toNumber()).toEqual(500_000)

    // Fetch and assert market liquidity
    const marketAccount = await program.account.market.fetch(marketPDA)
    expect(marketAccount.liquidity.toNumber()).toEqual(initializeParams.initial_liquidity + 500_000)
  })

  it('Withdraw Tokens', async () => {
    // Withdraw 200,000 tokens
    await program.methods
      .withdrawTokens(new anchor.BN(200_000))
      .accountsPartial({
        userAccount: userAccount.publicKey,
        market: marketPDA,
        reserveTokenAccount: marketReserveTokenAccount,
        userTokenAccount: userDepositTokenAccount,
        userLenAccount: userLenBonkAccount,
        authority: userAccount.publicKey,
        lenMint: lenbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([userAccount])
      .rpc()

    // Fetch and assert user account data
    const fetchedUserAccount = await program.account.userAccount.fetch(userAccount.publicKey)
    expect(fetchedUserAccount.deposits.length).toEqual(1)
    expect(fetchedUserAccount.deposits[0].amount.toNumber()).toEqual(500_000)
    expect(fetchedUserAccount.deposits[0].available.toNumber()).toEqual(300_000)

    // Fetch and assert market liquidity
    const marketAccount = await program.account.market.fetch(marketPDA)
    expect(marketAccount.liquidity.toNumber()).toEqual(initializeParams.initial_liquidity + 500_000 - 200_000)
  })

  it('Borrow Tokens', async () => {
    // Borrow 100,000 tokens
    await program.methods
      .borrowTokens(new anchor.BN(100_000))
      .accounts({
        userAccount: userAccount.publicKey,
        market: marketPDA,
        reserveTokenAccount: marketReserveTokenAccount,
        userTokenAccount: userDepositTokenAccount,
        userBorAccount: userBorBonkAccount,
        userLenbonkAccount: userLenBonkAccount,
        // The following accounts should be properly initialized or replaced with actual PDAs
        userLenjupAccount: Keypair.generate().publicKey,
        userLenlinkAccount: Keypair.generate().publicKey,
        userLensolAccount: Keypair.generate().publicKey,
        userLenusdcAccount: Keypair.generate().publicKey,
        userLenusdtAccount: Keypair.generate().publicKey,
        userLenwifAccount: Keypair.generate().publicKey,
        authority: userAccount.publicKey,
        borMint: borbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([userAccount])
      .rpc()

    // Fetch and assert market liquidity and total borrows
    const marketAccount = await program.account.market.fetch(marketPDA)
    expect(marketAccount.liquidity.toNumber()).toEqual(initializeParams.initial_liquidity + 500_000 - 200_000 - 100_000)
    expect(marketAccount.totalBorrows.toNumber()).toEqual(100_000)
  })

  it('Repay Borrow', async () => {
    // Repay 50,000 tokens
    await program.methods
      .repayBorrow(new anchor.BN(50_000))
      .accounts({
        userAccount: userAccount.publicKey,
        market: marketPDA,
        reserveTokenAccount: marketReserveTokenAccount,
        userTokenAccount: userDepositTokenAccount,
        userBorAccount: userBorBonkAccount,
        authority: userAccount.publicKey,
        borMint: borbonkMint,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([userAccount])
      .rpc()

    // Fetch and assert market liquidity and total borrows
    const marketAccount = await program.account.market.fetch(marketPDA)
    expect(marketAccount.liquidity.toNumber()).toEqual(
      initializeParams.initial_liquidity + 500_000 - 200_000 - 100_000 + 50_000
    )
    expect(marketAccount.totalBorrows.toNumber()).toEqual(50_000)
  })
})
