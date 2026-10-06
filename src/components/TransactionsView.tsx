import { useState } from 'react';
import { ExternalLink, CheckCircle2, Clock, XCircle, RefreshCw } from 'lucide-react';
import type { Transaction, TxStatus } from './types';
import { MOCK_TRANSACTIONS } from './mockData';
import { buildTxExplorerUrl } from '@/onchain-facts';

function statusIcon(status: TxStatus) {
  if (status === 'confirmed') return <CheckCircle2 size={14} style={{ color: 'var(--success)' }} />;
  if (status === 'pending') return <Clock size={14} style={{ color: 'var(--warning)' }} />;
  return <XCircle size={14} style={{ color: 'var(--danger)' }} />;
}

function relativeTime(ts: number) {
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

const CHAIN_IDS: Record<string, number> = {
  'Arc Testnet': 5042002,
  'Base Sepolia': 84532,
  'Ethereum Sepolia': 11155111,
};

function TxRow({ tx }: { tx: Transaction }) {
  const chainId = CHAIN_IDS[tx.chain];
  const explorerUrl = tx.txHash && chainId ? buildTxExplorerUrl(chainId, tx.txHash) : null;

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl"
      style={{ background: 'var(--surface-muted)', border: '1px solid var(--border)' }}
    >
      <div className="shrink-0">{statusIcon(tx.status)}</div>

      <div className="flex-1 min-w-0">
        <p className="text-sm truncate" style={{ color: 'var(--ink-2)' }}>{tx.serviceName}</p>
        <p className="mono text-xs truncate mt-0.5" style={{ color: 'var(--subtle)' }}>
          {tx.callerAddress.slice(0, 10)}…{tx.callerAddress.slice(-6)}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p
          className="text-sm font-semibold tabular-nums"
          style={{ color: tx.status === 'failed' ? 'var(--danger)' : 'var(--accent)' }}
        >
          ${tx.amount.toFixed(4)}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>{tx.chain}</p>
      </div>

      <p className="text-xs w-12 text-right shrink-0" style={{ color: 'var(--subtle)' }}>
        {relativeTime(tx.timestamp)}
      </p>

      {explorerUrl ? (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded shrink-0"
          style={{ color: 'var(--subtle)' }}
          title="View on explorer"
        >
          <ExternalLink size={12} />
        </a>
      ) : (
        <div className="w-5 shrink-0" />
      )}
    </div>
  );
}

export function TransactionsView() {
  const [filter, setFilter] = useState<TxStatus | 'all'>('all');

  const filtered = filter === 'all' ? MOCK_TRANSACTIONS : MOCK_TRANSACTIONS.filter((t) => t.status === filter);

  const confirmed = MOCK_TRANSACTIONS.filter((t) => t.status === 'confirmed').length;
  const pending = MOCK_TRANSACTIONS.filter((t) => t.status === 'pending').length;
  const failed = MOCK_TRANSACTIONS.filter((t) => t.status === 'failed').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="display text-xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            Transactions
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            x402 settlement log · Circle Gateway Nanopayments
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
          style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Confirmed', count: confirmed, color: 'var(--success)', bg: 'rgba(141,216,159,0.08)' },
          { label: 'Pending', count: pending, color: 'var(--warning)', bg: 'rgba(245,194,107,0.08)' },
          { label: 'Failed', count: failed, color: 'var(--danger)', bg: 'rgba(232,109,122,0.08)' },
        ].map(({ label, count, color, bg }) => (
          <div
            key={label}
            className="rounded-xl px-4 py-3 flex flex-col gap-1"
            style={{ background: bg, border: `1px solid ${color}22` }}
          >
            <span className="text-xs" style={{ color: 'var(--subtle)' }}>{label}</span>
            <span className="text-xl font-bold tabular-nums display" style={{ color, letterSpacing: '-0.02em' }}>
              {count}
            </span>
          </div>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex items-center gap-2">
        {(['all', 'confirmed', 'pending', 'failed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors"
            style={{
              background: filter === f ? 'var(--accent)' : 'var(--surface-muted)',
              color: filter === f ? '#0d1b2f' : 'var(--muted)',
              border: `1px solid ${filter === f ? 'transparent' : 'var(--border)'}`,
            }}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--subtle)' }}>
          {filtered.length} records
        </span>
      </div>

      {/* Transaction list */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-2"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      >
        {filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm" style={{ color: 'var(--subtle)' }}>No transactions found</p>
          </div>
        ) : (
          filtered.map((tx) => <TxRow key={tx.id} tx={tx} />)
        )}
      </div>
    </div>
  );
}
