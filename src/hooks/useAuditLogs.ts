import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuditLog } from '@/types/channels';

export const useAuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          channel:channels(name)
        `)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      setLogs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar logs');
    } finally {
      setLoading(false);
    }
  };

  const addLog = async (action: string, details: string, channelId?: string) => {
    try {
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          action,
          details,
          channel_id: channelId || null,
        });
      
      if (error) throw error;
    } catch (err) {
      console.error('Error adding audit log:', err);
    }
  };

  useEffect(() => {
    fetchLogs();

    // Realtime subscription
    const channel = supabase
      .channel('audit-logs-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'audit_logs'
      }, () => {
        fetchLogs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { logs, loading, error, refetch: fetchLogs, addLog };
};