import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useLivePrice(symbol: string = 'SUIUSDT') {
  return useQuery({
    queryKey: ['livePrice', symbol],
    queryFn: async () => {
      if (symbol !== 'SUIUSDT') {
        return null;
      }

      try {
        const res = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
        return `$${parseFloat(res.data.price).toFixed(3)}`;
      } catch (error) {
        return null;
      }
    },
    refetchInterval: 10000, // Fetch every 10 seconds
    staleTime: 5000,
  });
}
