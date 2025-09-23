'use client'

import { useState } from 'react';
import { Asset } from '@/lib/mockAssets';

type Props = {
  asset: Asset;
  onUpdate?: (id: number, newShares: number) => void;
};

export const AssetCard = ({ asset, onUpdate }: Props) => {
  const [shares, setShares] = useState(asset.ownedShares);
  const [amount, setAmount] = useState(1);
  const [isTransacting, setIsTransacting] = useState(false);
  
  const ownershipPercent = ((shares / asset.totalShares) * 100).toFixed(2);
  const totalValue = (shares * asset.pricePerShare).toFixed(2);
  const availableShares = asset.totalShares - shares;

  const handleBuy = async () => {
    if (amount <= 0 || amount > availableShares) return;
    
    setIsTransacting(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newShares = shares + amount;
    setShares(newShares);
    setAmount(1);
    setIsTransacting(false);
    
    if (onUpdate) {
      onUpdate(asset.id, newShares);
    }
  };

  const handleSell = async () => {
    if (amount <= 0 || amount > shares) return;
    
    setIsTransacting(true);
    // Simulate transaction delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newShares = shares - amount;
    setShares(newShares);
    setAmount(1);
    setIsTransacting(false);
    
    if (onUpdate) {
      onUpdate(asset.id, newShares);
    }
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/20" />
        <span className="text-6xl z-10">{asset.name.split(' ')[0]}</span>
        {asset.apy && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
            {asset.apy}% APY
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2 text-white">{asset.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{asset.description}</p>
        
        {/* Ownership Stats */}
        <div className="bg-gray-900/50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Your Shares</span>
            <span className="text-white font-bold">{shares} / {asset.totalShares}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-500 text-sm">Ownership</span>
            <span className="text-blue-400 font-bold">{ownershipPercent}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">Total Value</span>
            <span className="text-green-400 font-bold">${totalValue}</span>
          </div>
        </div>

        {/* Price Info */}
        <div className="text-center mb-4">
          <span className="text-gray-500 text-sm">Price per share: </span>
          <span className="text-white font-bold">${asset.pricePerShare}</span>
        </div>
        
        {/* Transaction Controls */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={Math.max(availableShares, shares)}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-center"
              disabled={isTransacting}
            />
            <span className="text-gray-500 text-sm">shares</span>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleBuy}
              disabled={isTransacting || amount > availableShares}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {isTransacting ? '...' : `Buy (${availableShares} left)`}
            </button>
            <button
              onClick={handleSell}
              disabled={isTransacting || shares === 0 || amount > shares}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed transition-colors"
            >
              {isTransacting ? '...' : 'Sell'}
            </button>
          </div>
        </div>
        
        {/* Category Badge */}
        <div className="mt-4 flex justify-center">
          <span className={`text-xs px-2 py-1 rounded-full ${
            asset.category === 'real-estate' ? 'bg-blue-900 text-blue-300' :
            asset.category === 'art' ? 'bg-purple-900 text-purple-300' :
            asset.category === 'music' ? 'bg-pink-900 text-pink-300' :
            'bg-yellow-900 text-yellow-300'
          }`}>
            {asset.category.replace('-', ' ').toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};