'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';

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

  // 🔹 Ambil semua profil
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

  // 🔹 Update status (dengan toast feedback)
  const updateProfileStatus = useCallback(
    async (id: string, status: boolean) => {
      const actionText = status ? 'menyetujui' : 'menolak';
      try {
        const { error } = await supabase
          .from('profiles')
          .update({ is_active: status })
          .eq('id', id);

        if (error) throw error;

        toast.success(
          status ? 'Profil berhasil disetujui ✅' : 'Profil berhasil ditolak ❌'
        );
      } catch (err: any) {
        console.error(`Gagal ${actionText} profil:`, err);
        toast.error(`Gagal ${actionText} profil`);
        setError(err.message);
      }
    },
    [supabase]
  );

  const approveProfile = (id: string) => updateProfileStatus(id, true);
  const rejectProfile = (id: string) => updateProfileStatus(id, false);

  // 🔹 Jalankan realtime listener
  useEffect(() => {
    fetchProfiles();

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime update:', payload);
          const { eventType, new: newRow, old } = payload;

          // Tampilkan toast sesuai jenis event
          if (eventType === 'INSERT') {
            toast.info(`Pengguna baru terdaftar: ${newRow.full_name}`);
          } else if (eventType === 'UPDATE') {
            if (!old.is_active && newRow.is_active) {
              toast.success(`Profil ${newRow.full_name} telah disetujui`);
            } else if (old.is_active && !newRow.is_active) {
              toast.warning(`Profil ${newRow.full_name} dinonaktifkan`);
            }
          }

          // Segarkan data
          fetchProfiles();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchProfiles]);

  return {
    profiles,
    loading,
    error,
    approveProfile,
    rejectProfile,
    refresh: fetchProfiles,
  };
}
