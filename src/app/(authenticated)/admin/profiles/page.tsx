'use client';

import { useState, useMemo, memo } from 'react';
import { useProfilesApproval } from '@/hooks/useProfilesApproval';
import { Check, X, Loader2, User, Search, Home, Users } from 'lucide-react';
import { Breadcrumb } from '@/components/Breadcrumb';
import { PageHeader } from '@/components/PageHeader';
import { FormInput } from '@/components/FormInput';
import { FormSelect } from '@/components/FormSelect';
import { Pagination } from '@/components/Pagination';
import { EmptyState } from '@/components/EmptyState';
import { NoResults } from '@/components/NoResults';

// ============================================================================
// Helper Components
// ============================================================================

// Status Badge
const UserStatusBadge = memo(({ isActive, isRejected }: any) => {
  if (isActive)
    return (
      <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
        Disetujui
      </span>
    );

  if (isRejected)
    return (
      <span className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
        Ditolak
      </span>
    );

  return (
    <span className="inline-flex px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded-full font-medium">
      Menunggu
    </span>
  );
});
UserStatusBadge.displayName = 'UserStatusBadge';

// Action Buttons
const ApprovalActionButtons = memo(
  ({ profile, onApprove, onReject, processingId }: any) => {
    const isPending = !profile.is_active && !profile.is_rejected;
    const isProcessing = processingId === profile.id;

    if (isProcessing)
      return (
        <div className="flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      );

    if (isPending)
      return (
        <div className="flex justify-center gap-2">
          <button
            onClick={() => onApprove(profile.id)}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            title="Setujui"
          >
            <Check className="w-4 h-4" />
          </button>
          <button
            onClick={() => onReject(profile.id)}
            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            title="Tolak"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      );

    return <span className="text-gray-400 text-sm">-</span>;
  }
);
ApprovalActionButtons.displayName = 'ApprovalActionButtons';

// Table row
const UserRow = memo(({ profile, onApprove, onReject, processingId }: any) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 max-w-[250px]">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate">
            {profile.full_name || '-'}
          </div>
          <div className="text-sm text-gray-500 truncate mt-0.5">
            {profile.email || 'Email tidak terdaftar'}
          </div>
        </div>
      </div>
    </td>

    <td className="px-6 py-4 text-sm text-gray-600 truncate">
      {profile.store_name || '-'}
    </td>

    <td className="px-6 py-4 text-sm text-gray-600 truncate">
      {profile.whatsapp_number || '-'}
    </td>

    <td className="px-6 py-4 text-center">
      <UserStatusBadge isActive={profile.is_active} isRejected={profile.is_rejected} />
    </td>

    <td className="px-6 py-4 text-center">
      <ApprovalActionButtons
        profile={profile}
        onApprove={onApprove}
        onReject={onReject}
        processingId={processingId}
      />
    </td>
  </tr>
));
UserRow.displayName = 'UserRow';

// Mobile Card
const UserCard = memo(({ profile, onApprove, onReject, processingId }: any) => (
  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
    <div className="flex gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-6 h-6 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {profile.full_name || '-'}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-1">
          {profile.store_name || 'Nama Toko: -'}
        </p>
        <span className="text-sm text-gray-500">
          {profile.whatsapp_number || 'No WA: -'}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
      <div>
        <div className="text-xs text-gray-500 mb-1 font-medium">Status</div>
        <UserStatusBadge
          isActive={profile.is_active}
          isRejected={profile.is_rejected}
        />
      </div>
      <ApprovalActionButtons
        profile={profile}
        onApprove={onApprove}
        onReject={onReject}
        processingId={processingId}
      />
    </div>
  </div>
));
UserCard.displayName = 'UserCard';

// ============================================================================
// Main Page
// ============================================================================

export default function ProfilesApprovalPage() {
  const { profiles, loading, error, approveProfile, rejectProfile } =
    useProfilesApproval();

  const [processing, setProcessing] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handlers
  const handleApprove = async (id: string) => {
    setProcessing(id);
    await approveProfile(id);
    setProcessing(null);
  };

  const handleReject = async (id: string) => {
    setProcessing(id);
    await rejectProfile(id);
    setProcessing(null);
  };

  // Filtering
  const filteredUsers = useMemo(() => {
    return profiles
      .filter((p) => {
        const matchStatus =
          filterStatus === 'all' ||
          (filterStatus === 'pending' && !p.is_active && !p.is_rejected) ||
          (filterStatus === 'active' && p.is_active) ||
          (filterStatus === 'rejected' && p.is_rejected);

        const matchSearch =
          searchQuery === '' ||
          p.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.store_name?.toLowerCase().includes(searchQuery.toLowerCase());

        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        return (
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
        );
      });
  }, [profiles, filterStatus, searchQuery]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const statusOptions = [
    { label: 'Menunggu Persetujuan', value: 'pending' },
    { label: 'Disetujui', value: 'active' },
    { label: 'Ditolak', value: 'rejected' },
    { label: 'Semua Status', value: 'all' },
  ];

  // Loading
  if (loading)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl">
          Gagal memuat data: {error}
        </div>
      </div>
    );

  // Render
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { href: '/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4 mr-1" /> },
            { label: 'Persetujuan Pengguna' },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <PageHeader
          title="Persetujuan Akun"
          subtitle="Kelola dan setujui pendaftaran pengguna baru"
          count={profiles.length}
          icon={<Users className="w-6 h-6 text-gray-400" />}
        />

        {/* Filter */}
        <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Cari Pengguna"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nama pengguna atau toko..."
              icon={<Search className="w-5 h-5" />}
            />

            <FormSelect
              label="Status"
              value={filterStatus}
              onChange={(v) => setFilterStatus(v as string)}
              options={statusOptions}
              placeholder="Pilih status..."
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {profiles.length === 0 ? (
            <EmptyState />
          ) : filteredUsers.length === 0 ? (
            <NoResults
              onReset={() => {
                setSearchQuery('');
                setFilterStatus('pending');
              }}
            />
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[800px] border-collapse">
                  <thead className="bg-gray-50 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[30%]">
                        Pengguna
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[20%]">
                        Nama Toko
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        WhatsApp
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[20%]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((profile) => (
                      <UserRow
                        key={profile.id}
                        profile={profile}
                        onApprove={handleApprove}
                        onReject={handleReject}
                        processingId={processing}
                      />
                    ))}
                  </tbody>
                </table>

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredUsers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>

              {/* Mobile */}
              <div className="md:hidden space-y-4 mt-6">
                {paginatedUsers.map((profile) => (
                  <UserCard
                    key={profile.id}
                    profile={profile}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    processingId={processing}
                  />
                ))}

                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredUsers.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
