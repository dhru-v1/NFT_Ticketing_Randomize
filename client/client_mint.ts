import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Program, AnchorProvider, BN, web3 } from "@coral-xyz/anchor";
import { NftPricecap } from "../target/types/nft_pricecap";

import {
  bundlrStorage,
  keypairIdentity,
  Metaplex,
} from "@metaplex-foundation/js";

const run = async () => {
  // Initialize Provider & Program
  const provider = AnchorProvider.env();
  const wallet = provider.wallet as any;
  const connection = provider.connection;

  const PROGRAM_ID = new PublicKey("Dupoam5in2b1ZdBDgZsy3V5oBfT4KcUsuUoZWm9qD5Bx"); // 🔁 update this

  const program = new Program<NftPricecap>(
    await Program.fetchIdl(PROGRAM_ID, provider),
    PROGRAM_ID,
    provider
  );

  // Init Metaplex
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(wallet.payer))
    .use(bundlrStorage());

  console.log("🪄 Minting NFT...");

  const { nft } = await metaplex.nfts().create({
    uri: "https://arweave.net/B2T0bA0P4MYOUR_METADATA.json", // Update to your metadata
    name: "Capped NFT",
    symbol: "CPT",
    sellerFeeBasisPoints: 500,
    maxSupply: new BN(1), // ✅ FIXED: must be BN
  });

  console.log("✅ NFT Minted:", nft.address.toBase58());

  // Prepare for smart contract
  const nftData = Keypair.generate(); // For storing NFT + cap

  const priceCapLamports = new BN(Math.floor(0.05 * LAMPORTS_PER_SOL)); // ✅ safer way

  const tx = await program.methods
    .initializeNft(priceCapLamports)
    .accounts({
      nftData: nftData.publicKey,
      mint: nft.address,
      owner: wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([nftData])
    .rpc();

  console.log("✅ NFT price cap set!");
  console.log("🔗 Tx Hash:", tx);
};

run().catch((err) => {
  console.error("❌ Error running script:", err);
});

