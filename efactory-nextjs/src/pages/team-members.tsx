import { useEffect, useState } from 'react';
import { fetchTeamMembers } from '@/services/api';
import type { TeamMemberDto } from '@/types/api/team';
import { Card, CardContent } from '@/components/ui/Card';
import { IconMail, IconPhone, IconUsersGroup } from '@tabler/icons-react';

export default function TeamMembersPage() {
  const [members, setMembers] = useState<TeamMemberDto[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchTeamMembers()
      .then((data) => {
        if (mounted) setMembers(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (mounted) setMembers([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-4">
        <IconUsersGroup className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold">Team Members</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-6">List of DCL team members assigned to your account.</p>

      <div className="hidden md:block mb-1">
        <div className="grid grid-cols-12 gap-2 items-center text-xs font-medium text-font-color-100 px-2">
          <div className="col-span-12 md:col-span-2 text-left">First Name</div>
          <div className="col-span-12 md:col-span-2 text-left">Last Name</div>
          <div className="col-span-12 md:col-span-4 text-left">Job Title</div>
          <div className="col-span-12 md:col-span-4 text-left">Contact</div>
        </div>
      </div>

      <div className="space-y-4">
        {members.map((m, idx) => (
          <Card key={`tm-${idx}`}>
            <CardContent className="py-4">
              <div className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-12 md:col-span-2">
                  <div className="text-primary font-medium">{m.first_name}</div>
                </div>
                <div className="col-span-12 md:col-span-2">
                  <div className="text-primary font-medium">{m.last_name}</div>
                </div>
                <div className="col-span-12 md:col-span-4">
                  <div className="text-foreground/90">{m.job_title || ''}</div>
                </div>
                <div className="col-span-12 md:col-span-4 space-y-1 md:whitespace-nowrap">
                  {m.phone ? (
                    <div className="flex items-center gap-2 text-foreground/90 text-sm"><IconPhone className="w-4 h-4 text-primary" />{m.phone}</div>
                  ) : null}
                  {m.email ? (
                    <div className="flex items-center gap-2 text-foreground/90 text-sm whitespace-nowrap"><IconMail className="w-4 h-4 text-primary" />{m.email}</div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
