export interface Channel {
  id: string;
  name: string;
  realtime: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  details: string | null;
  user_id: string | null;
  channel_id: string | null;
  created_at: string;
  channel?: {
    name: string;
  } | null;
}