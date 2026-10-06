import { TrendingUp, Zap, DollarSign, Activity } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';
import { MOCK_SERVICES, MOCK_BILLING_PLAN, MOCK_TRANSACTIONS } from './mockData';

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3"
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium tracking-widest uppercase" style={{ color: 'var(--subtle)', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: accent ?? 'var(--surface-strong)', border: '1px solid var(--border)' }}
        >
          <Icon size={14} style={{ color: 'var(--accent)' }} />
        </div>
      </div>
      <div>
        <p className="display text-3xl font-bold tabular-nums" style={{ color: 'var(--ink)', letterSpacing: '-0.04em' }}>
          {value}
        </p>
        <p className="text-xs mt-1" style={{ color: 'var(--subtle)' }}>{sub}</p>
      </div>
    </div>
  );
}

export function OverviewView() {
  const totalRevenue = MOCK_SERVICES.reduce((s, svc) => s + svc.revenueThisMonth, 0);
  const totalCalls = MOCK_SERVICES.reduce((s, svc) => s + svc.callsThisMonth, 0);
  const activeServices = MOCK_SERVICES.filter((s) => s.status === 'active').length;
  const pendingTx = MOCK_TRANSACTIONS.filter((t) => t.status === 'pending').length;
  const usagePct = Math.round((MOCK_BILLING_PLAN.callsUsed / MOCK_BILLING_PLAN.callLimit) * 100);

  return (
    <div className="flex flex-col gap-6">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display text-xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            October 2026 · Billing period active
          </p>
        </div>
        <ConnectKitButton />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue (MTD)"
          value={`$${totalRevenue.toFixed(2)}`}
          sub="↑ 18% vs last month"
          icon={DollarSign}
        />
        <StatCard
          label="API Calls (MTD)"
          value={totalCalls.toLocaleString()}
          sub={`${usagePct}% of plan limit`}
          icon={Activity}
        />
        <StatCard
          label="Active Services"
          value={String(activeServices)}
          sub={`${MOCK_SERVICES.length} registered total`}
          icon={Zap}
        />
        <StatCard
          label="Pending Settlements"
          value={String(pendingTx)}
          sub="x402 Gateway queue"
          icon={TrendingUp}
        />
      </div>

      {/* Usage meter */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="font-semibold" style={{ color: 'var(--ink)' }}>
              {MOCK_BILLING_PLAN.name} Plan Usage
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>
              Renews {MOCK_BILLING_PLAN.renewsAt}
            </p>
          </div>
          <span
            className="text-sm font-semibold tabular-nums"
            style={{ color: usagePct > 80 ? 'var(--warning)' : 'var(--success)' }}
          >
            {usagePct}%
          </span>
        </div>
        <div className="relative h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
            style={{
              width: `${usagePct}%`,
              background: usagePct > 80
                ? 'linear-gradient(90deg, var(--warning), #e8844a)'
                : 'linear-gradient(90deg, var(--accent), var(--success))',
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
            {MOCK_BILLING_PLAN.callsUsed.toLocaleString()} calls
          </p>
          <p className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
            {MOCK_BILLING_PLAN.callLimit.toLocaleString()} limit
          </p>
        </div>
      </div>

      {/* Recent transactions */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      >
        <p className="font-semibold mb-4" style={{ color: 'var(--ink)' }}>Recent Settlements</p>
        <div className="flex flex-col gap-2">
          {MOCK_TRANSACTIONS.slice(0, 4).map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: 'var(--surface-muted)' }}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background:
                    tx.status === 'confirmed'
                      ? 'var(--success)'
                      : tx.status === 'pending'
                      ? 'var(--warning)'
                      : 'var(--danger)',
                }}
              />
              <span className="text-sm flex-1 truncate" style={{ color: 'var(--ink-2)' }}>
                {tx.serviceName}
              </span>
              <span className="text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
                {tx.chain}
              </span>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: 'var(--accent)', minWidth: '5ch', textAlign: 'right' }}
              >
                ${tx.amount.toFixed(4)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
