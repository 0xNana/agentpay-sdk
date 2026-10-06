import { useState } from 'react';
import { LayoutGrid, Zap, CreditCard, Key, ArrowLeftRight } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { OverviewView } from './components/OverviewView';
import { ServicesView } from './components/ServicesView';
import { BillingView } from './components/BillingView';
import { APIKeysView } from './components/APIKeysView';
import { TransactionsView } from './components/TransactionsView';
import type { View } from './components/types';

const VIEW_ICONS: Record<View, React.ElementType> = {
  overview: LayoutGrid,
  services: Zap,
  billing: CreditCard,
  'api-keys': Key,
  transactions: ArrowLeftRight,
};

const VIEW_LABELS: Record<View, string> = {
  overview: 'Overview',
  services: 'Services',
  billing: 'Billing',
  'api-keys': 'API Keys',
  transactions: 'Transactions',
};

export default function App() {
  const [activeView, setActiveView] = useState<View>('overview');

  const renderView = () => {
    switch (activeView) {
      case 'overview': return <OverviewView />;
      case 'services': return <ServicesView />;
      case 'billing': return <BillingView />;
      case 'api-keys': return <APIKeysView />;
      case 'transactions': return <TransactionsView />;
    }
  };

  const MobileIcon = VIEW_ICONS[activeView];

  return (
    <div className="min-h-dvh flex flex-col md:flex-row">
      <Sidebar activeView={activeView} onNavigate={setActiveView} />

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div
          className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 z-30"
          style={{
            background: 'rgba(13,27,47,0.85)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <MobileIcon size={15} style={{ color: 'var(--accent)' }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            {VIEW_LABELS[activeView]}
          </span>
        </div>

        {/* Scrollable page area */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          {renderView()}
        </div>

        {/* Mobile bottom nav */}
        <nav
          className="md:hidden flex items-center justify-around py-2 pb-safe sticky bottom-0"
          style={{
            background: 'rgba(13,27,47,0.92)',
            backdropFilter: 'blur(12px)',
            borderTop: '1px solid var(--border)',
          }}
        >
          {(
            [
              { id: 'overview', icon: LayoutGrid },
              { id: 'services', icon: Zap },
              { id: 'billing', icon: CreditCard },
              { id: 'api-keys', icon: Key },
              { id: 'transactions', icon: ArrowLeftRight },
            ] as { id: View; icon: React.ElementType }[]
          ).map(({ id, icon: Icon }) => {
            const active = activeView === id;
            return (
              <button
                key={id}
                onClick={() => setActiveView(id)}
                className="flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors min-w-[44px] min-h-[44px] justify-center"
                style={{
                  color: active ? 'var(--accent)' : 'var(--subtle)',
                  background: active ? 'var(--surface-strong)' : 'transparent',
                }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} />
              </button>
            );
          })}
        </nav>
      </main>
    </div>
  );
}
