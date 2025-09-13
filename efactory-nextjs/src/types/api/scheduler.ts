// Scheduler API types (modeled from legacy eFactory scheduler)

export type ScheduleFormat = 'excel' | 'csv' | 'zip';

export interface EmailDeliveryOptions {
  to?: string; // comma separated emails
  cc?: string;
  subject?: string;
  message?: string;
}

export interface FtpDeliveryOptions {
  host?: string;
  username?: string;
  password?: string;
  path?: string;
}

export interface DeliveryOptions {
  email?: EmailDeliveryOptions;
  ftp?: FtpDeliveryOptions;
}

export interface DailyFrequency {
  type: 'daily';
  days_interval?: number; // default 1
}

export interface WeeklyFrequency {
  type: 'weekly';
  weekdays?: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'>;
}

export interface MonthlyFrequency {
  type: 'monthly';
  day?: number; // 1..31
}

export type ScheduleFrequency = DailyFrequency | WeeklyFrequency | MonthlyFrequency;

// Full task payload the scheduler expects
export interface SchedulerTask {
  report_type_id: number; // 0 for generic grid exports
  view_type: string; // e.g., 'fulfillment-open'
  frequency: ScheduleFrequency; // normalized frequency
  start_time: string; // 'YYYY-MM-DD HH:mm:ss'
  expire_on?: string; // 'YYYY-MM-DD HH:mm:ss'
  format: ScheduleFormat;
  active: boolean;
  delivery_options: DeliveryOptions;

  // Grid-specific fields when scheduling from a grid
  filter?: { and: Array<{ field: string; oper: string; value: any }>; or?: any[] } | null;
  sort?: Array<Record<string, 'asc' | 'desc'>>;
}

export interface CreateScheduleRequest {
  action: 'create_task';
  task: SchedulerTask;
}

export interface UpdateScheduleRequest {
  action: 'update_task';
  id: number;
  task: SchedulerTask;
}

export interface DeleteScheduleRequest {
  action: 'delete_task';
  id: number;
}

export interface ReadSchedulesRequest {
  action: 'read_tasks';
}

export interface ScheduleDto extends SchedulerTask {
  id: number;
  created_at?: string;
  updated_at?: string;
}

export interface ReadSchedulesResponse {
  data: ScheduleDto[];
}


