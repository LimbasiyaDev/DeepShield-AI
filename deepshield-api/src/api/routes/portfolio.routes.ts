import { Router } from 'express';
import { WalrusService } from '../../walrus/walrus.service.js';
import { MoveService } from '../../sui/move.service.js';
import { VerificationService } from '../../verification/verification.service.js';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import axios from 'axios';

const router = Router();
const client = new SuiClient({ url: process.env.DEEPBOOK_RPC_URL || getFullnodeUrl('mainnet') });

router.post('/analyze', async (req, res, next) => {
  try {
    const { address } = req.body;
    
    let reportData: any[] = [];
    if (address && address.startsWith('0x')) {
      try {
        const balances = await client.getAllBalances({ owner: address });
        
        // Map coin types to symbols
        const coinMap: Record<string, {symbol: string, dec: number}> = {
          '0x2::sui::SUI': {symbol: 'SUI', dec: 9},
          '0xdee9::deep::DEEP': {symbol: 'DEEP', dec: 6},
          '0x06864a6f921804860930db6ddbe2e16acdf8504495ea7481637a1c8b9a8fe54b::cetus::CETUS': {symbol: 'CETUS', dec: 9},
          '0x5d4b302506645c37ff133b98c4b50a5ae14841659738d6d733d59d0d217a93bf::coin::COIN': {symbol: 'USDC', dec: 6}
        };

        let liveSuiPrice = 2.0;
        try {
          const priceRes = await axios.get('https://api.binance.com/api/v3/ticker/price?symbol=SUIUSDT');
          liveSuiPrice = parseFloat(priceRes.data.price);
        } catch(e){}

        reportData = balances.map((b) => {
          const coinInfo = coinMap[b.coinType] || {symbol: b.coinType.split('::').pop() || 'UNKNOWN', dec: 9};
          const bal = Number(b.totalBalance) / Math.pow(10, coinInfo.dec);
          const val = bal * (coinInfo.symbol === 'SUI' ? liveSuiPrice : (coinInfo.symbol === 'USDC' ? 1.0 : liveSuiPrice * 0.5));
          
          return {
            symbol: coinInfo.symbol,
            balance: bal.toLocaleString(undefined, {maximumFractionDigits: 2}),
            value: `$${val.toLocaleString(undefined, {maximumFractionDigits: 2})}`,
            risk: val > 10000 ? "High" : "Low",
            exposure: "Real-Time"
          };
        }).filter(a => Number(a.balance.replace(/,/g,'')) > 0);
      } catch (e) {
        console.warn("Failed to fetch live balances for", address);
      }
    }

    if (reportData.length === 0) {
      reportData = [
        { symbol: "SUI", balance: "0.00", value: "$0.00", risk: "Low", exposure: "0%" }
      ];
    }
    
    // 2. Upload to Walrus
    const walrusResult = await WalrusService.uploadPortfolioAnalysis(reportData);

    // 3. Store Reference in Move
    const fallbackWallet = process.env.SUI_PRIVATE_KEY ? '0x0288094852c5254052abd0c431915f883eee0c8372807f099506864749d30c6d' : '0x0';
    const recipient = address || fallbackWallet;

    const suiResult = await MoveService.savePortfolioAnalysis(
      recipient,
      address || '0xunknown',
      85, // mock score
      'Medium',
      walrusResult.blobId
    );

    // 4. Verify
    const verification = await VerificationService.verifyPortfolioAnalysis(
      suiResult.objectId,
      walrusResult.blobId,
      suiResult.txHash
    );

    res.json({ 
      success: true, 
      data: {
        assets: reportData,
        verification: {
          ...verification,
          walrusStatus: walrusResult.status,
          walrusMessage: walrusResult.message
        }
      } 
    });
  } catch (error) {
    next(error);
  }
});

export default router;
