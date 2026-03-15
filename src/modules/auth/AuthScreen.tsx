import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
import {
  isBiometricSupported,
  getStoredCredential,
  registerBiometric,
  removeBiometric,
} from '@/utils/biometric';
import type { BiometricCredential } from '@/utils/biometric';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<string | null>;
  onBiometricSignIn: () => Promise<string | null>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSignIn, onBiometricSignIn }) => {
  const [email, setEmail]       = useState('');
  const [pass, setPass]         = useState('');
  const [err, setErr]           = useState('');
  const [loading, setLoading]   = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [bioStored, setBioStored]   = useState<BiometricCredential | null>(null);
  const [bioSupported, setBioSupported] = useState(false);
  const [showBioSetup, setShowBioSetup] = useState(false);
  const [pendingUser, setPendingUser]   = useState<{ userId: string; userName: string; role: string } | null>(null);

  useEffect(() => {
    setBioSupported(isBiometricSupported());
    setBioStored(getStoredCredential());
  }, []);

  const handleSubmit = async () => {
    if (!email || !pass) return setErr('Fill all fields');
    setLoading(true);
    setErr('');
    const error = await onSignIn(email, pass);
    if (error) {
      setErr(error);
      setLoading(false);
      return;
    }
    // Offer biometric if supported and not yet registered
    if (bioSupported && !getStoredCredential()) {
      setPendingUser({ userId: email, userName: email, role: 'staff' });
      setShowBioSetup(true);
    }
    setLoading(false);
  };

  const handleBioLogin = async () => {
    setBioLoading(true);
    setErr('');
    const error = await onBiometricSignIn();
    if (error) setErr(error);
    setBioLoading(false);
  };

  const handleEnableBio = async () => {
    if (!pendingUser) return;
    await registerBiometric(pendingUser.userId, pendingUser.userName);
    setBioStored(getStoredCredential());
    setShowBioSetup(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    background: '#f8fafc', border: '1px solid #e2e8f0',
    borderRadius: 6, padding: '9px 12px',
    fontFamily: 'inherit', fontSize: 13, color: '#0f172a',
  };

  // ── Biometric Setup Prompt ──────────────────────────────────────────
  if (showBioSetup && pendingUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
        <div style={{ background: '#fff', borderRadius: 16, padding: '40px 32px', width: '100%', maxWidth: 380, textAlign: 'center', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🔐</div>
          <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>Enable Biometric Login</div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 28, lineHeight: 1.7 }}>
            Use <strong>fingerprint or Face ID</strong> to sign in instantly next time.
          </div>
          <Button onClick={handleEnableBio} style={{ width: '100%', padding: '13px 0', marginBottom: 12, fontSize: 14 }}>
            🔐 Enable Biometric
          </Button>
          <Button variant="ghost" onClick={() => setShowBioSetup(false)} style={{ width: '100%', padding: '11px 0' }}>
            Skip for now
          </Button>
        </div>
      </div>
    );
  }

  // ── Main Login Screen ───────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: 20 }}>
      <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '40px 36px', width: '100%', maxWidth: 400 }}>

        {/* Logo + Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 22, color: '#0f172a', fontFamily: 'IBM Plex Mono, monospace' }}>
            SUNNY OPS
          </div>
          <div style={{ fontSize: 10, color: '#64748b', letterSpacing: 3, marginTop: 6, fontFamily: 'IBM Plex Mono, monospace' }}>
            OPERATIONS & FINANCE MANAGEMENT
          </div>
        </div>

        {/* Biometric button */}
        {bioStored && bioSupported && (
          <div style={{ marginBottom: 20 }}>
            <Button
              onClick={handleBioLogin}
              loading={bioLoading}
              style={{ width: '100%', padding: '14px 0', fontSize: 14, marginBottom: 8 }}
            >
              🔐 Sign in with Biometric
            </Button>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#64748b', marginBottom: 12 }}>
              Hi, <strong>{bioStored.userName}</strong> 👋
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
              <span style={{ fontSize: 11, color: '#94a3b8' }}>or use password</span>
              <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
            </div>
          </div>
        )}

        {/* Error */}
        {err && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 12, marginBottom: 14 }}>
            {err}
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, letterSpacing: 1 }}>EMAIL</div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            style={inputStyle}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontFamily: 'IBM Plex Mono, monospace', fontWeight: 700, letterSpacing: 1 }}>PASSWORD</div>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            style={inputStyle}
          />
        </div>

        <Button onClick={handleSubmit} loading={loading} style={{ width: '100%', padding: '11px 0', fontSize: 13 }}>
          Sign In
        </Button>

        {/* Remove biometric */}
        {bioStored && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <button
              onClick={() => { removeBiometric(); setBioStored(null); }}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
            >
              Remove biometric from this device
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
