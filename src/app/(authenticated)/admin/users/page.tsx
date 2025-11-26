'use client';

import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useAdmin } from '@/hooks/useAdmin';
import { User, Search, Home, Users, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  store_name: string;
  whatsapp_number: string | null;
  is_active: boolean;
  role: string;
  created_at: string;
}

// ============================================================================
// Helper Components
// ============================================================================

// Breadcrumb Component
const Breadcrumb = memo(({ items }: any) => (
  <nav className="flex items-center space-x-2 text-sm mb-6">
    {items.map((item: any, idx: number) => (
      <div key={idx} className="flex items-center">
        {idx > 0 && <span className="mx-2 text-gray-400">/</span>}
        {item.href ? (
          <a
            href={item.href}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            {item.icon}
            {item.label}
          </a>
        ) : (
          <span className="text-gray-900 font-medium">{item.label}</span>
        )}
      </div>
    ))}
  </nav>
));
Breadcrumb.displayName = 'Breadcrumb';

// Page Header
const PageHeader = memo(({ title, subtitle, count }: any) => (
  <div className="p-6 sm:p-8 border-b border-gray-100">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-6 h-6 text-gray-400" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{title}</h1>
        </div>
        <p className="text-gray-600 text-sm sm:text-base">{subtitle}</p>
      </div>
      <div className="ml-4 flex-shrink-0">
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl font-semibold text-sm">
          {count} Pengguna
        </div>
      </div>
    </div>
  </div>
));
PageHeader.displayName = 'PageHeader';

// Form Input
const FormInput = memo(({ label, value, onChange, icon }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <div className="relative">
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </div>
      )}
      <input
        type="text"
        value={value}
        onChange={onChange}
        className={`w-full ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900`}
      />
    </div>
  </div>
));
FormInput.displayName = 'FormInput';

// Form Select
const FormSelect = memo(({ label, value, onChange, options }: any) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
    >
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
));
FormSelect.displayName = 'FormSelect';

// Status Badge
const UserStatusBadge = memo(({ isActive }: any) => {
  if (isActive)
    return (
      <span className="inline-flex px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
        Aktif
      </span>
    );

  return (
    <span className="inline-flex px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full font-medium">
      Nonaktif
    </span>
  );
});
UserStatusBadge.displayName = 'UserStatusBadge';

// Role Badge
const RoleBadge = memo(({ role }: any) => {
  if (role === 'admin')
    return (
      <span className="inline-flex px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
        Admin
      </span>
    );

  return (
    <span className="inline-flex px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full font-medium">
      User
    </span>
  );
});
RoleBadge.displayName = 'RoleBadge';

