'use client';

import { Suspense } from 'react';
import ResetPasswordContent from './reset-password-content';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
