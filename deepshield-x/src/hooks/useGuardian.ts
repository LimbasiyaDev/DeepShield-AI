import { useMutation } from '@tanstack/react-query';
import { guardianApi } from '../api/guardian.api';

export function useGuardian() {
  return useMutation({
    mutationFn: async (data: { question: string; context?: any }) => {
      return guardianApi.chat(data.question, data.context);
    }
  });
}
