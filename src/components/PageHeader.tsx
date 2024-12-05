import { ReactNode } from 'react';
import Breadcrumbs from './Breadcrumbs';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, breadcrumbs, actions }: Props) {
  return (
    <div className="mb-8">
      <div className="border-b border-gray-200 pb-4">
        {breadcrumbs && (
          <div className="mb-4">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-semibold text-gray-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex space-x-3">{actions}</div>}
        </div>
      </div>
    </div>
  );
}