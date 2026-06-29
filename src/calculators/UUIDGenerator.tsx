'use client';

import React, { useState, useCallback } from 'react';
import { Fingerprint, RefreshCw, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { copyToClipboard } from '@/utils/storage';

function generateUUIDv4(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateNanoid(len = 21): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function generateObjectId(): string {
  const ts = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const rand = Array.from({ length: 10 }, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join('');
  return ts + rand;
}

type IdType = 'uuidv4' | 'nanoid' | 'objectid' | 'ulid';

function generateULID(): string {
  const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  const t = Date.now();
  let tStr = '';
  let n = t;
  for (let i = 9; i >= 0; i--) { tStr = ENCODING[n % 32] + tStr; n = Math.floor(n / 32); }
  let rStr = '';
  for (let i = 0; i < 16; i++) rStr += ENCODING[Math.floor(Math.random() * 32)];
  return tStr + rStr;
}

interface GeneratedID { id: string; type: string; ts: string; copied: boolean; }

export function UUIDGenerator() {
  const [idType, setIdType] = useState<IdType>('uuidv4');
  const [count, setCount] = useState('1');
  const [generated, setGenerated] = useState<GeneratedID[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [uppercase, setUppercase] = useState(false);

  const generate = useCallback(() => {
    const n = Math.min(Math.max(parseInt(count) || 1, 1), 50);
    const now = new Date().toLocaleTimeString();
    const items: GeneratedID[] = Array.from({ length: n }, () => {
      let id = '';
      if (idType === 'uuidv4') id = generateUUIDv4();
      else if (idType === 'nanoid') id = generateNanoid();
      else if (idType === 'objectid') id = generateObjectId();
      else id = generateULID();
      if (uppercase) id = id.toUpperCase();
      return { id, type: idType.toUpperCase(), ts: now, copied: false };
    });
    setGenerated((prev) => [...items, ...prev].slice(0, 100));
  }, [idType, count, uppercase]);

  const copyOne = async (id: string, idx: number) => {
    await copyToClipboard(id);
    setGenerated((prev) => prev.map((g, i) => ({ ...g, copied: i === idx })));
    setTimeout(() => setGenerated((prev) => prev.map((g, i) => ({ ...g, copied: i === idx ? false : g.copied }))), 2000);
  };

  const copyAll = async () => {
    await copyToClipboard(generated.map(g => g.id).join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const types: { value: IdType; label: string; desc: string }[] = [
    { value: 'uuidv4', label: 'UUID v4', desc: '128-bit random (RFC 4122)' },
    { value: 'nanoid', label: 'NanoID', desc: '21-char URL-safe' },
    { value: 'objectid', label: 'ObjectID', desc: 'MongoDB-compatible 24-char hex' },
    { value: 'ulid', label: 'ULID', desc: 'Sortable 26-char (timestamp + random)' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Fingerprint size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">UUID / ID Generator</h2>
          <p className="text-sm text-classic-muted">Generate UUID v4, NanoID, ObjectID, ULID</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">ID Type</p>
        <div className="grid grid-cols-2 gap-2">
          {types.map((t) => (
            <button key={t.value} onClick={() => setIdType(t.value)}
              className={`py-2 px-3 text-left border transition-colors ${idType === t.value ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              <span className="text-sm font-medium block">{t.label}</span>
              <span className="text-xs opacity-70">{t.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1 flex-1">
          <label className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Count (1–50)</label>
          <input type="number" min={1} max={50} value={count} onChange={e => setCount(e.target.value)}
            className="w-24 px-2 py-1.5 bg-classic-input border border-classic-border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-4">
          <input type="checkbox" checked={uppercase} onChange={e => setUppercase(e.target.checked)}
            className="w-4 h-4 accent-current" />
          <span className="text-sm text-classic-muted">Uppercase</span>
        </label>
      </div>

      <div className="flex gap-3">
        <button onClick={generate} className="flex-1 py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border flex items-center justify-center gap-2">
          <RefreshCw size={16} /> Generate
        </button>
        {generated.length > 0 && (
          <>
            <button onClick={copyAll} className="flex items-center gap-2 px-3 py-2.5 bg-classic-panel border border-classic-border text-classic-muted hover:text-classic-text transition-colors text-sm">
              {copiedAll ? <CheckCircle2 size={16} className="text-green-600" /> : <Copy size={16} />}
              Copy All
            </button>
            <button onClick={() => setGenerated([])} className="p-2.5 bg-classic-panel border border-classic-border text-classic-muted hover:text-classic-text transition-colors" title="Clear">
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>

      {generated.length > 0 && (
        <div className="border border-classic-border bg-classic-panel overflow-hidden">
          <div className="px-4 py-2 border-b border-classic-border bg-classic-bg flex justify-between">
            <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Generated IDs</p>
            <span className="text-xs text-classic-muted">{generated.length} total</span>
          </div>
          <div className="divide-y divide-classic-border max-h-80 overflow-y-auto">
            {generated.map((g, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-2.5 hover:bg-classic-bg transition-colors gap-3">
                <span className="font-mono text-sm text-classic-text break-all flex-1">{g.id}</span>
                <button onClick={() => copyOne(g.id, i)} className="flex-shrink-0 p-1.5 border border-classic-border bg-classic-bg hover:bg-classic-input transition-colors text-classic-muted hover:text-classic-text">
                  {g.copied ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
