import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Users,
  UserPlus,
  UserMinus,
  BarChart3,
  Briefcase,
  Settings
} from 'lucide-react';
import logo from '../../assets/dopslogo.png';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/pillars', icon: Building2, label: 'Pillars' },
  { to: '/teams', icon: Briefcase, label: 'Teams' },
  { to: '/members', icon: Users, label: 'Members' },
  { to: '/onboarding', icon: UserPlus, label: 'Onboarding' },
  { to: '/offboarding', icon: UserMinus, label: 'Offboarding' },
  { to: '/reports', icon: BarChart3, label: 'Reports' },
  { to: '/admin', icon: Settings, label: 'Admin' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 bg-pink-50 text-gray-900 h-screen overflow-y-auto z-10">
      <div className="p-6">
        <img src={logo} alt="DOPS Logo" className="w-full h-auto" />
      </div>
      <nav className="p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-pink-600 text-white'
                    : 'text-gray-700 hover:bg-pink-100 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
