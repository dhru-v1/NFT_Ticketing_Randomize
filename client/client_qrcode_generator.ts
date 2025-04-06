import QRCode from 'qrcode';

// Let's say `nftMintAddress` is returned from your on-chain program
const nftMintAddress = "8nftgAbY..."; // replace with actual mint address

// Create a verification URL or link to NFT explorer
const nftUrl = `https://explorer.solana.com/address/${nftMintAddress}?cluster=devnet`;

QRCode.toDataURL(nftUrl, function (err, url) {
  if (err) throw err;
  console.log("QR Code generated:", url);
  const img = document.createElement("img");
  img.src = url;
  document.body.appendChild(img); // if running in browser
});
