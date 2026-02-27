'use client';

import { useSession } from 'next-auth/react';
import { checkUserPermissions } from '@/lib/permissions';

export function usePermissions() {
  const { data: session } = useSession();
  
  const userRoles = {
    admin_role: session?.user?.admin_role,
    SMM_role: session?.user?.SMM_role,
    designer_role: session?.user?.designer_role,
    photographer_role: session?.user?.photographer_role,
    coordinator_role: session?.user?.coordinator_role,
  };

  return checkUserPermissions(userRoles);
}

// Хук для проверки конкретного права
export function useCanCreatePost() {
  const permissions = usePermissions();
  return permissions.canCreatePost;
}

export function useCanEditPost() {
  const permissions = usePermissions();
  return permissions.canEditPost;
}

export function useCanDeletePost() {
  const permissions = usePermissions();
  return permissions.canDeletePost;
}
