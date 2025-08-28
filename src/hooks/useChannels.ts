import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Channel } from '@/types/channels';

export const useChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setChannels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar canales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannels();

    // Realtime subscription
    const channel = supabase
      .channel('channels-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'channels'
      }, () => {
        fetchChannels();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { channels, loading, error, refetch: fetchChannels };
};