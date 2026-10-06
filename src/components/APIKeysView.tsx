import { useState } from 'react';
import { Key, Copy, Check, Trash2, Plus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { APIKey } from './types';
import { MOCK_API_KEYS } from './mockData';

function KeyRow({ apiKey, onRevoke }: { apiKey: APIKey; onRevoke: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const [showFull, setShowFull] = useState(false);

  const doCopy = () => {
    navigator.clipboard.writeText(apiKey.prefix + '••••••••••••••').catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-xl"
      style={{
        background: 'var(--surface-muted)',
        border: '1px solid var(--border)',
        opacity: apiKey.status === 'revoked' ? 0.5 : 1,
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: apiKey.status === 'active' ? 'rgba(172,198,233,0.12)' : 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          <Key size={13} style={{ color: apiKey.status === 'active' ? 'var(--accent)' : 'var(--subtle)' }} />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--ink-2)' }}>
              {apiKey.label}
            </p>
            {apiKey.status === 'revoked' && (
              <span
                className="text-xs px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(232,109,122,0.12)', color: 'var(--danger)' }}
              >
                Revoked
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="mono text-xs" style={{ color: 'var(--subtle)' }}>
              {showFull ? `${apiKey.prefix}••••••••••••••` : `${apiKey.prefix.slice(0, 12)}•••`}
            </span>
            {apiKey.status === 'active' && (
              <button
                onClick={() => setShowFull((v) => !v)}
                className="p-0.5"
                style={{ color: 'var(--subtle)' }}
              >
                {showFull ? <EyeOff size={10} /> : <Eye size={10} />}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-xs text-right" style={{ color: 'var(--subtle)' }}>
          <p className="tabular-nums">{apiKey.callsTotal.toLocaleString()} calls</p>
          <p>{apiKey.lastUsed ? `Used ${apiKey.lastUsed}` : 'Never used'}</p>
        </div>

        {apiKey.status === 'active' && (
          <div className="flex items-center gap-1">
            <button
              onClick={doCopy}
              className="p-2 rounded-lg transition-colors"
              style={{ color: copied ? 'var(--success)' : 'var(--subtle)', background: 'var(--surface)' }}
              title="Copy key"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
            </button>
            <button
              onClick={() => onRevoke(apiKey.id)}
              className="p-2 rounded-lg transition-colors"
              style={{ color: 'var(--subtle)', background: 'var(--surface)' }}
              title="Revoke key"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function CreateKeyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (label: string) => void }) {
  const [label, setLabel] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCreate = () => {
    if (!label.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      onCreated(label.trim());
      onClose();
    }, 800);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(13,27,47,0.75)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-sm rounded-2xl p-6 flex flex-col gap-5"
        style={{
          background: 'var(--surface-strong)',
          border: '1px solid var(--border-strong)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: 32, scale: 0.97 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 32, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
      >
        <p className="font-semibold" style={{ color: 'var(--ink)' }}>Create API Key</p>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs" style={{ color: 'var(--subtle)' }}>Key label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Production — Agent v2"
            className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: 'var(--surface-muted)',
              border: '1px solid var(--border)',
              color: 'var(--ink)',
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            autoFocus
          />
        </div>

        <div
          className="px-4 py-3 rounded-xl"
          style={{ background: 'rgba(172,198,233,0.06)', border: '1px solid rgba(172,198,233,0.16)' }}
        >
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            The key secret is shown once on creation and cannot be retrieved again. Store it in your agent's secure environment.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium"
            style={{ border: '1px solid var(--border)', color: 'var(--muted)' }}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!label.trim() || submitted}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: label.trim() && !submitted ? 'var(--accent)' : 'var(--surface-muted)',
              color: label.trim() && !submitted ? '#0d1b2f' : 'var(--subtle)',
              cursor: label.trim() && !submitted ? 'pointer' : 'not-allowed',
            }}
          >
            {submitted ? 'Creating…' : 'Create Key'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function APIKeysView() {
  const [keys, setKeys] = useState<APIKey[]>(MOCK_API_KEYS);
  const [showModal, setShowModal] = useState(false);

  const handleRevoke = (id: string) => {
    setKeys((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'revoked' as const } : k)),
    );
  };

  const handleCreated = (label: string) => {
    const prefix = `apk_live_${Math.random().toString(36).slice(2, 6)}`;
    setKeys((prev) => [
      {
        id: `key_new_${Date.now()}`,
        label,
        prefix,
        createdAt: new Date().toISOString().split('T')[0],
        lastUsed: null,
        callsTotal: 0,
        status: 'active' as const,
      },
      ...prev,
    ]);
  };

  const active = keys.filter((k) => k.status === 'active');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="display text-xl font-bold" style={{ color: 'var(--ink)', letterSpacing: '-0.03em' }}>
            API Keys
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
            {active.length} active · {keys.length - active.length} revoked
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: 'var(--accent)', color: '#0d1b2f' }}
        >
          <Plus size={14} />
          New Key
        </button>
      </div>

      <div
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      >
        <AnimatePresence mode="popLayout">
          {keys.map((key) => (
            <KeyRow key={key.id} apiKey={key} onRevoke={handleRevoke} />
          ))}
        </AnimatePresence>
      </div>

      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', backdropFilter: 'blur(8px)' }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: 'var(--ink)' }}>SDK Quick-start</p>
        <pre
          className="mono text-xs p-4 rounded-xl overflow-x-auto"
          style={{ background: 'var(--surface-muted)', color: 'var(--muted)', border: '1px solid var(--border)' }}
        >{`// Install
npm install @agentpay/sdk

// Initialize
import { AgentPay } from '@agentpay/sdk'
const sdk = new AgentPay({ apiKey: 'apk_live_...' })

// Call a paid service (x402 / Gateway)
const result = await sdk.call('svc_ai_inference', {
  prompt: 'Summarize this document...',
  maxTokens: 512,
})
// Auto-pays $0.002 USDC via Circle Gateway Nanopayments`}
        </pre>
      </div>

      <AnimatePresence>
        {showModal && (
          <CreateKeyModal onClose={() => setShowModal(false)} onCreated={handleCreated} />
        )}
      </AnimatePresence>
    </div>
  );
}
