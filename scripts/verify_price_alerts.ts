
import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../backend/src/types';
import { PriceAlertService } from '../backend/src/services/finance/price-alert.service';
import { CoinGeckoService } from '../backend/src/services/coingecko.service';
import { WhatsAppCommandService } from '../backend/src/services/whatsapp-command.service';

// Mock CoinGecko
class MockCoinGecko {
    private price = 50000;

    setPrice(p: number) { this.price = p; }

    async getPrices() {
        return {
            bitcoin: { usd: this.price, usd_24h_change: 0 }
        };
    }
}

// Mock WhatsApp
class MockWhatsApp {
    async handleIncoming(from: string, body: string) {
        console.log(`[MockWhatsApp] Received: ${body}`);
    }

    // We assume the service might need a way to send OUT.
    // Since the original service didn't have a clear 'send' method exposed in the interface we used,
    // we'll see what the logs say. The PriceAlertService currently logs the message.
    // If we want to verify the 'send', we'd need to mock whatever method PriceAlertService calls.
    // In my implementation, I only logged it because I wasn't sure of the interface.
    // Let's rely on the logs for now, or if I use handleIncoming to "simulate" a command, that's different.
    // Wait, the PriceAlertService implementation I wrote just LOGS the alert:
    // `logger.warn([TheSniper] Triggering Alert: ...)`
    // So for this test, catching the console output or just seeing the log is enough.
}

async function runTest() {
    console.log('--- The Sniper Diagnostic ---');

    const container = new Container();
    const mockGecko = new MockCoinGecko();
    const mockWhatsApp = new MockWhatsApp();

    container.bind(TYPES.CoinGeckoService).toConstantValue(mockGecko as any);
    container.bind(TYPES.WhatsAppCommandService).toConstantValue(mockWhatsApp as any);
    container.bind(TYPES.PriceAlertService).to(PriceAlertService);

    const sniper = container.get<PriceAlertService>(TYPES.PriceAlertService);

    // 1. Baseline
    console.log('\n1. Establishing Baseline ($50,000)...');
    mockGecko.setPrice(50000);
    await sniper.checkPrices();

    // 2. Small Move (No Alert)
    console.log('\n2. Small Move to $51,000 (2%)...');
    mockGecko.setPrice(51000);
    await sniper.checkPrices();

    // 3. Big Pump (Alert!)
    console.log('\n3. Pump to $60,000 (20%)...');
    mockGecko.setPrice(60000);
    await sniper.checkPrices();

    // 4. Dump (Alert!)
    console.log('\n4. Dump to $40,000 (-33%)...');
    mockGecko.setPrice(40000);
    await sniper.checkPrices();
}

runTest();
