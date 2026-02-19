import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Plus, UserCog } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard },
  { to: '/check-in', icon: Plus },
  { to: '/profile', icon: UserCog },
];

export function Navbar() {
  return (
    <div className="fixed bottom-2 left-0 w-full px-8 mb-4 lg:max-w-[80%] lg:ml-[10%] xl:max-w-[60%] xl:ml-[20%] z-50">
      <div className="flex justify-evenly items-center h-[70px] bg-gray-800 dark:bg-pink-900 rounded-full shadow-lg">
        {NAV_ITEMS.map(({ to, icon: Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <div
                className={clsx(
                  'transition-all duration-200 flex items-center justify-center',
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-900 text-black dark:text-white rounded-full p-3'
                    : 'text-white p-3'
                )}
              >
                <Icon size={24} />
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
