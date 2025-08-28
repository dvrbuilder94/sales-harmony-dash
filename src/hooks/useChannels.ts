import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Channel } from '@/types/channels';

export const useChannels = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['channels'],
    queryFn: () => apiClient.getChannels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return { 
    channels: data || [], 
    loading: isLoading, 
    error: error?.message || null, 
    refetch 
  };
};