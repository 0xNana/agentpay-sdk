import { CheckCircle2, AlertTriangle, CreditCard } from 'lucide-react';
import { MOCK_BILLING_PLAN, MOCK_SERVICES } from './mockData';

function PlanFeature({ label, included }: { label: string; included: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {included ? (
        <CheckCircle2 size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
      ) : (
        <AlertTriangle size={15} style={{ color: 'var(--subtle)', flexShrink: 0 }} />
      )}
      <span className="text-sm" style={{ color: included ? 'var(--ink-2)' : 'var(--subtle)' }}>
        {label}
      </span>
    </div>
  );
}

export function BillingView() {
  const plan = MOCK_BILLING_PLAN;
  const usagePct = Math.round((plan.callsUsed / plan.callLimit) * 100);
  const totalRevenue = MOCK_SERVICES.reduce((s, svc) => s + svc.revenueThisMonth, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="display text-xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
          Billing
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          Manage your plan, usage, and payment method
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Current plan card */}
        <div
          className="lg:col-span-2 rounded-2xl p-6 flex flex-col gap-5"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full uppercase tracking-widest"
                  style={{
                    background: 'rgba(172,198,233,0.15)',
                    color: 'var(--accent)',
                    letterSpacing: '0.08em',
                    fontSize: '10px',
                  }}
                >
                  Current Plan
                </span>
              </div>
              <p className="display text-2xl font-bold mt-1" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
                {plan.name}
              </p>
            </div>
            <p className="display text-2xl font-bold tabular-nums" style={{ color: 'var(--ink)', letterSpacing: '-0.02em' }}>
              $49
              <span className="text-base font-normal" style={{ color: 'var(--muted)' }}>
                /mo
              </span>
            </p>
          </div>

          {/* Usage meter */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm" style={{ color: 'var(--muted)' }}>API call usage</span>
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: usagePct > 80 ? 'var(--warning)' : 'var(--success)' }}
              >
                {usagePct}%
              </span>
            </div>
            <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface-muted)' }}>
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
            <div className="flex justify-between mt-1.5">
              <p className="text-xs tabular-nums" style={{ color: 'var(--subtle)' }}>
                {plan.callsUsed.toLocaleString()} used
              </p>
              <p className="text-xs tabular-nums" style={{ color: 'var(--subtle)' }}>
                {plan.callLimit.toLocaleString()} included
              </p>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border)' }} />

          <div className="grid grid-cols-2 gap-3">
            <PlanFeature label="500,000 API calls / month" included />
            <PlanFeature label="Circle Gateway settlement" included />
            <PlanFeature label="x402 Nanopayments" included />
            <PlanFeature label="Webhook delivery" included />
            <PlanFeature label="Priority support" included />
            <PlanFeature label="Custom settlement address" included />
            <PlanFeature label="White-label checkout" included={false} />
            <PlanFeature label="SLA guarantee" included={false} />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'var(--accent)', color: '#0d1b2f' }}
            >
              Upgrade to Enterprise
            </button>
            <button
              className="py-2.5 px-4 rounded-xl text-sm font-medium transition-colors"
              style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
            >
              Cancel Plan
            </button>
          </div>
        </div>

        {/* Revenue this month */}
        <div className="flex flex-col gap-4">
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--subtle)', letterSpacing: '0.08em', fontSize: '10px' }}>
              Revenue (MTD)
            </p>
            <p className="display text-3xl font-bold tabular-nums" style={{ color: 'var(--ink)', letterSpacing: '-0.04em' }}>
              ${totalRevenue.toFixed(2)}
            </p>
            <p className="text-xs" style={{ color: 'var(--subtle)' }}>USDC settled via Circle Gateway</p>
          </div>

          {/* Payment method */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--subtle)', letterSpacing: '0.08em', fontSize: '10px' }}>
              Settlement Address
            </p>
            <div className="flex items-center gap-2">
              <CreditCard size={14} style={{ color: 'var(--accent)', flexShrink: 0 }} />
              <span className="mono text-xs" style={{ color: 'var(--muted)' }}>
                0x7...976F
              </span>
            </div>
            <p className="text-xs" style={{ color: 'var(--subtle)' }}>Arc Testnet · USDC</p>
            <button
              className="mt-1 text-xs font-medium py-1.5 rounded-lg transition-colors"
              style={{ background: 'var(--surface-muted)', color: 'var(--accent)', border: '1px solid var(--border)' }}
            >
              Update Address
            </button>
          </div>

          {/* Overage */}
          <div
            className="rounded-2xl p-5 flex flex-col gap-2"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
          >
            <p className="text-xs uppercase tracking-widest" style={{ color: 'var(--subtle)', letterSpacing: '0.08em', fontSize: '10px' }}>
              Overage Rate
            </p>
            <p className="text-sm font-semibold tabular-nums" style={{ color: 'var(--ink)' }}>
              $0.000010 / call
            </p>
            <p className="text-xs" style={{ color: 'var(--subtle)' }}>
              Billed in USDC on the next renewal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
