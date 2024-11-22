import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Lentum} from '../target/types/lentum'

describe('lentum', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Lentum as Program<Lentum>

  const lentumKeypair = Keypair.generate()

  it('Initialize Lentum', async () => {
    await program.methods
      .initialize()
      .accounts({
        lentum: lentumKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([lentumKeypair])
      .rpc()

    const currentCount = await program.account.lentum.fetch(lentumKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Lentum', async () => {
    await program.methods.increment().accounts({ lentum: lentumKeypair.publicKey }).rpc()

    const currentCount = await program.account.lentum.fetch(lentumKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Lentum Again', async () => {
    await program.methods.increment().accounts({ lentum: lentumKeypair.publicKey }).rpc()

    const currentCount = await program.account.lentum.fetch(lentumKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Lentum', async () => {
    await program.methods.decrement().accounts({ lentum: lentumKeypair.publicKey }).rpc()

    const currentCount = await program.account.lentum.fetch(lentumKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set lentum value', async () => {
    await program.methods.set(42).accounts({ lentum: lentumKeypair.publicKey }).rpc()

    const currentCount = await program.account.lentum.fetch(lentumKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the lentum account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        lentum: lentumKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.lentum.fetchNullable(lentumKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
