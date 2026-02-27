'use client';

import { usePermissions } from '@/hooks/usePermissions';
import React from 'react';

interface PermissionGateProps {
  children: React.ReactNode;
  permission: 'create' | 'edit' | 'delete' | 'view';
  fallback?: React.ReactNode;
}

export const PermissionGate: React.FC<PermissionGateProps> = ({ 
  children, 
  permission,
  fallback = null 
}) => {
  const permissions = usePermissions();

  const hasPermission = {
    create: permissions.canCreatePost,
    edit: permissions.canEditPost,
    delete: permissions.canDeletePost,
    view: permissions.canViewPost,
  }[permission];

  if (!hasPermission) {
    return fallback;
  }

  return <>{children}</>;
};

// Компоненты для конкретных прав
export const CanCreatePost: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate permission="create" fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanEditPost: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate permission="edit" fallback={fallback}>
    {children}
  </PermissionGate>
);

export const CanDeletePost: React.FC<{ children: React.ReactNode; fallback?: React.ReactNode }> = ({ 
  children, 
  fallback 
}) => (
  <PermissionGate permission="delete" fallback={fallback}>
    {children}
  </PermissionGate>
);
