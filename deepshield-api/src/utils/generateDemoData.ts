import { WalrusService } from '../walrus/walrus.service.js';
import { MoveService } from '../sui/move.service.js';
import { whaleEvents, intelligenceData, recentTrades, replayTrades } from './mockData.js';

export async function generateDemoData() {
  console.log('Starting Demo Data Generation for DeepShield AI...');
  
  // 1. Generate Intelligence Reports
  console.log('Generating AI Market Intelligence Reports...');
  for (const [token, data] of Object.entries(intelligenceData)) {
    const walrusResult = await WalrusService.uploadMarketAnalysis(data);
    await MoveService.saveMarketAnalysis(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      token,
      (data as any).sentiment || 'Neutral',
      data.confidence,
      walrusResult.blobId
    );
    console.log(`Generated Intelligence for ${token}`);
  }

  // 2. Generate Whale Radar Reports
  console.log('Generating Whale Radar Reports...');
  const whaleWalrus = await WalrusService.uploadWhaleReport({
    events: whaleEvents,
    timestamp: Date.now()
  });
  console.log(`Uploaded Whale Radar to Walrus: ${whaleWalrus.blobId}`);

  // 3. Generate Protection Proofs
  console.log('Generating Protection Proofs & Replays...');
  for (const trade of recentTrades) {
    const replayWalrus = await WalrusService.uploadProtectionReplay({
      request: { pair: trade.pair, amount: trade.value },
      execution: trade
    });

    await MoveService.createProtectionProof(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      trade.pair,
      trade.risk,
      trade.mode,
      trade.savings,
      replayWalrus.blobId
    );

    await MoveService.recordProtection(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
      trade.pair,
      trade.mode,
      trade.savings,
      trade.savings, // actual savings
      replayWalrus.blobId
    );
    console.log(`Generated Protection Proof for ${trade.id} (${trade.pair})`);
  }

  console.log('Demo Data Generation Complete! Environment is fully populated.');
}
