import { cn } from '@/lib/utils';
import { NavLink, Outlet } from 'react-router-dom';

const profileNavItems = [
  { title: 'Overview', href: '/profile/overview' },
  { title: 'Notification', href: '/profile/notification' },
  { title: 'Preferences', href: '/profile/preferences' },
  { title: 'Inventory', href: '/profile/inventory' },
  { title: 'Balance', href: '/profile/balance' },
  { title: 'KYC', href: '/profile/kyc' },
  { title: 'transactions', href: '/profile/transactions' },
];

export default function Profile() {
  return (
    <>
      <div className="container min-h-screen flex flex-col md:flex-row gap-8 md:gap-16 bg-background text-foreground py-8">
        {/* Vertical Sidebar */}
        <nav className="w-64 md:min-h-screen border-gray-200 flex flex-row md:flex-col">
          {profileNavItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'block px-4 py-2 rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors',
                  isActive ? 'bg-accent text-accent-foreground ' : ''
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Main Content Area */}
        <div className="grow">
          <div className="max-w-2xl m-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
