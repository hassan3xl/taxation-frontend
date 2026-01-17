export interface UserInfoType {
  id: string;
  email: string;
  is_active: boolean;
  role: string;
}

export interface AgentType {
  id: string;
  active_status: "active" | "inactive" | string;
  full_name: string;
  phone: string; // Note: Your backend sample shows a date string here
  station_location: string;
  user: UserInfoType;
}

export interface AuthUserType {
  id: string;
  email: string;
  role: string;
}
