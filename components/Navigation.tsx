'use client';

import { useAuthStore } from '@/lib/store';
import { Briefcase, Users, User, Plus, FileText, ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const { user, isAuthenticated } = useAuthStore();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isAuthenticated || !user) return null;

  // Role-based navigation items
  const getNavItems = () => {
    if (user.role === 'company') {
      return [
        { icon: Plus, label: 'Add Job', href: '/jobs/create', shortLabel: 'Add' },
        { icon: Users, label: 'Candidates', href: '/candidates', shortLabel: 'Cand' },
        { icon: Briefcase, label: 'My Jobs', href: '/jobs', shortLabel: 'Jobs' },
        { icon: FileText, label: 'Applications', href: '/applications', shortLabel: 'Apps' },
        { icon: User, label: 'Profile', href: '/profile', shortLabel: 'Prof' },
      ];
    } else if (user.role === 'candidate') {
      return [
        { icon: Briefcase, label: 'Jobs', href: '/jobs', shortLabel: 'Jobs' },
        { icon: ClipboardList, label: 'My Applications', href: '/my-applications', shortLabel: 'Apps' },
        { icon: Users, label: 'Network', href: '/network', shortLabel: 'Net' },
        { icon: User, label: 'Profile', href: '/profile', shortLabel: 'Prof' },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (!mounted) return false;
    return pathname === href;
  };

  if (!mounted) return null;

  return (
    <>
      {/* Bottom Navigation Bar - Responsive */}
      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-white/10 bg-dark-900/95 backdrop-blur-xl">
        <div className="w-full px-2 sm:px-4">
          <div className="flex items-center justify-around h-16 sm:h-20">
            {navItems.map(({ icon: Icon, label, href, shortLabel }) => (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-4 py-2 rounded-lg transition-all flex-1 ${
                  isActive(href)
                    ? 'text-primary-400'
                    : 'text-dark-400 hover:text-white'
                }`}
              >
                <Icon size={20} className="sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-xs font-medium hidden sm:inline">{label}</span>
                <span className="text-xs sm:hidden font-medium">{shortLabel}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Spacer for bottom nav - Responsive */}
      <div className="h-16 sm:h-20"></div>
    </>
  );
}
