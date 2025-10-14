'use client';
import { useProfilesApproval } from '@/hooks/useProfilesApproval';
import { Check, X, Loader2, User } from 'lucide-react';
import { useState } from 'react';

export default function ProfilesApprovalPage() {
  const { profiles, loading, error, approveProfile, rejectProfile } = useProfilesApproval();
  const [processing, setProcessing] = useState<string | null>(null);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Memuat daftar pengguna...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center mt-10">
        Gagal memuat data: {error}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Persetujuan Akun Pengguna
      </h1>

      {profiles.length === 0 ? (
        <p className="text-gray-500 text-center py-12">
          Tidak ada pengguna terdaftar.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-2xl border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-green-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Pengguna
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Nama Toko
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  WhatsApp
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {profiles.map((p) => (
                <tr key={p.id}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500" />
                    {p.full_name || '-'}
                  </td>
                  <td className="px-6 py-4">{p.store_name || '-'}</td>
                  <td className="px-6 py-4">{p.whatsapp_number || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    {p.is_active ? (
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                        Aktif
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
                        Belum Disetujui
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {processing === p.id ? (
                      <Loader2 className="w-5 h-5 animate-spin inline-block text-gray-400" />
                    ) : (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={async () => {
                            setProcessing(p.id);
                            await approveProfile(p.id);
                            setProcessing(null);
                          }}
                          disabled={p.is_active}
                          className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-40"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            setProcessing(p.id);
                            await rejectProfile(p.id);
                            setProcessing(null);
                          }}
                          disabled={!p.is_active}
                          className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-40"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
