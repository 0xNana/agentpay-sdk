import { useState } from 'react';
import { Zap, Pause, ChevronRight, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Service } from './types';
import { MOCK_SERVICES } from './mockData';

function StatusPill({ status }: { status: Service['status'] }) {
  const map = {
    active: { label: 'Active', color: 'var(--success)', bg: 'rgba(141,216,159,0.12)' },
    paused: { label: 'Paused', color: 'var(--warning)', bg: 'rgba(245,194,107,0.12)' },
    deprecated: { label: 'Deprecated', color: 'var(--danger)', bg: 'rgba(232,109,122,0.12)' },
  };
  const s = map[status];
  return (
    <span
      className="text-xs font-medium px-2 py-0.5 rounded-full"
      style={{ color: s.color, background: s.bg, letterSpacing: '0.03em' }}
    >
      {s.label}
    </span>
  );
}

function PricingBadge({ model }: { model: Service['pricingModel'] }) {
  const labels = { per_call: 'Per-call', subscription: 'Subscription', metered: 'Metered' };
  return (
    <span
      className="text-xs px-2 py-0.5 rounded-full"
      style={{ color: 'var(--muted)', background: 'var(--surface-muted)', border: '1px solid var(--border)' }}
    >
      {labels[model]}
    </span>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={doCopy}
      className="p-1 rounded transition-colors"
      style={{ color: copied ? 'var(--success)' : 'var(--subtle)' }}
      title="Copy endpoint"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
    </button>
  );
}

function CheckoutModal({ service, onClose }: { service: Service; onClose: () => void }) {
  const [step, setStep] = useState<'preview' | 'sent'>('preview');

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(13,27,47,0.7)', backdropFilter: 'blur(4px)' }} onClick={onClose} />

      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border-strong)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: 40, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 40, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold" style={{ color: 'var(--ink)' }}>Checkout Preview</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>{service.name}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded" style={{ color: 'var(--subtle)' }}>
            <X size={16} />
          </button>
        </div>

        {step === 'preview' ? (
          <>
            <div
              className="rounded-xl p-4 flex flex-col gap-3"
              style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}
            >
              <Row label="Service" value={service.name} />
              <Row label="Pricing model" value={{ per_call: 'Per-call', metered: 'Metered', subscription: 'Subscription' }[service.pricingModel]} />
              <Row label="Price per call" value={`$${service.pricePerCall.toFixed(4)} USDC`} highlight />
              <Row label="Payment chain" value={service.acceptedChains[0]} />
              <Row label="Settlement" value="Circle Gateway Nanopayments" />
              <Row label="Protocol" value="x402 / HTTP 402" />
            </div>

            <div
              className="rounded-xl px-4 py-3"
              style={{ background: 'rgba(172,198,233,0.06)', border: '1px solid rgba(172,198,233,0.18)' }}
            >
              <p className="text-xs" style={{ color: 'var(--muted)' }}>
                Payments are authorized via EIP-3009 signed intents and settled gaslessly through Circle Gateway.
                No gas required on the caller side.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => setStep('sent')}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ background: 'var(--accent)', color: '#0d1b2f' }}
              >
                Generate Checkout
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(141,216,159,0.15)', border: '1px solid rgba(141,216,159,0.3)' }}
            >
              <Check size={22} style={{ color: 'var(--success)' }} />
            </div>
            <p className="font-semibold" style={{ color: 'var(--ink)' }}>Checkout URL Ready</p>
            <div
              className="w-full mono text-xs px-3 py-2.5 rounded-xl break-all"
              style={{ background: 'var(--surface-muted)', color: 'var(--muted)', border: '1px solid var(--border)' }}
            >
              https://pay.agentpay.dev/{service.id}?chain={service.acceptedChains[0].toLowerCase().replace(' ', '-')}
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent)', color: '#0d1b2f' }}
            >
              Done
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: 'var(--subtle)' }}>{label}</span>
      <span
        className="text-xs font-medium tabular-nums"
        style={{ color: highlight ? 'var(--accent)' : 'var(--muted)' }}
      >
        {value}
      </span>
    </div>
  );
}

function ServiceCard({ service, onCheckout }: { service: Service; onCheckout: () => void }) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold truncate" style={{ color: 'var(--ink)' }}>{service.name}</p>
            <StatusPill status={service.status} />
            <PricingBadge model={service.pricingModel} />
          </div>
          <p className="text-xs mt-1 text-pretty" style={{ color: 'var(--muted)' }}>{service.description}</p>
        </div>
      </div>

      {/* Endpoint */}
      <div
        className="flex items-center gap-2 px-3 py-2 rounded-xl"
        style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}
      >
        <span className="mono text-xs flex-1 truncate" style={{ color: 'var(--subtle)' }}>
          {service.endpoint}
        </span>
        <CopyButton value={service.endpoint} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Price/call', value: `$${service.pricePerCall.toFixed(4)}` },
          { label: 'Calls (MTD)', value: service.callsThisMonth.toLocaleString() },
          { label: 'Revenue (MTD)', value: `$${service.revenueThisMonth.toFixed(2)}` },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col gap-0.5 px-3 py-2.5 rounded-xl"
            style={{ background: 'var(--surface-muted)' }}
          >
            <span className="text-xs" style={{ color: 'var(--subtle)', letterSpacing: '0.04em' }}>{label}</span>
            <span className="text-sm font-semibold tabular-nums" style={{ color: 'var(--ink-2)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Chains */}
      <div className="flex items-center gap-2 flex-wrap">
        {service.acceptedChains.map((chain) => (
          <span
            key={chain}
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(172,198,233,0.1)', color: 'var(--accent)', border: '1px solid rgba(172,198,233,0.2)' }}
          >
            {chain}
          </span>
        ))}
      </div>

      <button
        onClick={onCheckout}
        disabled={service.status !== 'active'}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        style={{
          background: service.status === 'active' ? 'var(--accent)' : 'var(--surface-muted)',
          color: service.status === 'active' ? '#0d1b2f' : 'var(--subtle)',
          cursor: service.status === 'active' ? 'pointer' : 'not-allowed',
        }}
      >
        {service.status === 'active' ? (
          <>
            <Zap size={13} />
            Generate Checkout Link
            <ChevronRight size={13} />
          </>
        ) : (
          <>
            <Pause size={13} />
            Service Paused
          </>
        )}
      </button>
    </div>
  );
}

export function ServicesView() {
  const [checkoutService, setCheckoutService] = useState<Service | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="display text-xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
          Registered Services
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
          {MOCK_SERVICES.length} services · x402 / Circle Gateway Nanopayments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {MOCK_SERVICES.map((svc) => (
          <ServiceCard key={svc.id} service={svc} onCheckout={() => setCheckoutService(svc)} />
        ))}
      </div>

      <AnimatePresence>
        {checkoutService && (
          <CheckoutModal service={checkoutService} onClose={() => setCheckoutService(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
