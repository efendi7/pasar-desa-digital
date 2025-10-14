'use client';
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Profile {
  id: string;
  full_name: string;
  store_name: string | null;
  whatsapp_number: string | null;
  is_active: boolean;
  role: string | null;
}

export function useProfilesApproval() {
  const supabase = createClient();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, store_name, whatsapp_number, is_active, role')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProfiles(data || []);
    } catch (err: any) {
      console.error('Error fetching profiles:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const approveProfile = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: true })
      .eq('id', id);
    if (error) throw error;
    await fetchProfiles();
  };

  const rejectProfile = async (id: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
    await fetchProfiles();
  };

  return {
    profiles,
    loading,
    error,
    approveProfile,
    rejectProfile,
    refresh: fetchProfiles,
  };
}