// Action Buttons
const UserActionButtons = memo(({ user, onToggleStatus, onToggleRole, processingId }: any) => {
  const isProcessing = processingId === user.id;

  if (isProcessing)
    return (
      <div className="flex justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
      </div>
    );

  return (
    <div className="flex justify-center gap-2">
      <button
        onClick={() => onToggleStatus(user.id, user.is_active)}
        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
          user.is_active
            ? 'bg-red-100 text-red-700 hover:bg-red-200'
            : 'bg-green-100 text-green-700 hover:bg-green-200'
        }`}
        title={user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
      >
        {user.is_active ? 'Nonaktifkan' : 'Aktifkan'}
      </button>
      <button
        onClick={() => onToggleRole(user.id, user.role || 'user')}
        className="px-3 py-1.5 text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg transition-colors"
        title={user.role === 'admin' ? 'Hapus Admin' : 'Jadikan Admin'}
      >
        {user.role === 'admin' ? 'Hapus Admin' : 'Jadikan Admin'}
      </button>
    </div>
  );
});
UserActionButtons.displayName = 'UserActionButtons';

// Table Row
const UserRow = memo(({ user, onToggleStatus, onToggleRole, processingId }: any) => (
  <tr className="hover:bg-gray-50 transition-colors">
    <td className="px-6 py-4 max-w-[250px]">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-5 h-5 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-gray-900 truncate">
            {user.full_name || '-'}
          </div>
          <div className="text-sm text-gray-500 truncate mt-0.5">
            {new Date(user.created_at).toLocaleDateString('id-ID')}
          </div>
        </div>
      </div>
    </td>

    <td className="px-6 py-4 text-sm text-gray-600 truncate">
      {user.store_name || '-'}
    </td>

    <td className="px-6 py-4 text-sm text-gray-600 truncate">
      {user.whatsapp_number || '-'}
    </td>

    <td className="px-6 py-4 text-center">
      <RoleBadge role={user.role || 'user'} />
    </td>

    <td className="px-6 py-4 text-center">
      <UserStatusBadge isActive={user.is_active} />
    </td>

    <td className="px-6 py-4">
      <UserActionButtons
        user={user}
        onToggleStatus={onToggleStatus}
        onToggleRole={onToggleRole}
        processingId={processingId}
      />
    </td>
  </tr>
));
UserRow.displayName = 'UserRow';

// Mobile Card
const UserCard = memo(({ user, onToggleStatus, onToggleRole, processingId }: any) => (
  <div className="bg-gray-50 rounded-2xl border border-gray-200 p-4">
    <div className="flex gap-4 mb-4">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <User className="w-6 h-6 text-gray-500" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1 truncate">
          {user.full_name || '-'}
        </h3>
        <p className="text-sm text-gray-500 line-clamp-1 mb-1">
          {user.store_name || 'Nama Toko: -'}
        </p>
        <span className="text-sm text-gray-500">
          {user.whatsapp_number || 'No WA: -'}
        </span>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-200">
      <div>
        <div className="text-xs text-gray-500 mb-1 font-medium">Role</div>
        <RoleBadge role={user.role || 'user'} />
      </div>
      <div>
        <div className="text-xs text-gray-500 mb-1 font-medium">Status</div>
        <UserStatusBadge isActive={user.is_active} />
      </div>
    </div>

    <UserActionButtons
      user={user}
      onToggleStatus={onToggleStatus}
      onToggleRole={onToggleRole}
      processingId={processingId}
    />
  </div>
));
UserCard.displayName = 'UserCard';

// Pagination
const Pagination = memo(({ currentPage, totalItems, itemsPerPage, onPageChange }: any) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
      <div className="text-sm text-gray-600">
        Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} dari {totalItems}
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sebelumnya
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1.5 text-sm font-medium bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Selanjutnya
        </button>
      </div>
    </div>
  );
});
Pagination.displayName = 'Pagination';

// Empty State
const EmptyState = () => (
  <div className="text-center py-16">
    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada pengguna</h3>
    <p className="text-gray-500">Belum ada pengguna terdaftar dalam sistem.</p>
  </div>
);

// No Results
const NoResults = ({ onReset }: any) => (
  <div className="text-center py-16">
    <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada hasil</h3>
    <p className="text-gray-500 mb-4">Tidak ditemukan pengguna yang sesuai dengan filter.</p>
    <button
      onClick={onReset}
      className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
    >
      Reset Filter
    </button>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function AdminUsers() {
  const router = useRouter();
  const { isAdmin, loading } = useAdmin();
  const supabase = createClient();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    setProcessing(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Gagal memperbarui status pengguna');
    } finally {
      setProcessing(null);
    }
  };

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    if (!confirm(`Apakah Anda yakin ingin ${newRole === 'admin' ? 'memberikan' : 'mencabut'} akses admin?`)) {
      return;
    }

    setProcessing(userId);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Gagal memperbarui role pengguna');
    } finally {
      setProcessing(null);
    }
  };

  // Filtering
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchStatus =
        filterStatus === 'all' ||
        (filterStatus === 'active' && user.is_active) ||
        (filterStatus === 'inactive' && !user.is_active);

      const matchRole =
        filterRole === 'all' ||
        (filterRole === 'admin' && user.role === 'admin') ||
        (filterRole === 'user' && (!user.role || user.role === 'user'));

      const matchSearch =
        searchTerm === '' ||
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.store_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.whatsapp_number?.includes(searchTerm);

      return matchStatus && matchRole && matchSearch;
    });
  }, [users, filterStatus, filterRole, searchTerm]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const handleReset = useCallback(() => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterRole('all');
    setCurrentPage(1);
  }, []);

  const statusOptions = [
    { label: 'Semua Status', value: 'all' },
    { label: 'Aktif', value: 'active' },
    { label: 'Nonaktif', value: 'inactive' },
  ];

  const roleOptions = [
    { label: 'Semua Role', value: 'all' },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  // Loading
  if (loading || loadingUsers) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-xl w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded-lg w-1/4"></div>
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 space-y-4">
            <div className="h-12 bg-gray-200 rounded-xl"></div>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
      <div className="mb-6">
        <Breadcrumb
          items={[
            { href: '/admin/dashboard', label: 'Dashboard', icon: <Home className="w-4 h-4 mr-1" /> },
            { label: 'Kelola Pengguna' },
          ]}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <PageHeader
          title="Kelola Pengguna"
          subtitle="Daftar seluruh pengguna dalam sistem"
          count={users.length}
        />

        {/* Filters - Hanya muncul jika ada pengguna */}
        {users.length > 0 && (
          <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormInput
                label="Cari Pengguna"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />

              <FormSelect
                label="Status"
                value={filterStatus}
                onChange={(v: string) => setFilterStatus(v)}
                options={statusOptions}
              />

              <FormSelect
                label="Role"
                value={filterRole}
                onChange={(v: string) => setFilterRole(v)}
                options={roleOptions}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8">
          {users.length === 0 ? (
            <EmptyState />
          ) : filteredUsers.length === 0 ? (
            <NoResults onReset={handleReset} />
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse">
                  <thead className="bg-gray-50 rounded-t-xl">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tl-xl w-[25%]">
                        Pengguna
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[20%]">
                        Nama Toko
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-[15%]">
                        WhatsApp
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10%]">
                        Role
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider w-[10%]">
                        Status
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider rounded-tr-xl w-[20%]">
                        Aksi
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {paginatedUsers.map((user) => (
                      <UserRow
                        key={user.id}
                        user={user}
                        onToggleStatus={toggleUserStatus}
                        onToggleRole={toggleAdminRole}
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

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {paginatedUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onToggleStatus={toggleUserStatus}
                    onToggleRole={toggleAdminRole}
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