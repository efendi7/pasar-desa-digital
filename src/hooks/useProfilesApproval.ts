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
  is_rejected: boolean; // ✅ tambahkan properti ini
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
        .select('id, full_name, store_name, whatsapp_number, is_active, is_rejected, role') // ✅ ambil juga kolom is_rejected
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

  // 🔹 Update status approval / penolakan
  const updateProfileStatus = useCallback(
    async (id: string, isApproved: boolean) => {
      const updateData = isApproved
        ? { is_active: true, is_rejected: false }
        : { is_active: false, is_rejected: true };

      const actionText = isApproved ? 'menyetujui' : 'menolak';

      try {
        const { error } = await supabase
          .from('profiles')
          .update(updateData)
          .eq('id', id);

        if (error) throw error;

        toast.success(
          isApproved
            ? 'Profil berhasil disetujui ✅'
            : 'Profil berhasil ditolak ❌'
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

  // 🔹 Jalankan realtime listener Supabase
  useEffect(() => {
    fetchProfiles();

    const channel = supabase
      .channel('profiles-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          const { eventType, new: newRow, old } = payload;

          // Tampilkan toast sesuai event
          if (eventType === 'INSERT') {
            toast.info(`Pengguna baru terdaftar: ${newRow.full_name}`);
          } else if (eventType === 'UPDATE') {
            if (!old.is_active && newRow.is_active) {
              toast.success(`Profil ${newRow.full_name} telah disetujui ✅`);
            } else if (!old.is_rejected && newRow.is_rejected) {
              toast.warning(`Profil ${newRow.full_name} ditolak ❌`);
            }
          }

          // Segarkan data setelah perubahan
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
