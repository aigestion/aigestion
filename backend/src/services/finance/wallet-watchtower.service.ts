import { injectable, inject } from 'inversify';
import axios from 'axios';
import { TYPES } from '../../types';
import { CoinGeckoService } from '../coingecko.service';
import { logger } from '../../utils/logger';

interface WalletBalance {
  asset: string;
  balance: number;
  valueUsd: number;
  price: number;
}

@injectable()
export class WalletWatchtowerService {
  private readonly WALLET_ADDRESS = process.env.SAFEPAL_WALLET_ADDRESS || '';

  // Public RPC Endpoints (No API Key Required)
  private readonly RPC = {
    ETH: ['https://rpc.ankr.com/eth', 'https://cloudflare-eth.com', 'https://eth.llamarpc.com'],
    BSC: ['https://bsc-dataseed.binance.org', 'https://bsc-dataseed1.defibit.io'],
    SOL: ['https://api.mainnet-beta.solana.com'],
  };

  constructor(@inject(TYPES.CoinGeckoService) private coingecko: CoinGeckoService) {}

  /**
   * Get total net worth and breakdown
   */
  public async getPortfolioParams() {
    if (!this.WALLET_ADDRESS) {
      logger.warn('[WalletWatchtower] No SAFEPAL_WALLET_ADDRESS configured.');
      return null;
    }

    logger.info(`[WalletWatchtower] Scanning vault: ${this.WALLET_ADDRESS.substring(0, 6)}...`);

    const prices = await this.coingecko.getPrices();
    const portfolio: WalletBalance[] = [];

    // 1. Ethereum Balance (Native ETH)
    // 1. Ethereum Balance (Native ETH)
    let ethSuccess = false;
    for (const rpc of this.RPC.ETH) {
      try {
        const ethBalance = await this.getEvmBalance(rpc, this.WALLET_ADDRESS);
        portfolio.push({
          asset: 'ETH',
          balance: ethBalance,
          valueUsd: ethBalance * (prices.ethereum?.usd || 0),
          price: prices.ethereum?.usd || 0,
        });
        ethSuccess = true;
        break; // Success
      } catch (e) {
        logger.warn(`[WalletWatchtower] ETH Scan Failed on ${rpc}`, e);
      }
    }
    if (!ethSuccess) logger.error('[WalletWatchtower] All ETH RPCs failed.');

    // 2. BSC Balance (Native BNB)
    // 2. BSC Balance (Native BNB)
    let bscSuccess = false;
    for (const rpc of this.RPC.BSC) {
      try {
        const bnbBalance = await this.getEvmBalance(rpc, this.WALLET_ADDRESS);
        portfolio.push({
          asset: 'BNB',
          balance: bnbBalance,
          valueUsd: bnbBalance * (prices.binancecoin?.usd || 0),
          price: prices.binancecoin?.usd || 0,
        });
        bscSuccess = true;
        break;
      } catch (e) {
        logger.warn(`[WalletWatchtower] BSC Scan Failed on ${rpc}`, e);
      }
    }
    if (!bscSuccess) logger.error('[WalletWatchtower] All BSC RPCs failed.');

    // 3. Solana Balance (Native SOL)
    // Note: EVM address usually doesn't match SOL address, using same env var for now unless specific SOL address provided
    // For this stage, we'll assume the user might have a separate variable or we skip if format is EVM-only.
    // Ideally, we'd check if the address is valid base58, but for now we'll try/catch.
    // 3. Solana Balance (Native SOL)
    try {
      if (this.isSolanaAddress(this.WALLET_ADDRESS)) {
        for (const rpc of this.RPC.SOL) {
          try {
            const solBalance = await this.getSolanaBalance(rpc, this.WALLET_ADDRESS);
            portfolio.push({
              asset: 'SOL',
              balance: solBalance,
              valueUsd: solBalance * (prices.solana?.usd || 0),
              price: prices.solana?.usd || 0,
            });
            break;
          } catch (e) {
            logger.warn(`[WalletWatchtower] SOL Scan Failed on ${rpc}`, e);
          }
        }
      }
    } catch (e) {
      logger.error('[WalletWatchtower] SOL Check Failed', e);
    }

    const totalNetWorth = portfolio.reduce((sum, item) => sum + item.valueUsd, 0);

    return {
      totalUsd: totalNetWorth,
      assets: portfolio,
      scannedAt: new Date(),
    };
  }

  /**
   * Fetch Native EVM Balance (JSON-RPC)
   */
  private async getEvmBalance(rpcUrl: string, address: string): Promise<number> {
    const response = await axios.post(
      rpcUrl,
      {
        jsonrpc: '2.0',
        method: 'eth_getBalance',
        params: [address, 'latest'],
        id: 1,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.error) throw new Error(response.data.error.message);

    // Convert Hex to Decimal and adjust for 18 decimals
    const hexBalance = response.data.result;
    return parseInt(hexBalance, 16) / 1e18;
  }

  /**
   * Fetch Native Solana Balance (JSON-RPC)
   */
  private async getSolanaBalance(rpcUrl: string, address: string): Promise<number> {
    const response = await axios.post(
      rpcUrl,
      {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    if (response.data.error) throw new Error(response.data.error.message);

    // SOL has 9 decimals (Lamports)
    return response.data.result.value / 1e9;
  }

  private isSolanaAddress(address: string): boolean {
    // Basic check: Solana addresses are Base58 and usually longer than ETH hex
    return !address.startsWith('0x') && address.length > 30;
  }
}
