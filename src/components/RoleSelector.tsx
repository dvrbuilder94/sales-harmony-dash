import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRoleSelector, UserViewRole } from '@/hooks/useRoleSelector';
import { ChevronDown, Users, Calculator, Settings } from 'lucide-react';

export function RoleSelector() {
  const { currentRole, switchRole, getRoleConfig } = useRoleSelector();
  const config = getRoleConfig(currentRole);

  const roleIcons = {
    seller: Users,
    accountant: Calculator,
    admin: Settings,
  };

  const roles: UserViewRole[] = ['seller', 'accountant', 'admin'];

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="secondary" 
        className={`px-3 py-1 text-xs font-medium bg-${config.color} text-${config.color}-foreground`}
      >
        {config.icon} {config.label}
      </Badge>
      
      <Select value={currentRole} onValueChange={(value: UserViewRole) => switchRole(value)}>
        <SelectTrigger className="w-[180px] h-8 text-xs">
          <SelectValue />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </SelectTrigger>
        <SelectContent>
          {roles.map((role) => {
            const roleConfig = getRoleConfig(role);
            const IconComponent = roleIcons[role];
            
            return (
              <SelectItem key={role} value={role} className="text-xs">
                <div className="flex items-center gap-2">
                  <IconComponent className="h-3 w-3" />
                  <span>{roleConfig.label}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {roleConfig.description}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}