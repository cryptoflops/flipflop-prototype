export type Asset = {
  id: number;
  name: string;
  image: string;
  description: string;
  totalShares: number;
  ownedShares: number;
  pricePerShare: number;
  category: 'real-estate' | 'art' | 'music' | 'collectible';
  apy?: number; // Annual Percentage Yield for income-generating assets
};

export const mockAssets: Asset[] = [
  {
    id: 1,
    name: "🏛️ Manhattan Loft #42",
    image: "/assets/real_estate.jpg",
    description: "Fractional ownership of a luxury apartment in NYC's Upper East Side. Monthly rental income distributed to shareholders.",
    totalShares: 10000,
    ownedShares: 250,
    pricePerShare: 125.50,
    category: 'real-estate',
    apy: 5.2
  },
  {
    id: 2,
    name: "🎨 Digital Genesis #001",
    image: "/assets/art_nft.jpg",
    description: "Tokenized ownership of a famous digital art piece by renowned crypto artist. Museum exhibition rights included.",
    totalShares: 500,
    ownedShares: 50,
    pricePerShare: 450.00,
    category: 'art'
  },
  {
    id: 3,
    name: "🎵 Indie Album Royalties",
    image: "/assets/music.jpg",
    description: "Own a share of streaming royalties from 'Electric Dreams' by The Synthwave Collective. Quarterly payouts.",
    totalShares: 1000,
    ownedShares: 10,
    pricePerShare: 25.00,
    category: 'music',
    apy: 8.5
  },
  {
    id: 4,
    name: "🏖️ Miami Beach Property",
    image: "/assets/beach_property.jpg",
    description: "Prime beachfront condo in South Beach. Short-term rental income with vacation property benefits.",
    totalShares: 5000,
    ownedShares: 0,
    pricePerShare: 200.00,
    category: 'real-estate',
    apy: 7.1
  },
  {
    id: 5,
    name: "🖼️ Classic NFT Collection",
    image: "/assets/nft_collection.jpg",
    description: "Bundle of 10 blue-chip NFTs including CryptoPunks and BAYC derivatives. Governance rights included.",
    totalShares: 100,
    ownedShares: 5,
    pricePerShare: 2500.00,
    category: 'collectible'
  },
  {
    id: 6,
    name: "🎸 Vintage Guitar Fund",
    image: "/assets/guitar.jpg",
    description: "Collection of rare vintage guitars (1950s-1970s). Physical assets stored in climate-controlled vault.",
    totalShares: 2000,
    ownedShares: 100,
    pricePerShare: 75.00,
    category: 'collectible'
  }
];