import Link from "next/link";
import { useRouter } from "next/router";
import { LayoutDashboard, Zap, Grid, Activity, Settings, LogOut, Plus, Store } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Workflows', icon: Zap, href: '/workflows' },
  { name: 'Templates', icon: Grid, href: '/templates' },
  { name: 'Marketplace', icon: Store, href: '/marketplace' },
  { name: 'Activity', icon: Activity, href: '/activity' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export function AppSidebar() {
  const router = useRouter();
  const pathname = router.asPath;

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground h-screen flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-primary text-base tracking-tight">AutoFlow AI</span>
        </div>
      </div>

      {/* Create button */}
      <div className="p-4">
        <Button
          onClick={() => router.push('/workflows/create')}
          className="w-full gradient-primary text-primary-foreground btn-press justify-start gap-2"
        >
          <Plus className="w-4 h-4" /> Create Automation
        </Button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mb-0.5 ${
                isActive
                  ? 'bg-sidebar-accent text-sidebar-primary border-r-2 border-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-primary'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-3 px-3 py-2 text-sm text-sidebar-foreground hover:text-sidebar-primary transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
