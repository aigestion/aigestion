// Blockchain Integration for Digital Assets in AIGestion Virtual Office
import { engine, InputAction, Material, MeshRenderer, pointerEventsSystem, Transform } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { soundSystem } from './enhanced-sound'

interface DigitalAsset {
  id: string
  name: string
  type: 'nft' | 'token' | 'certificate' | 'badge' | 'collectible' | 'document'
  blockchain: string
  contractAddress: string
  tokenId: string
  owner: string
  metadata: AssetMetadata
  value: number
  currency: string
  isVerified: boolean
  createdAt: number
  lastTransferred: number
}

interface AssetMetadata {
  description: string
  image: string
  attributes: Map<string, any>
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  category: string
  creator: string
  royalties: number
}

interface Wallet {
  id: string
  address: string
  chain: string
  balance: Map<string, number>
  assets: DigitalAsset[]
  isConnected: boolean
  permissions: string[]
}

interface Transaction {
  id: string
  type: 'transfer' | 'mint' | 'burn' | 'approve' | 'swap'
  from: string
  to: string
  asset: DigitalAsset
  amount: number
  gasFee: number
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: number
  blockNumber?: number
}

interface SmartContract {
  id: string
  name: string
  address: string
  abi: any[]
  functions: Map<string, ContractFunction>
  isActive: boolean
}

interface ContractFunction {
  name: string
  inputs: FunctionParameter[]
  outputs: FunctionParameter[]
  isPayable: boolean
  isView: boolean
}

interface FunctionParameter {
  name: string
  type: string
  value?: any
}

export class BlockchainIntegrationSystem {
  private wallets: Map<string, Wallet> = new Map()
  private assets: Map<string, DigitalAsset> = new Map()
  private transactions: Map<string, Transaction> = new Map()
  private contracts: Map<string, SmartContract> = new Map()
  private blockchainUI: any
  private isInitialized: boolean = false
  private currentWallet: Wallet | null = null
  private supportedChains: string[] = ['ethereum', 'polygon', 'arbitrum', 'optimism']
  private gasPrices: Map<string, number> = new Map()

  constructor() {
    this.initializeGasPrices()
  }

  // Initialize blockchain system
  initialize() {
    console.log('⛓️ Blockchain Integration System Initializing...')

    this.setupSmartContracts()
    this.createBlockchainUI()
    this.createDefaultWallet()
    this.initializeBlockchainConnection()
    this.startBlockchainEngine()

    this.isInitialized = true
    console.log('⛓️ Blockchain Integration System Ready!')
  }

  // Initialize gas prices
  private initializeGasPrices() {
    this.gasPrices.set('ethereum', 20)
    this.gasPrices.set('polygon', 30)
    this.gasPrices.set('arbitrum', 0.1)
    this.gasPrices.set('optimism', 0.1)
  }

  // Setup smart contracts
  private setupSmartContracts() {
    // Asset Registry Contract
    this.contracts.set('asset_registry', {
      id: 'asset_registry',
      name: 'Asset Registry',
      address: '0x1234567890123456789012345678901234567890',
      abi: [],
      functions: new Map([
        ['mintAsset', {
          name: 'mintAsset',
          inputs: [
            { name: 'to', type: 'address' },
            { name: 'uri', type: 'string' }
          ],
          outputs: [{ name: 'tokenId', type: 'uint256' }],
          isPayable: false,
          isView: false
        }],
        ['transferAsset', {
          name: 'transferAsset',
          inputs: [
            { name: 'from', type: 'address' },
            { name: 'to', type: 'address' },
            { name: 'tokenId', type: 'uint256' }
          ],
          outputs: [],
          isPayable: false,
          isView: false
        }]
      ]),
      isActive: true
    })

    // Certificate Contract
    this.contracts.set('certificate', {
      id: 'certificate',
      name: 'Certificate Registry',
      address: '0x2345678901234567890123456789012345678901',
      abi: [],
      functions: new Map([
        ['issueCertificate', {
          name: 'issueCertificate',
          inputs: [
            { name: 'recipient', type: 'address' },
            { name: 'metadata', type: 'string' }
          ],
          outputs: [{ name: 'certificateId', type: 'uint256' }],
          isPayable: false,
          isView: false
        }],
        ['verifyCertificate', {
          name: 'verifyCertificate',
          inputs: [
            { name: 'certificateId', type: 'uint256' }
          ],
          outputs: [{ name: 'isValid', type: 'bool' }],
          isPayable: false,
          isView: true
        }]
      ]),
      isActive: true
    })

    // Badge Contract
    this.contracts.set('badge', {
      id: 'badge',
      name: 'Achievement Badges',
      address: '0x3456789012345678901234567890123456789012',
      abi: [],
      functions: new Map([
        ['awardBadge', {
          name: 'awardBadge',
          inputs: [
            { name: 'user', type: 'address' },
            { name: 'badgeType', type: 'uint256' }
          ],
          outputs: [],
          isPayable: false,
          isView: false
        }],
        ['getUserBadges', {
          name: 'getUserBadges',
          inputs: [
            { name: 'user', type: 'address' }
          ],
          outputs: [{ name: 'badgeIds', type: 'uint256[]' }],
          isPayable: false,
          isView: true
        }]
      ]),
      isActive: true
    })
  }

