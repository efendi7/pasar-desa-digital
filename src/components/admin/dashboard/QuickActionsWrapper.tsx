// components/admin/dashboard/QuickActionsWrapper.tsx
'use client';

import { useState } from 'react';
import QuickActions from '@/components/admin/dashboard/QuickActions'; // Langsung import (bukan dynamic)

export default function QuickActionsWrapper() {
  const [showQuickActions, setShowQuickActions] = useState(false);

  return (
    <QuickActions
      showQuickActions={showQuickActions}
      setShowQuickActions={setShowQuickActions}
    />
  );
}