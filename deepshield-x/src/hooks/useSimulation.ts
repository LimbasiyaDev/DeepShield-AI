import { useMutation } from '@tanstack/react-query';
import { simulationApi } from '../api/simulation.api';

export function useSimulation() {
  return useMutation({
    mutationFn: async (simData: any) => {
      return simulationApi.run(simData);
    }
  });
}
