import { cn } from '@/lib/utils';
import { NavLink, Outlet } from 'react-router-dom';

const profileNavItems = [
  { title: 'Overview', href: '/profile/overview' },
  { title: 'Notification', href: '/profile/notification' },
  { title: 'Preferences', href: '/profile/preferences' },
  { title: 'Inventory', href: '/profile/inventory' },
  { title: 'Balance', href: '/profile/balance' },
  { title: 'Transactions', href: '/profile/transactions' },
  { title: 'KYC', href: '/profile/kyc' },
];

export default function Profile() {
  return (
    <>
      <div className="container min-h-screen flex flex-col md:flex-row gap-8 md:gap-16 bg-background text-foreground py-8">
        {/* Vertical Sidebar */}
        <nav className="w-full md:w-56 md:min-h-screen border-gray-200 flex flex-row md:flex-col flex-wrap">
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
        <div className="w-full flex justify-center">
          <Outlet />
        </div>
      </div>
    </>
  );
}
