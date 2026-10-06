import { Zap, LayoutGrid, CreditCard, Key, ArrowLeftRight, ChevronRight } from 'lucide-react';
import type { View } from './types';

interface SidebarProps {
  activeView: View;
  onNavigate: (v: View) => void;
}

const NAV = [
  { id: 'overview' as View, label: 'Overview', icon: LayoutGrid },
  { id: 'services' as View, label: 'Services', icon: Zap },
  { id: 'billing' as View, label: 'Billing', icon: CreditCard },
  { id: 'api-keys' as View, label: 'API Keys', icon: Key },
  { id: 'transactions' as View, label: 'Transactions', icon: ArrowLeftRight },
];

export function Sidebar({ activeView, onNavigate }: SidebarProps) {
  return (
    <aside
      className="hidden md:flex flex-col w-56 shrink-0"
      style={{
        background: 'var(--surface)',
        borderRight: '1px solid var(--border)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderBottom: '1px solid var(--border)' }}>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: 'var(--accent)', boxShadow: '0 0 0 1px rgba(172,198,233,0.2)' }}
        >
          <Zap size={15} style={{ color: '#0d1b2f' }} fill="#0d1b2f" />
        </div>
        <span className="display font-semibold text-sm" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          AgentPay
        </span>
        <span
          className="ml-auto text-xs font-medium px-1.5 py-0.5 rounded"
          style={{
            background: 'rgba(141, 216, 159, 0.15)',
            color: 'var(--success)',
            letterSpacing: '0.04em',
          }}
        >
          SDK
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-left transition-colors"
              style={{
                background: active ? 'var(--surface-strong)' : 'transparent',
                color: active ? 'var(--ink)' : 'var(--muted)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}
            >
              <Icon size={15} strokeWidth={active ? 2.5 : 1.8} />
              {label}
              {active && <ChevronRight size={12} className="ml-auto" style={{ color: 'var(--subtle)' }} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
        <p className="text-xs" style={{ color: 'var(--subtle)' }}>
          Testnet · Arc
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)', letterSpacing: '0.02em' }}>
          v0.9.1-beta
        </p>
      </div>
    </aside>
  );
}
