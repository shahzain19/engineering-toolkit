'use client';

import React, { useState, useCallback } from 'react';
import { Hash, Copy, CheckCircle2 } from 'lucide-react';
import { copyToClipboard } from '@/utils/storage';

// CRC-8 (SMBUS polynomial 0x07)
function crc8(data: Uint8Array): number {
  let crc = 0;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc & 0x80) ? ((crc << 1) ^ 0x07) & 0xFF : (crc << 1) & 0xFF;
  }
  return crc;
}

// CRC-16 CCITT (0x1021)
function crc16(data: Uint8Array): number {
  let crc = 0xFFFF;
  for (const byte of data) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc;
}

// CRC-32 (IEEE 802.3)
function crc32(data: Uint8Array): number {
  let crc = 0xFFFFFFFF;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc & 1) ? ((crc >>> 1) ^ 0xEDB88320) : (crc >>> 1);
  }
  return (~crc) >>> 0;
}

// Simple sum checksum
function sumChecksum(data: Uint8Array): number {
  return data.reduce((a, b) => (a + b) & 0xFF, 0);
}

// XOR checksum
function xorChecksum(data: Uint8Array): number {
  return data.reduce((a, b) => a ^ b, 0);
}

// Adler-32
function adler32(data: Uint8Array): number {
  let a = 1, b = 0;
  for (const byte of data) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  return ((b << 16) | a) >>> 0;
}

function toHex(n: number, bytes: number) { return n.toString(16).toUpperCase().padStart(bytes * 2, '0'); }

type InputMode = 'text' | 'hex';

export function CRCChecksumCalculator() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<InputMode>('text');
  const [results, setResults] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState<string | null>(null);

  const calculate = useCallback(() => {
    setError('');
    let bytes: Uint8Array;

    if (mode === 'text') {
      bytes = new TextEncoder().encode(input);
    } else {
      const hex = input.replace(/\s+/g, '');
      if (hex.length % 2 !== 0) return setError('Hex input must have an even number of characters.');
      if (!/^[0-9A-Fa-f]*$/.test(hex)) return setError('Invalid hex characters detected.');
      bytes = new Uint8Array(hex.match(/.{2}/g)!.map(h => parseInt(h, 16)));
    }

    if (bytes.length === 0) return setError('Input cannot be empty.');

    setResults({
      'CRC-8 (SMBUS)': `0x${toHex(crc8(bytes), 1)}`,
      'CRC-16 (CCITT)': `0x${toHex(crc16(bytes), 2)}`,
      'CRC-32 (IEEE)': `0x${toHex(crc32(bytes), 4)}`,
      'Sum Checksum': `0x${toHex(sumChecksum(bytes), 1)}`,
      'XOR Checksum': `0x${toHex(xorChecksum(bytes), 1)}`,
      'Adler-32': `0x${toHex(adler32(bytes), 4)}`,
      'Byte Count': `${bytes.length} bytes`,
    });
  }, [input, mode]);

  const handleCopy = async (key: string, val: string) => {
    await copyToClipboard(val);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-classic-accent text-classic-accent-text"><Hash size={22} /></div>
        <div>
          <h2 className="text-xl font-bold text-classic-text">CRC / Checksum Calculator</h2>
          <p className="text-sm text-classic-muted">Calculate CRC-8, CRC-16, CRC-32, XOR, Adler-32</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider mb-2">Input Mode</p>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['text', 'hex'] as InputMode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setResults(null); setError(''); }}
              className={`py-2 px-3 text-sm font-medium border transition-colors ${mode === m ? 'bg-classic-accent text-classic-accent-text border-classic-accent' : 'bg-classic-panel border-classic-border text-classic-muted hover:text-classic-text'}`}>
              {m === 'text' ? 'ASCII / UTF-8 Text' : 'Hex Bytes (e.g. DE AD BE EF)'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-classic-text uppercase tracking-wider">
            {mode === 'text' ? 'Input String' : 'Hex Input'}
          </label>
          <textarea
            value={input}
            onChange={(e) => { setInput(e.target.value); setResults(null); }}
            placeholder={mode === 'text' ? 'e.g. Hello World' : 'e.g. DE AD BE EF 01 02 03'}
            rows={3}
            className="w-full px-3 py-2 bg-classic-input border border-classic-border text-classic-text text-sm font-mono focus:outline-none focus:border-classic-accent resize-none"
          />
        </div>
      </div>

      {error && <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</div>}

      <button onClick={calculate} className="w-full py-2.5 px-6 bg-classic-accent text-classic-accent-text font-bold text-sm hover:bg-classic-accent-hover transition-colors border border-classic-border">
        Calculate Checksums
      </button>

      {results && (
        <div className="border border-classic-border bg-classic-panel overflow-hidden">
          <div className="px-4 py-2 border-b border-classic-border bg-classic-bg">
            <p className="text-xs font-semibold text-classic-muted uppercase tracking-wider">Results</p>
          </div>
          <div className="divide-y divide-classic-border">
            {Object.entries(results).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between px-4 py-3 hover:bg-classic-bg transition-colors">
                <div>
                  <p className="text-sm font-medium text-classic-text">{key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-classic-accent font-bold text-sm">{val}</span>
                  {key !== 'Byte Count' && (
                    <button onClick={() => handleCopy(key, val)} className="p-1.5 border border-classic-border bg-classic-bg hover:bg-classic-input transition-colors text-classic-muted hover:text-classic-text" title="Copy">
                      {copied === key ? <CheckCircle2 size={14} className="text-green-600" /> : <Copy size={14} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
