import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from "dayjs";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatDate(date: Date | string | number, opts: Intl.DateTimeFormatOptions = {}) {
  return new Intl.DateTimeFormat('en-US', {
    month: opts.month ?? 'long',
    day: opts.day ?? 'numeric',
    year: opts.year ?? 'numeric',
    ...opts,
  }).format(new Date(date));
}

export function getEnumValue<T extends object>(enumObj: T, value: any, fallback?: T[keyof T]): T[keyof T] {
  const stringValue = String(value);
  if (stringValue in enumObj) {
    return enumObj[stringValue as keyof T];
  }
  return fallback as T[keyof T];
}

export function parseDate(dateString: any, fallback?: Date): Date | undefined {
  if (!dateString) {
    return fallback;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return fallback;
  }
  return date;
}

export function parseIntOrUndefined(value: string, fallback?: number): number | undefined {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

export const formatDateToISO = (date: Date | undefined): string | undefined => {
  if (!date) {
    return undefined;
  }
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
};
