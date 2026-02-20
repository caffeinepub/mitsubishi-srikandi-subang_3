import { VALIDATION } from '../constants/translations';

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
