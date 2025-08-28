import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'admin' | 'moderator' | 'user' | null;

export const useUserRole = () => {
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchUserRole = async () => {
    if (!user) {
      setRole(null);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user role:', error);
        setRole('user'); // Default to user role on error
      } else {
        setRole(data?.role || 'user');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole('user'); // Default to user role on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isModerator = role === 'moderator';
  const hasRole = (requiredRole: UserRole) => role === requiredRole;

  return {
    role,
    loading,
    isAdmin,
    isModerator,
    hasRole,
    refetch: fetchUserRole
  };
};