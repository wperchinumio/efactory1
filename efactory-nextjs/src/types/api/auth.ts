// Authentication API response types
export interface AuthResponse {
  data: {
    api_token: string;
    admin_roles: string[];
    available_accounts: AvailableAccount[];
    user_data: UserData;
    account: string | null;
    apps: number[];
  };
  error_message: string;
  error_dialog: boolean;
}

export interface AvailableAccount {
  username: string;
  company: string;
  location: string;
  policy: string;
}

export interface UserData {
  user_id: number;
  local: boolean;
  roles: string[];
  name: string | null;
  is_master: boolean;
  account: string | null;
  region: string | null;
}

// Menu configuration types
export interface MenuItem {
  keyword: string;
  iconClassName?: string; // For CSS class icons (legacy support)
  iconComponent?: React.ComponentType<any>; // For Tabler Icon components
  title: string;
  route?: string;
  sectionTitleBefore?: string;
  isDropdownOpenDefault?: boolean;
  dropdownMenus?: DropdownMenuItem[];
  badge?: string;
  badgeClassName?: string;
  appIds?: number[];
}

export interface DropdownMenuItem {
  keyword: string;
  route: string;
  title: string;
  badge?: string;
  badgeClassName?: string;
  appId?: number;
}

export interface TopMenuConfig {
  keyword: string;
  title: string;
  iconClassName?: string; // For CSS class icons (legacy support)
  iconComponent?: React.ComponentType<any>; // For Tabler Icon components
  appIds: number[];
  sidebarConfig: string; // Reference to sidebar config key
}

export interface SidebarConfig {
  searchBox?: string;
  menus: MenuItem[];
}

export interface NavigationContextType {
  userApps: number[];
  activeTopMenu: string | null;
  setActiveTopMenu: (menu: string | null) => void;
}
