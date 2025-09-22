# FlipFlop Prototype

An interactive P5.js NFT art project built on Base blockchain using Next.js, TypeScript, and Web3 integration.

## Features

- 🎨 Interactive P5.js generative art
- 🔗 Web3 wallet connection (MetaMask, Coinbase Wallet, etc.)
- ⛓️ Base blockchain integration
- 🎯 Modern Next.js + TypeScript stack
- 💎 Ready for NFT minting integration

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Creative**: P5.js
- **Web3**: Reown AppKit (formerly WalletConnect), Wagmi, Viem
- **Blockchain**: Base (Layer 2)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Reown Project ID from [cloud.reown.com](https://cloud.reown.com)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cryptoflops/flipflop-prototype.git
cd flipflop-prototype
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Edit `.env.local` and add your Reown Project ID:
```
NEXT_PUBLIC_REOWN_PROJECT_ID=your_project_id_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
flipflop-prototype/
├── app/              # Next.js app directory
│   ├── layout.tsx    # Root layout with providers
│   ├── page.tsx      # Main page
│   └── globals.css   # Global styles
├── components/       # React components
│   ├── ConnectWallet.tsx
│   ├── P5Sketch.tsx
│   └── AppKitProvider.tsx
├── lib/              # Library configurations
│   └── appkit.ts     # Web3 wallet configuration
├── public/           # Static assets
│   └── p5/          # P5.js sketches
└── assets/          # Media files
```

## Usage

### Interactive Canvas

- **Move mouse**: Draw colorful trails
- **Click**: Clear the canvas
- **Press 'C'**: Clear the canvas
- **Press 'S'**: Save a screenshot

### Wallet Connection

1. Click the "Connect Wallet" button in the top right
2. Choose your preferred wallet
3. Connect to Base network

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Deployment

The app is ready for deployment to Vercel:

```bash
npm run build
```

Or deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/cryptoflops/flipflop-prototype)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- P5.js community for the creative coding framework
- Base team for the L2 blockchain
- Reown (WalletConnect) for Web3 wallet integration
