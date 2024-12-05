import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  const location = useLocation();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <Home className="h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item, index) => (
          <li key={item.path}>
            <div className="flex items-center">
              <ChevronRight
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Link
                to={item.path}
                className={`ml-2 text-sm font-medium ${
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                aria-current={location.pathname === item.path ? 'page' : undefined}
              >
                {item.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}