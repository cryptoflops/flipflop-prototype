import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, mainnet } from 'viem/chains'

// Get projectId from https://cloud.reown.com
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID || ''

// Set up metadata
const metadata = {
  name: 'FlipFlop Prototype',
  description: 'Interactive P5.js NFT Art on Base',
  url: 'https://flipflop.art', // Update with your domain
  icons: ['https://avatars.githubusercontent.com/u/179229932'] // Update with your logo
}

// Create wagmiAdapter
const wagmiAdapter = new WagmiAdapter({
  chains: [base, mainnet],
  projectId,
  metadata
})

// Create the modal
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata,
  features: {
    analytics: true,
    email: true,
    socials: ['google', 'x', 'github', 'discord']
  },
  themeMode: 'dark'
})

export default appKit