import React, { useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui';
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
import type { SchedulerTask, ScheduleFrequency, ScheduleFormat } from '@/types/api/scheduler';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTask: SchedulerTask;
  onSubmit: (task: SchedulerTask) => Promise<void>;
}

export default function ScheduleReportModal({ open, onOpenChange, defaultTask, onSubmit }: Props) {
  const [task, setTask] = useState<SchedulerTask>(defaultTask);
  const [submitting, setSubmitting] = useState(false);

  const freqType = (task.frequency?.type || 'daily') as ScheduleFrequency['type'];

  function update<K extends keyof SchedulerTask>(key: K, value: SchedulerTask[K]) {
    setTask((t) => ({ ...t, [key]: value }));
  }

  function updateFrequency(nextType: ScheduleFrequency['type']) {
    let next: ScheduleFrequency;
    if (nextType === 'weekly') next = { type: 'weekly', weekdays: ['Mon'] };
    else if (nextType === 'monthly') next = { type: 'monthly', day: 1 };
    else next = { type: 'daily', days_interval: 1 };
    update('frequency', next);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      await onSubmit(task);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Schedule report</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">Format</label>
              <Select value={task.format} onValueChange={(v) => update('format', v as ScheduleFormat)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Format" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="zip">Zip</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted">Start time (YYYY-MM-DD HH:mm:ss)</label>
              <Input value={task.start_time} onChange={(e) => update('start_time', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted">Frequency</label>
              <Select value={freqType} onValueChange={(v) => updateFrequency(v as any)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Frequency" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {freqType === 'daily' && (
              <div>
                <label className="text-xs text-muted">Every N days</label>
                <Input value={(task.frequency as any)?.days_interval ?? 1} onChange={(e) => update('frequency', { type: 'daily', days_interval: Number(e.target.value) }) as any} />
              </div>
            )}
            {freqType === 'weekly' && (
              <div className="col-span-2">
                <label className="text-xs text-muted">Weekdays (comma-separated)</label>
                <Input
                  value={(task.frequency as any)?.weekdays?.join(',') || ''}
                  onChange={(e) => update('frequency', { type: 'weekly', weekdays: e.target.value.split(',').map(s => s.trim()).filter(Boolean) as any }) as any}
                />
              </div>
            )}
            {freqType === 'monthly' && (
              <div>
                <label className="text-xs text-muted">Day of month</label>
                <Input value={(task.frequency as any)?.day ?? 1} onChange={(e) => update('frequency', { type: 'monthly', day: Number(e.target.value) }) as any} />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted">Email To</label>
              <Input value={task.delivery_options?.email?.to || ''} onChange={(e) => update('delivery_options', { ...task.delivery_options, email: { ...(task.delivery_options?.email || {}), to: e.target.value } })} />
            </div>
            <div>
              <label className="text-xs text-muted">Subject</label>
              <Input value={task.delivery_options?.email?.subject || ''} onChange={(e) => update('delivery_options', { ...task.delivery_options, email: { ...(task.delivery_options?.email || {}), subject: e.target.value } })} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted">Message</label>
            <Input value={task.delivery_options?.email?.message || ''} onChange={(e) => update('delivery_options', { ...task.delivery_options, email: { ...(task.delivery_options?.email || {}), message: e.target.value } })} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={submitting}>{submitting ? 'Saving…' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


