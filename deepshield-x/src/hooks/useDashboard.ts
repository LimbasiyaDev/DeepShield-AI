import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '../api/analytics.api';
import { useStore } from '../store/useStore';

export function useDashboard() {
  const walletAddress = useStore((state) => state.walletAddress);

  return useQuery({
    queryKey: ['dashboard', walletAddress],
    queryFn: async () => {
      // The backend should return { balance, status, profile, analyticsData }
      const data = await analyticsApi.getDashboard();
      return data;
    },
    // removed enabled constraint so global dashboard data loads without wallet
  });
}
