import { VALIDATION } from '../constants/translations';
import { DelegationIdentity, isDelegationValid } from '@icp-sdk/core/identity';
import type { Identity } from '@dfinity/agent';

export function validateRequired(value: string): string | null {
  return value.trim() ? null : VALIDATION.required;
}

export function validateEmail(email: string): string | null {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim()) return VALIDATION.required;
  if (!emailRegex.test(email)) return VALIDATION.invalidEmail;
  return null;
}

export function validatePhone(phone: string): string | null {
  const phoneRegex = /^[0-9+\-\s()]+$/;
  if (!phone.trim()) return VALIDATION.required;
  if (!phoneRegex.test(phone)) return VALIDATION.invalidPhone;
  return null;
}

export function validateMinLength(value: string, min: number): string | null {
  if (!value.trim()) return VALIDATION.required;
  if (value.length < min) return VALIDATION.minLength(min);
  return null;
}

export function validateMaxLength(value: string, max: number): string | null {
  if (value.length > max) return VALIDATION.maxLength(max);
  return null;
}

export function validateNumeric(value: string): string | null {
  if (!value.trim()) return VALIDATION.required;
  if (isNaN(Number(value))) return 'Harus berupa angka';
  return null;
}

export function validateUrl(url: string): string | null {
  try {
    new URL(url);
    return null;
  } catch {
    return 'URL tidak valid';
  }
}

/**
 * Validates delegation identity for authenticated operations
 * Returns null if valid, error message if invalid
 */
export function validateDelegationIdentity(identity: Identity | null | undefined): string | null {
  if (!identity) {
    return 'Anda harus login terlebih dahulu';
  }

  // Check if it's a delegation identity and validate it
  if (identity instanceof DelegationIdentity) {
    const delegation = identity.getDelegation();
    
    if (!isDelegationValid(delegation)) {
      return 'Sesi Anda telah berakhir. Silakan login kembali.';
    }

    const expiration = delegation.delegations[0]?.delegation.expiration;
    if (expiration) {
      // Convert from nanoseconds to milliseconds
      const expiryTime = Number(expiration) / 1_000_000;
      const currentTime = Date.now();
      const timeUntilExpiry = expiryTime - currentTime;
      
      // Warn if expiring within 1 minute
      if (timeUntilExpiry < 60_000) {
        return 'Sesi Anda akan segera berakhir. Silakan login kembali.';
      }
    }
  }

  return null;
}
