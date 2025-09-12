// Team Members API types

export interface ListTeamMembersRequest {
  action: 'list';
}

export interface TeamMemberDto {
  pic_url?: string | null;
  first_name: string;
  last_name: string;
  job_title?: string | null;
  email?: string | null;
  phone?: string | null;
}

export type ListTeamMembersResponse = TeamMemberDto[];


