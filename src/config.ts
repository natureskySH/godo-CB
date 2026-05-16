const scriptSrc = (document.currentScript as HTMLScriptElement | null)?.src ?? '';

export const CHIPS_URL =
  scriptSrc && !scriptSrc.endsWith('/src/entry.ts')
    ? new URL('chips.json', scriptSrc).toString()
    : new URL('/data/chips.json', window.location.origin).toString();

export const WIDGET_TAG_NAME = 'godo-widget';
