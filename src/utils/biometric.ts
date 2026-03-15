const BIOMETRIC_KEY = 'sunny_biometric_cred';
const BIOMETRIC_SESSION_KEY = 'sunny_bio_session_cache';

export interface BiometricCredential {
  credId: string;
  userId: string;
  userName: string;
}

export interface BiometricSession {
  access_token: string;
  refresh_token: string;
  userName: string;
}

export function isBiometricSupported(): boolean {
  return !!(
    window.PublicKeyCredential &&
    navigator.credentials &&
    navigator.credentials.create
  );
}

export function getStoredCredential(): BiometricCredential | null {
  try {
    return JSON.parse(localStorage.getItem(BIOMETRIC_KEY) || 'null');
  } catch {
    return null;
  }
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padLen = (4 - (base64.length % 4)) % 4;
  const binary = atob(base64 + '='.repeat(padLen));
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export async function registerBiometric(userId: string, userName: string): Promise<boolean> {
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const cred = await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: 'SUNNY OPS', id: location.hostname },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7,   type: 'public-key' },
          { alg: -257, type: 'public-key' },
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          residentKey: 'preferred',
        },
        timeout: 60000,
        attestation: 'none',
      },
    }) as PublicKeyCredential | null;

    if (cred) {
      localStorage.setItem(BIOMETRIC_KEY, JSON.stringify({
        credId: bufferToBase64url((cred as PublicKeyCredential).rawId),
        userId,
        userName,
      } satisfies BiometricCredential));
      return true;
    }
    return false;
  } catch (e) {
    console.log('Biometric register error:', (e as Error).message);
    return false;
  }
}

export async function verifyBiometric(): Promise<BiometricCredential | null> {
  const stored = getStoredCredential();
  if (!stored) return null;
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge,
        rpId: location.hostname,
        allowCredentials: [{ id: base64urlToBuffer(stored.credId), type: 'public-key' }],
        userVerification: 'required',
        timeout: 60000,
      },
    });
    return assertion ? stored : null;
  } catch (e) {
    console.log('Biometric verify error:', (e as Error).message);
    return null;
  }
}

export function saveBiometricSession(
  accessToken: string,
  refreshToken: string,
  userName: string
): void {
  localStorage.setItem(BIOMETRIC_SESSION_KEY, JSON.stringify({
    access_token: accessToken,
    refresh_token: refreshToken,
    userName,
  } satisfies BiometricSession));
}

export function getBiometricSession(): BiometricSession | null {
  try {
    return JSON.parse(localStorage.getItem(BIOMETRIC_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

export function removeBiometric(): void {
  localStorage.removeItem(BIOMETRIC_KEY);
  localStorage.removeItem(BIOMETRIC_SESSION_KEY);
}
