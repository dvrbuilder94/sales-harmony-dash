import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';
import { Channel } from '@/types/channels';
import { useGlobalLoading } from '@/hooks/useGlobalLoading';
import { useEffect } from 'react';

export const useChannels = () => {
  const { setLoading, setLoadingMessage } = useGlobalLoading();
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['channels'],
    queryFn: () => apiClient.getChannels(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (isLoading) {
      setLoading(true);
      setLoadingMessage('Cargando canales...');
    } else {
      setLoading(false);
    }
  }, [isLoading, setLoading, setLoadingMessage]);

  return { 
    channels: data || [], 
    loading: isLoading, 
    error: error?.message || null, 
    refetch 
  };
};