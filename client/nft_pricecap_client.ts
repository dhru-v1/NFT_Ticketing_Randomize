import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { NftPricecap } from "../target/types/nft_pricecap";

const main = async () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.NftPricecap as Program<NftPricecap>;

  const nftData = anchor.web3.Keypair.generate();
  const priceCap = new anchor.BN(10000000); // 0.01 SOL cap

  // Step 1: Initialize the NFT with price cap
  await program.methods
    .initializeNft(priceCap)
    .accounts({
      nftData: nftData.publicKey,
      owner: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([nftData])
    .rpc();

  console.log("NFT initialized at:", nftData.publicKey.toBase58());

  // Step 2: Try a transfer within the cap
  const newOwner = anchor.web3.Keypair.generate();
  await program.methods
    .transferNft(new anchor.BN(9000000)) // under cap
    .accounts({
      nftData: nftData.publicKey,
      owner: provider.wallet.publicKey,
      newOwner: newOwner.publicKey,
    })
    .rpc();

  console.log("Transfer to", newOwner.publicKey.toBase58(), "successful.");
};

main().catch((err) => {
  console.error(err);
});
