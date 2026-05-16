export const BRAND = {
  primary: '#0B1A3A',
  primaryDark: '#061128',
  primarySoft: 'rgba(11, 26, 58, 0.08)',
  primarySofter: 'rgba(11, 26, 58, 0.04)',
  accent: '#5BC8E5',
  accentDeep: '#2BA8CB',
  accentSoft: 'rgba(91, 200, 229, 0.14)',
  ink: '#0F172A',
  inkSoft: '#334155',
  inkMuted: '#64748B',
  bubble: '#F1F5F9',
  bubbleBorder: '#E2E8F0',
  surface: '#FFFFFF',
  surfaceTint: '#F8FAFC',
  panelShadow: '0 24px 60px -16px rgba(11,26,58,0.35), 0 8px 20px -8px rgba(11,26,58,0.18)',
} as const;

export const FONT_CSS = `
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css');
:host {
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  color: ${BRAND.ink};
  box-sizing: border-box;
}
*, *::before, *::after { box-sizing: border-box; }
button { font: inherit; }
`;
