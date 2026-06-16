import { useMutation } from '@tanstack/react-query';
import { portfolioApi } from '../api/portfolio.api';

export function usePortfolio() {
  return useMutation({
    mutationFn: async (portfolioData?: any) => {
      return portfolioApi.analyze(portfolioData);
    }
  });
}
