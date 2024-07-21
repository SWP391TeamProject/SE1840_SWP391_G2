import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';

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

export function parseIntOrUndefined(value: string | null, fallback: number | undefined = undefined): number | undefined {
  if (value === null) {
    return fallback;
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    return fallback;
  }
  return parsed;
}

export const formatDateToISO = (date: Date | undefined | null): string | undefined => {
  if (!date) {
    return undefined;
  }
  return dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
};

export function truncateHtml(html:string, maxLength: number): string {
  let count = 0;
  let result = '';
  let openTags = [];
  let isTag = false;

  for (let char of html) {
    if (char === '<') {
      isTag = true;
      if (html[count + 1] !== '/') {
        let tagStart = count + 1;
        let tagEnd = html.indexOf('>', tagStart);
        let tag = html.substring(tagStart, tagEnd);
        if (tag[tag.length - 1] !== '/') { // Ignore self-closing tags
          openTags.push(tag.split(' ')[0]); // Push tag name, ignoring attributes
        }
      } else {
        openTags.pop(); // Pop on closing tag
      }
    } else if (char === '>') {
      isTag = false;
      continue;
    }

    if (!isTag && ++count > maxLength) {
      break; // Truncate text
    }

    result += char;
  }

  while (openTags.length) {
    let tag = openTags.pop();
    result += `</${tag}>`; // Close remaining tags
  }

  return result;
}
