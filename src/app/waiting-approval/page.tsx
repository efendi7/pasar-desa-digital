'use client';

export default function WaitingApprovalPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">
        Menunggu Persetujuan Admin
      </h1>
      <p className="text-gray-600 max-w-md">
        Akun Anda telah terdaftar dan email sudah diverifikasi.
        <br />
        Silakan tunggu hingga admin menyetujui akun Anda.
      </p>
    </div>
  );
}
