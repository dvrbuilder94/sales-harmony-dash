import { useState, useEffect } from 'react';

export type UserViewRole = 'seller' | 'accountant' | 'admin';

export const useRoleSelector = () => {
  const [currentRole, setCurrentRole] = useState<UserViewRole>(() => {
    // Recover from localStorage or default to seller
    const saved = localStorage.getItem('salesharmony-view-role');
    return (saved as UserViewRole) || 'seller';
  });

  const switchRole = (newRole: UserViewRole) => {
    setCurrentRole(newRole);
    localStorage.setItem('salesharmony-view-role', newRole);
  };

  const getRoleConfig = (role: UserViewRole) => {
    const configs = {
      seller: {
        label: 'Vendedor',
        icon: '🛍️',
        description: 'Vista optimizada para sellers y gerentes comerciales',
        color: 'primary',
        metrics: ['ventas', 'comisiones', 'canales', 'performance']
      },
      accountant: {
        label: 'Contador',
        icon: '📊',
        description: 'Vista optimizada para contadores y compliance',
        color: 'success',
        metrics: ['sii', 'iva', 'reportes', 'auditoria']
      },
      admin: {
        label: 'Administrador',
        icon: '⚡',
        description: 'Vista completa con todas las funcionalidades',
        color: 'info',
        metrics: ['usuarios', 'integraciones', 'configuracion', 'analytics']
      }
    };
    return configs[role];
  };

  return {
    currentRole,
    switchRole,
    getRoleConfig,
    isSellerView: currentRole === 'seller',
    isAccountantView: currentRole === 'accountant',
    isAdminView: currentRole === 'admin',
  };
};