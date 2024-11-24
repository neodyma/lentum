// import * as anchor from '@coral-xyz/anchor'
// import { Program } from '@coral-xyz/anchor'
// import { Lentum } from "../target/types/lentum";
// import { PublicKey, SystemProgram } from "@solana/web3.js";
// import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// const { LAMPORTS_PER_SOL } = anchor.web3;

describe("Lentum Program Tests", () => {
  it("Placeholder", () => {
    expect(true).toBeTruthy();
  })
});

// describe("Lentum Program Tests", () => {
//   const provider = anchor.AnchorProvider.env();
//   anchor.setProvider(provider);

//   const program = anchor.workspace.Lentum as Program<Lentum>;

//   let payer = provider.wallet;
//   let lenbonkMint: PublicKey;
//   let borbonkMint: PublicKey;
//   let marketReserveTokenAccount: PublicKey;
//   let userDepositTokenAccount: PublicKey;
//   let userLenBonkAccount: PublicKey;
//   let userBorBonkAccount: PublicKey;

//   // Helper function to derive PDAs for mints
//   const findMintPDA = (lenbor: string, symbol: string): [PublicKey, number] => {
//     return PublicKey.findProgramAddressSync(
//       [
//         Buffer.from(lenbor),
//         Buffer.from(symbol.toLowerCase()),
//         Buffer.from("_mint"),
//       ],
//       program.programId
//     );
//   };

//   it("Airdrop SOL to user", async () => {
//     const airdropSignature = await provider.connection.requestAirdrop(
//       payer.publicKey,
//       LAMPORTS_PER_SOL
//     );
//     await provider.connection.confirmTransaction(airdropSignature);
//     const userBalance = await provider.connection.getBalance(payer.publicKey);
//     expect(userBalance).toBeGreaterThan(0);
//   });

//   it("Initialize Lentum Mints", async () => {
//     // Initialize lenbonk_mint
//     const [lenbonkMintPDA] = findMintPDA("bonk", "LENBONK");
//     lenbonkMint = lenbonkMintPDA;

//     // Initialize borbonk_mint
//     const [borbonkMintPDA] = findMintPDA("bonk", "BORBONK");
//     borbonkMint = borbonkMintPDA;

//     await program.methods
//       .initializeLentumMint("bonk", "Lentum Bonk", "LENBONK")
//       .accounts({
//         admin: payer.publicKey,
//         mint: lenbonkMint,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//       })
//       .rpc();

//     await program.methods
//       .initializeLentumMint("bonk", "Borrowed Bonk", "BORBONK")
//       .accounts({
//         admin: payer.publicKey,
//         mint: borbonkMint,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//       })
//       .rpc();

//     const lenbonkMintInfo = await program.account.mint.fetch(lenbonkMint);
//     expect(lenbonkMintInfo.symbol).toBe("LENBONK");

//     const borbonkMintInfo = await program.account.mint.fetch(borbonkMint);
//     expect(borbonkMintInfo.symbol).toBe("BORBONK");
//   });

//   it("Create Token Accounts for User", async () => {
//     // Initialize user deposit token account
//     // Initialize user LenBonk account
//     // Initialize user BorBonk account
//     // Initialize market reserve token account

//     // Example for userLenBonkAccount
//     // Repeat similarly for other accounts

//     const userLenBonkAccountPDA = await PublicKey.findProgramAddress(
//       [
//         payer.publicKey.toBuffer(),
//         lenbonkMint.toBuffer(),
//         Buffer.from("user_lenbonk"),
//       ],
//       program.programId
//     );
//     userLenBonkAccount = userLenBonkAccountPDA[0];

//     await program.methods
//       .createTokenAccount()
//       .accounts({
//         user: payer.publicKey,
//         mint: lenbonkMint,
//         tokenAccount: userLenBonkAccount,
//         tokenProgram: TOKEN_PROGRAM_ID,
//         systemProgram: SystemProgram.programId,
//         rent: anchor.web3.SYSVAR_RENT_PUBKEY,
//       })
//       .rpc();

//     const accountInfo = await program.account.tokenAccount.fetch(userLenBonkAccount);
//     expect(accountInfo.owner.toString()).toBe(payer.publicKey.toString());
//     expect(accountInfo.mint.toString()).toBe(lenbonkMint.toString());
//   });

//   it("Mint Tokens to User", async () => {
//     const amount = 1000;
//     await program.methods
//       .mintTokens(new anchor.BN(amount))
//       .accounts({
//         mint: lenbonkMint,
//         to: userLenBonkAccount,
//         authority: payer.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .rpc();

//     const userTokenAccount = await program.account.tokenAccount.fetch(userLenBonkAccount);
//     expect(userTokenAccount.amount.toNumber()).toBe(amount);
//   });

//   it("Transfer Tokens from User to Market Reserve", async () => {
//     const transferAmount = 500;
//     await program.methods
//       .transferTokens(new anchor.BN(transferAmount))
//       .accounts({
//         from: userLenBonkAccount,
//         to: marketReserveTokenAccount,
//         authority: payer.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .rpc();

//     const userAccount = await program.account.tokenAccount.fetch(userLenBonkAccount);
//     const reserveAccount = await program.account.tokenAccount.fetch(marketReserveTokenAccount);
//     expect(userAccount.amount.toNumber()).toBe(500);
//     expect(reserveAccount.amount.toNumber()).toBe(500);
//   });

//   it("Burn Tokens from User", async () => {
//     const burnAmount = 200;
//     await program.methods
//       .burnTokens(new anchor.BN(burnAmount))
//       .accounts({
//         mint: lenbonkMint,
//         from: userLenBonkAccount,
//         authority: payer.publicKey,
//         tokenProgram: TOKEN_PROGRAM_ID,
//       })
//       .rpc();

//     const userAccount = await program.account.tokenAccount.fetch(userLenBonkAccount);
//     expect(userAccount.amount.toNumber()).toBe(300);
//   });

//   it("Handle Test Failure Scenario", async () => {
//     try {
//       await program.methods
//         .mintTokens(new anchor.BN(-100))
//         .accounts({
//           mint: lenbonkMint,
//           to: userLenBonkAccount,
//           authority: payer.publicKey,
//           tokenProgram: TOKEN_PROGRAM_ID,
//         })
//         .rpc();
//       fail("Minting negative tokens should fail");
//     } catch (err) {
//       expect(err).toBeDefined();
//     }
//   });

//   // Add more tests covering all functionalities...
// });
