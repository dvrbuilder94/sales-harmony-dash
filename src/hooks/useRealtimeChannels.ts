import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Channel {
  id: string;
  name: string;
  channel_type?: string;
  status?: string;
  is_active?: boolean;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  realtime?: boolean;
  config?: any;
}

export const useRealtimeChannels = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchChannels();
    
    // Set up realtime subscription
    const channel = supabase
      .channel('channels_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'channels'
        },
        (payload) => {
          console.log('Channel realtime update:', payload);
          handleRealtimeUpdate(payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('channels')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setChannels(data || []);
    } catch (err) {
      console.error('Error fetching channels:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleRealtimeUpdate = (payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload;

    setChannels(prevChannels => {
      switch (eventType) {
        case 'INSERT':
          return [newRecord, ...prevChannels];
          
        case 'UPDATE':
          return prevChannels.map(channel => 
            channel.id === newRecord.id ? newRecord : channel
          );
          
        case 'DELETE':
          return prevChannels.filter(channel => channel.id !== oldRecord.id);
          
        default:
          return prevChannels;
      }
    });
  };

  const refetch = () => {
    fetchChannels();
  };

  return {
    channels,
    loading,
    error,
    refetch
  };
};