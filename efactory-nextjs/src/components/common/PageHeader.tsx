import React from 'react';

interface PageHeaderProps {
  iconClassName?: string;
  title: string;
  subtitle?: string;
}

export default function PageHeader({ iconClassName, title, subtitle }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {iconClassName ? <i className={`${iconClassName} text-xl`} /> : null}
      <div>
        <div className="text-xl font-semibold">{title}</div>
        {subtitle ? <div className="text-xs text-muted">{subtitle}</div> : null}
      </div>
    </div>
  );
}


