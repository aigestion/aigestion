import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { Container } from 'inversify';
import { TYPES } from '../backend/src/types';
import { CoinGeckoService } from '../backend/src/services/coingecko.service';
import { WalletWatchtowerService } from '../backend/src/services/finance/wallet-watchtower.service';
import { logger } from '../backend/src/utils/logger';

// Load env
dotenv.config();

// Setup Container
const container = new Container();
container.bind<CoinGeckoService>(TYPES.CoinGeckoService).to(CoinGeckoService).inSingletonScope();
container
  .bind<WalletWatchtowerService>(TYPES.WalletWatchtowerService)
  .to(WalletWatchtowerService)
  .inSingletonScope();

async function runTest() {
  console.log('--- Wallet Watchtower Diagnostic ---');

  // Manually inject a known address if env is missing or invalid (contains spaces = mnemonic)
  if (!process.env.SAFEPAL_WALLET_ADDRESS || process.env.SAFEPAL_WALLET_ADDRESS.includes(' ')) {
    console.warn(
      '⚠️ Env var contains mnemonic or is missing. Using a public whale address for testing.'
    );
    process.env.SAFEPAL_WALLET_ADDRESS = '0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae'; // Ethereum Foundation (Valid ETH Address)
  }

  const watchtower = container.get<WalletWatchtowerService>(TYPES.WalletWatchtowerService);

  try {
    console.log(`\nScanning Address: ${process.env.SAFEPAL_WALLET_ADDRESS}`);
    const portfolio = await watchtower.getPortfolioParams();

    console.log('\n✅ Portfolio Scan Complete:');
    console.log(JSON.stringify(portfolio, null, 2));
  } catch (error) {
    console.error('❌ Test Failed:', error);
  }
}

runTest();
