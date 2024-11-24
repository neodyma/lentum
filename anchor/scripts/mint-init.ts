import { SystemProgram, Connection, clusterApiUrl, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { createCreateMetadataAccountV3Instruction } from "@metaplex-foundation/mpl-token-metadata";
import * as fs from 'fs';
import * as readline from 'readline';

async function main() {
  // Connect to Devnet
  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
  const meta_program_id = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

  // Load wallet keypair
  const walletPath = process.env.HOME + '/.config/solana/id.json';
  const secretKeyString = fs.readFileSync(walletPath, 'utf8');
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const payer = Keypair.fromSecretKey(secretKey);

  // Airdrop SOL to payer if needed
  const balance = await connection.getBalance(payer.publicKey);
  if (balance < LAMPORTS_PER_SOL / 20) {
    const airdropSignature = await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignature, 'confirmed');
    console.log('Airdropped 1 SOL to payer.');
  }

  // Get user input for token parameters
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query: string) => new Promise<string>((resolve) => rl.question(query, resolve));

  // const name = await question('Enter token name: ');
  // const symbol = await question('Enter token symbol: ');
  //   const decimalsInput = await question('Enter number of decimals: ');
  //   const decimals = parseInt(decimalsInput, 10);

  rl.close();

  const seed = "lentumMarket";
  const programId = new PublicKey("LentumHwpvG7jndx9EEE42M28DZ6EHEedogVCyjt7mL");

  //   const authority = PublicKey.findProgramAddressSync([Buffer.from(seed)], programId)[0];

  const [authority] = PublicKey.findProgramAddressSync(
    [Buffer.from(seed)],
    programId
  );

  const metadatas = [
    { name: "Lended BONK", symbol: "lenBONK" },
    { name: "Lended JUPSOL", symbol: "lenJUPSOL" },
    { name: "Lended LINK", symbol: "lenLINK" },
    { name: "Lended SOL", symbol: "lenSOL" },
    { name: "Lended USDC", symbol: "lenUSDC" },
    { name: "Lended USDT", symbol: "lenUSDT" },
    { name: "Lended WIF", symbol: "lenWIF" },

    { name: "Borrowed BONK", symbol: "borBONK" },
    { name: "Borrowed JUPSOL", symbol: "borJUPSOL" },
    { name: "Borrowed LINK", symbol: "borLINK" },
    { name: "Borrowed SOL", symbol: "borSOL" },
    { name: "Borrowed USDC", symbol: "borUSDC" },
    { name: "Borrowed USDT", symbol: "borUSDT" },
    { name: "Borrowed WIF", symbol: "borWIF" },
  ];

  let meta_transaction = new Transaction();

  for (var metadata of metadatas) {
    var mint = await createMint(connection, payer, authority, null, 9);
    var mint_pubkey = new PublicKey(mint.toBase58());

    // var metaPDA = PublicKey.findProgramAddressSync([Buffer.from("metadata"), meta_program_id.toBuffer(), mint_pubkey.toBuffer()], meta_program_id)[0];

    // var metaInst = createCreateMetadataAccountV3Instruction({ metadata: metaPDA, mint: mint_pubkey, }, { data: metadata });

    console.log(`Created token ${metadata.name} (${metadata.symbol}) with Mint Address: ${mint.toBase58()}`);
  }


  // Create new SPL Token
  // const mint = await createMint(
  //   connection,
  //   payer,
  //   authority,
  //   null,
  //   9
  // );

  // console.log(`Created token ${name} (${symbol}) with Mint Address: ${mint.toBase58()}`);

  // // Create Associated Token Account for the payer
  // const tokenAccount = await getOrCreateAssociatedTokenAccount(
  //   connection,
  //   payer,
  //   mint,
  //   payer.publicKey
  // );

  // // Mint initial supply to the token account
  // const initialSupply = 1000 * Math.pow(10, 9);
  // await mintTo(
  //   connection,
  //   payer,
  //   mint,
  //   tokenAccount.address,
  //   payer,
  //   initialSupply
  // );

  // console.log(`Minted ${initialSupply / Math.pow(10, 9)} ${symbol} to ${tokenAccount.address.toBase58()}`);
}

main().catch((err) => {
  console.error(err);
});