  // Create blockchain UI
  private createBlockchainUI() {
    this.blockchainUI = engine.addEntity()
    Transform.create(this.blockchainUI, {
      position: Vector3.create(2, 3, 8),
      scale: Vector3.create(3, 4, 0.1)
    })
    MeshRenderer.setBox(this.blockchainUI)
    Material.setPbrMaterial(this.blockchainUI, {
      albedoColor: Color4.create(0.1, 0.2, 0.4, 0.9),
      emissiveColor: Color4.create(0.2, 0.4, 0.8, 0.5),
      emissiveIntensity: 2
    })

    // Create title
    const title = engine.addEntity()
    Transform.create(title, {
      parent: this.blockchainUI,
      position: Vector3.create(0, 1.7, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(title, {
      text: '⛓️ BLOCKCHAIN ASSETS',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 2,
      textAlign: 3
    })

    // Create wallet section
    this.createWalletSection()

    // Create assets section
    this.createAssetsSection()

    // Create transactions section
    this.createTransactionsSection()

    // Create controls section
    this.createBlockchainControls()
  }

  // Create wallet section
  private createWalletSection() {
    const walletSection = engine.addEntity()
    Transform.create(walletSection, {
      parent: this.blockchainUI,
      position: Vector3.create(0, 1.2, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(walletSection)
    Material.setPbrMaterial(walletSection, {
      albedoColor: Color4.create(0.2, 0.2, 0.2, 0.8),
      emissiveColor: Color4.create(0.2, 0.2, 0.2, 0.3),
      emissiveIntensity: 1
    })

    const walletText = engine.addEntity()
    Transform.create(walletText, {
      parent: walletSection,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(walletText, {
      text: '👛 WALLET: Not Connected',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Create assets section
  private createAssetsSection() {
    const assetsSection = engine.addEntity()
    Transform.create(assetsSection, {
      parent: this.blockchainUI,
      position: Vector3.create(0, 0.5, 0.1),
      scale: Vector3.create(0.8, 0.4, 0.1)
    })
    MeshRenderer.setBox(assetsSection)
    Material.setPbrMaterial(assetsSection, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const assetsText = engine.addEntity()
    Transform.create(assetsText, {
      parent: assetsSection,
      position: Vector3.create(0, 0.1, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(assetsText, {
      text: '🎨 ASSETS: 0',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Create transactions section
  private createTransactionsSection() {
    const transactionsSection = engine.addEntity()
    Transform.create(transactionsSection, {
      parent: this.blockchainUI,
      position: Vector3.create(0, -0.2, 0.1),
      scale: Vector3.create(0.8, 0.3, 0.1)
    })
    MeshRenderer.setBox(transactionsSection)
    Material.setPbrMaterial(transactionsSection, {
      albedoColor: Color4.create(0.1, 0.1, 0.1, 0.8),
      emissiveColor: Color4.create(0.1, 0.1, 0.1, 0.3),
      emissiveIntensity: 1
    })

    const transactionsText = engine.addEntity()
    Transform.create(transactionsText, {
      parent: transactionsSection,
      position: Vector3.create(0, 0, 0.1),
      scale: Vector3.create(0.3, 0.3, 0.3)
    })
    TextShape.create(transactionsText, {
      text: '📊 TRANSACTIONS: 0',
      textColor: Color4.create(1, 1, 1, 1),
      fontSize: 1.5,
      textAlign: 3
    })
  }

  // Create blockchain controls
  private createBlockchainControls() {
    const controls = [
      { id: 'connect', icon: '🔗', name: 'Connect Wallet' },
      { id: 'mint', icon: '🎨', name: 'Mint Asset' },
      { id: 'transfer', icon: '💸', name: 'Transfer' },
      { id: 'verify', icon: '✅', name: 'Verify' }
    ]

    let xOffset = -0.9

    controls.forEach(control => {
      const button = engine.addEntity()
      Transform.create(button, {
        parent: this.blockchainUI,
        position: Vector3.create(xOffset, -0.7, 0.1),
        scale: Vector3.create(0.3, 0.3, 0.1)
      })
      MeshRenderer.setBox(button)
      Material.setPbrMaterial(button, {
        albedoColor: Color4.create(0.3, 0.6, 0.8, 1),
        emissiveColor: Color4.create(0.3, 0.6, 0.8, 0.5),
        emissiveIntensity: 2
      })

      const buttonText = engine.addEntity()
      Transform.create(buttonText, {
        parent: button,
        position: Vector3.create(0, 0, 0.1),
        scale: Vector3.create(0.5, 0.5, 0.5)
      })
      TextShape.create(buttonText, {
        text: control.icon,
        textColor: Color4.create(1, 1, 1, 1),
        fontSize: 2,
        textAlign: 3
      })

      pointerEventsSystem.onPointerDown(
        {
          entity: button,
          opts: { button: InputAction.IA_POINTER, hoverText: control.name }
        },
        () => this.handleBlockchainControl(control.id)
      )

      xOffset += 0.6
    })
  }

  // Create default wallet
  private createDefaultWallet() {
    const wallet: Wallet = {
      id: 'wallet_default',
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      chain: 'ethereum',
      balance: new Map([
        ['ETH', 2.5],
        ['USDC', 1000],
        ['AIG', 500]
      ]),
      assets: [],
      isConnected: false,
      permissions: ['read', 'write', 'admin']
    }

    this.wallets.set(wallet.id, wallet)
    console.log('👛 Default wallet created')
  }

  // Initialize blockchain connection
  private initializeBlockchainConnection() {
    console.log('🔗 Initializing blockchain connections...')

    // Simulate connection to multiple chains
    this.supportedChains.forEach(chain => {
      console.log(`📡 Connected to ${chain}`)
    })
  }

  // Start blockchain engine
  private startBlockchainEngine() {
    engine.addSystem(() => {
      if (!this.isInitialized) return

      this.updateBlockchainUI()
      this.simulateBlockchainActivity()
      this.updateGasPrices()
    })
  }

  // Handle blockchain control
  private handleBlockchainControl(controlId: string) {
    switch (controlId) {
      case 'connect':
        this.connectWallet()
        break
      case 'mint':
        this.mintAsset()
        break
      case 'transfer':
        this.transferAsset()
        break
      case 'verify':
        this.verifyAsset()
        break
    }

    soundSystem.playInteractionSound('click')
  }

  // Connect wallet
  public connectWallet() {
    if (this.currentWallet && this.currentWallet.isConnected) {
      console.log('👛 Wallet already connected')
      return
    }

    const wallet = this.wallets.get('wallet_default')
    if (!wallet) return

    wallet.isConnected = true
    this.currentWallet = wallet

    console.log('🔗 Wallet connected successfully')
    console.log(`📍 Address: ${wallet.address}`)
    console.log(`⛓️ Chain: ${wallet.chain}`)

    soundSystem.playInteractionSound('powerup')
  }

  // Disconnect wallet
  public disconnectWallet() {
    if (!this.currentWallet) return

    this.currentWallet.isConnected = false
    console.log('🔌 Wallet disconnected')

    soundSystem.playInteractionSound('click')
  }

  // Mint asset
  public mintAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log('❌ Please connect wallet first')
      return
    }

    const asset: DigitalAsset = {
      id: `asset_${Date.now()}`,
      name: `AIG Asset #${this.assets.size + 1}`,
      type: 'nft',
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get('asset_registry')?.address || '',
      tokenId: (this.assets.size + 1).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: 'AIGestion Virtual Office Asset',
        image: 'ipfs://QmHash...',
        attributes: new Map([
          ['created_by', 'AIGestion'],
          ['office_space', 'virtual'],
          ['utility', 'productivity']
        ]),
        rarity: 'rare',
        category: 'office',
        creator: 'AIGestion',
        royalties: 2.5
      },
      value: 0.1,
      currency: 'ETH',
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    }

    this.assets.set(asset.id, asset)
    this.currentWallet.assets.push(asset)

    // Create transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'mint',
      from: '0x0000000000000000000000000000000000000000',
      to: this.currentWallet.address,
      asset: asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: 'confirmed',
      timestamp: Date.now(),
      blockNumber: 12345678
    }

    this.transactions.set(transaction.id, transaction)

    console.log(`🎨 Minted new asset: ${asset.name}`)
    console.log(`🆔 Token ID: ${asset.tokenId}`)
    console.log(`💰 Value: ${asset.value} ${asset.currency}`)

    soundSystem.playInteractionSound('powerup')
  }

  // Transfer asset
  public transferAsset() {
    if (!this.currentWallet || !this.currentWallet.isConnected) {
      console.log('❌ Please connect wallet first')
      return
    }

    if (this.currentWallet.assets.length === 0) {
      console.log('❌ No assets to transfer')
      return
    }

    const asset = this.currentWallet.assets[0]
    const recipient = '0x1234567890123456789012345678901234567890'

    // Create transaction
    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer',
      from: this.currentWallet.address,
      to: recipient,
      asset: asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: 'pending',
      timestamp: Date.now()
    }

    this.transactions.set(transaction.id, transaction)

    // Update asset ownership
    asset.owner = recipient
    asset.lastTransferred = Date.now()

    // Remove from current wallet
    const index = this.currentWallet.assets.indexOf(asset)
    if (index > -1) {
      this.currentWallet.assets.splice(index, 1)
    }

    console.log(`💸 Transferred ${asset.name} to ${recipient}`)

    // Simulate transaction confirmation
    setTimeout(() => {
      transaction.status = 'confirmed'
      transaction.blockNumber = 12345679
      console.log(`✅ Transaction confirmed: ${transaction.id}`)
    }, 3000)

    soundSystem.playInteractionSound('click')
  }

  // Verify asset
  public verifyAsset() {
    if (this.assets.size === 0) {
      console.log('❌ No assets to verify')
      return
    }

    const asset = Array.from(this.assets.values())[0]

    console.log(`🔍 Verifying asset: ${asset.name}`)
    console.log(`🆔 Token ID: ${asset.tokenId}`)
    console.log(`⛓️ Blockchain: ${asset.blockchain}`)
    console.log(`✅ Verification: ${asset.isVerified ? 'VALID' : 'INVALID'}`)
    console.log(`👤 Owner: ${asset.owner}`)
    console.log(`📅 Created: ${new Date(asset.createdAt).toLocaleString()}`)

    soundSystem.playInteractionSound('powerup')
  }

  // Issue certificate
  public issueCertificate(recipient: string, metadata: string) {
    const certificate: DigitalAsset = {
      id: `cert_${Date.now()}`,
      name: `Certificate #${this.assets.size + 1}`,
      type: 'certificate',
      blockchain: this.currentWallet?.chain || 'ethereum',
      contractAddress: this.contracts.get('certificate')?.address || '',
      tokenId: (this.assets.size + 1).toString(),
      owner: recipient,
      metadata: {
        description: 'AIGestion Achievement Certificate',
        image: 'ipfs://QmCertHash...',
        attributes: new Map([
          ['type', 'achievement'],
          ['issuer', 'AIGestion'],
          ['metadata', metadata]
        ]),
        rarity: 'uncommon',
        category: 'certificate',
        creator: 'AIGestion',
        royalties: 0
      },
      value: 0,
      currency: 'ETH',
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    }

    this.assets.set(certificate.id, certificate)

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'mint',
      from: '0x0000000000000000000000000000000000000000',
      to: recipient,
      asset: certificate,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || 'ethereum') || 20,
      status: 'confirmed',
      timestamp: Date.now(),
      blockNumber: 12345680
    }

    this.transactions.set(transaction.id, transaction)

    console.log(`📜 Issued certificate to ${recipient}`)
    soundSystem.playInteractionSound('powerup')
  }

  // Award badge
  public awardBadge(user: string, badgeType: string) {
    const badge: DigitalAsset = {
      id: `badge_${Date.now()}`,
      name: `${badgeType} Badge`,
      type: 'badge',
      blockchain: this.currentWallet?.chain || 'ethereum',
      contractAddress: this.contracts.get('badge')?.address || '',
      tokenId: (this.assets.size + 1).toString(),
      owner: user,
      metadata: {
        description: `${badgeType} Achievement Badge`,
        image: 'ipfs://QmBadgeHash...',
        attributes: new Map([
          ['type', badgeType],
          ['issuer', 'AIGestion'],
          ['achievement_level', 'gold']
        ]),
        rarity: 'rare',
        category: 'badge',
        creator: 'AIGestion',
        royalties: 0
      },
      value: 0,
      currency: 'ETH',
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    }

    this.assets.set(badge.id, badge)

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'mint',
      from: '0x0000000000000000000000000000000000000000',
      to: user,
      asset: badge,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet?.chain || 'ethereum') || 20,
      status: 'confirmed',
      timestamp: Date.now(),
      blockNumber: 12345681
    }

    this.transactions.set(transaction.id, transaction)

    console.log(`🏆 Awarded ${badgeType} badge to ${user}`)
    soundSystem.playInteractionSound('powerup')
  }

  // Update blockchain UI
  private updateBlockchainUI() {
    // This would update the UI with current blockchain data
    // In real implementation, this would update text displays
  }

  // Simulate blockchain activity
  private simulateBlockchainActivity() {
    // Simulate random transactions
    if (Math.random() < 0.01) {
      this.simulateIncomingTransaction()
    }
  }

  // Simulate incoming transaction
  private simulateIncomingTransaction() {
    if (!this.currentWallet || !this.currentWallet.isConnected) return

    const assetTypes = ['nft', 'badge', 'certificate']
    const randomType = assetTypes[Math.floor(Math.random() * assetTypes.length)]

    const asset: DigitalAsset = {
      id: `asset_${Date.now()}`,
      name: `Received ${randomType}`,
      type: randomType as DigitalAsset['type'],
      blockchain: this.currentWallet.chain,
      contractAddress: this.contracts.get('asset_registry')?.address || '',
      tokenId: Math.floor(Math.random() * 10000).toString(),
      owner: this.currentWallet.address,
      metadata: {
        description: 'Received asset',
        image: 'ipfs://QmReceivedHash...',
        attributes: new Map([
          ['received', 'true'],
          ['sender', '0xSenderAddress']
        ]),
        rarity: 'common',
        category: randomType,
        creator: 'Unknown',
        royalties: 0
      },
      value: Math.random() * 0.5,
      currency: 'ETH',
      isVerified: true,
      createdAt: Date.now(),
      lastTransferred: Date.now()
    }

    this.assets.set(asset.id, asset)
    this.currentWallet.assets.push(asset)

    const transaction: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer',
      from: '0xSenderAddress',
      to: this.currentWallet.address,
      asset: asset,
      amount: 1,
      gasFee: this.gasPrices.get(this.currentWallet.chain) || 20,
      status: 'confirmed',
      timestamp: Date.now(),
      blockNumber: 12345682
    }

    this.transactions.set(transaction.id, transaction)

    console.log(`📥 Received new asset: ${asset.name}`)
  }

  // Update gas prices
  private updateGasPrices() {
    // Simulate gas price fluctuations
    this.gasPrices.forEach((price, chain) => {
      const fluctuation = (Math.random() - 0.5) * 0.1
      const newPrice = Math.max(0.01, price + fluctuation)
      this.gasPrices.set(chain, newPrice)
    })
  }

  // Get current wallet
  public getCurrentWallet(): Wallet | null {
    return this.currentWallet
  }

  // Get all assets
  public getAssets(): DigitalAsset[] {
    return Array.from(this.assets.values())
  }

  // Get transactions
  public getTransactions(): Transaction[] {
    return Array.from(this.transactions.values())
  }

  // Get gas price
  public getGasPrice(chain: string): number {
    return this.gasPrices.get(chain) || 20
  }

  // Get supported chains
  public getSupportedChains(): string[] {
    return [...this.supportedChains]
  }

  // Switch chain
  public switchChain(chain: string) {
    if (!this.supportedChains.includes(chain)) {
      console.log(`❌ Chain ${chain} not supported`)
      return
    }

    if (this.currentWallet) {
      this.currentWallet.chain = chain
      console.log(`⛓️ Switched to ${chain}`)
      soundSystem.playInteractionSound('click')
    }
  }

  // Get contract
  public getContract(contractId: string): SmartContract | undefined {
    return this.contracts.get(contractId)
  }

  // Call contract function
  public async callContract(contractId: string, functionName: string, parameters: any[]): Promise<any> {
    const contract = this.contracts.get(contractId)
    if (!contract) {
      throw new Error(`Contract ${contractId} not found`)
    }

    const func = contract.functions.get(functionName)
    if (!func) {
      throw new Error(`Function ${functionName} not found in contract ${contractId}`)
    }

    console.log(`📞 Calling ${contractId}.${functionName} with parameters:`, parameters)

    // Simulate contract call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`✅ Contract call completed`)
        resolve({ success: true, result: 'mock_result' })
      }, 1000)
    })
  }

  // Cleanup system
  public cleanup() {
    this.wallets.clear()
    this.assets.clear()
    this.transactions.clear()
    this.contracts.clear()

    if (this.blockchainUI) {
      engine.removeEntity(this.blockchainUI)
    }

    this.currentWallet = null
    this.isInitialized = false
  }
}

// Export singleton instance
export const blockchainSystem = new BlockchainIntegrationSystem()
