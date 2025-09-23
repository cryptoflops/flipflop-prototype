'use client'

import { useState, useEffect } from 'react';
import { mockAssets, Asset } from '@/lib/mockAssets';
import { AssetCard } from '@/components/AssetCard';
import ConnectWallet from '@/components/ConnectWallet';
import Link from 'next/link';

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [filter, setFilter] = useState<string>('all');
  const [totalValue, setTotalValue] = useState(0);
  const [totalOwned, setTotalOwned] = useState(0);

  // Calculate portfolio stats
  useEffect(() => {
    const value = assets.reduce((sum, asset) => 
      sum + (asset.ownedShares * asset.pricePerShare), 0
    );
    const owned = assets.filter(asset => asset.ownedShares > 0).length;
    
    setTotalValue(value);
    setTotalOwned(owned);
  }, [assets]);

  const handleAssetUpdate = (id: number, newShares: number) => {
    setAssets(prevAssets => 
      prevAssets.map(asset => 
        asset.id === id ? { ...asset, ownedShares: newShares } : asset
      )
    );
  };

  const filteredAssets = filter === 'all' 
    ? assets 
    : filter === 'owned'
    ? assets.filter(a => a.ownedShares > 0)
    : assets.filter(a => a.category === filter);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Navigation Header */}
      <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-lg border-b border-gray-800 z-40">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-white hover:text-blue-400 transition-colors">
              ← Back
            </Link>
            <h1 className="text-2xl font-bold text-white">Fractional Assets</h1>
          </div>
          <ConnectWallet />
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="container mx-auto px-4 pt-24 pb-8">
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl border border-gray-700 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Portfolio Value</p>
              <p className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Assets Owned</p>
              <p className="text-3xl font-bold text-blue-400">{totalOwned}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-1">Available Assets</p>
              <p className="text-3xl font-bold text-green-400">{assets.length}</p>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            All Assets
          </button>
          <button
            onClick={() => setFilter('owned')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'owned' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            My Holdings
          </button>
          <button
            onClick={() => setFilter('real-estate')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'real-estate' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Real Estate
          </button>
          <button
            onClick={() => setFilter('art')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'art' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Art
          </button>
          <button
            onClick={() => setFilter('music')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'music' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Music
          </button>
          <button
            onClick={() => setFilter('collectible')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'collectible' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            Collectibles
          </button>
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => (
            <AssetCard 
              key={asset.id} 
              asset={asset} 
              onUpdate={handleAssetUpdate}
            />
          ))}
        </div>

        {filteredAssets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No assets found in this category</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="container mx-auto px-4 py-8 mt-12 border-t border-gray-800">
        <div className="text-center text-gray-500 text-sm">
          <p className="mb-2">🔒 All transactions are simulated in this demo</p>
          <p>Connect your wallet to track your portfolio across sessions</p>
        </div>
      </div>
    </main>
  );
}