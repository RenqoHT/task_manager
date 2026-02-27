// Константы прав доступа
export const ROLES = {
  ADMIN: 'admin_role',
  SMM: 'SMM_role',
  DESIGNER: 'designer_role',
  PHOTOGRAPHER: 'photographer_role',
  COORDINATOR: 'coordinator_role',
} as const;

// Типы действий
export const ACTIONS = {
  CREATE_POST: 'create_post',
  EDIT_POST: 'edit_post',
  DELETE_POST: 'delete_post',
  VIEW_POST: 'view_post',
} as const;

// Права доступа по ролям
export const ROLE_PERMISSIONS: Record<string, string[]> = {
  [ROLES.ADMIN]: [ACTIONS.CREATE_POST, ACTIONS.EDIT_POST, ACTIONS.DELETE_POST, ACTIONS.VIEW_POST],
  [ROLES.SMM]: [ACTIONS.CREATE_POST, ACTIONS.EDIT_POST, ACTIONS.DELETE_POST, ACTIONS.VIEW_POST],
  [ROLES.DESIGNER]: [ACTIONS.VIEW_POST],
  [ROLES.PHOTOGRAPHER]: [ACTIONS.VIEW_POST],
  [ROLES.COORDINATOR]: [ACTIONS.CREATE_POST, ACTIONS.EDIT_POST, ACTIONS.DELETE_POST, ACTIONS.VIEW_POST],
};

// Проверка права для роли
export function hasPermission(role: string | undefined, action: string): boolean {
  if (!role) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(action);
}

// Проверка любого из прав для пользователя с множеством ролей
export function userHasAnyPermission(
  userRoles: Record<string, boolean | null | undefined>,
  action: string
): boolean {
  return Object.entries(userRoles).some(([role, hasRole]) => {
    return hasRole === true && hasPermission(role, action);
  });
}

// Проверка всех ролей пользователя
export function checkUserPermissions(userRoles: {
  admin_role?: boolean | null;
  SMM_role?: boolean | null;
  designer_role?: boolean | null;
  photographer_role?: boolean | null;
  coordinator_role?: boolean | null;
}) {
  return {
    canCreatePost: userRoles.admin_role || userRoles.SMM_role || userRoles.coordinator_role,
    canEditPost: userRoles.admin_role || userRoles.SMM_role || userRoles.coordinator_role,
    canDeletePost: userRoles.admin_role || userRoles.SMM_role || userRoles.coordinator_role,
    canViewPost: true, // Все могут просматривать
  };
}
