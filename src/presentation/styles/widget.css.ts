import { BRAND } from './tokens.css';

export const WIDGET_STYLES = `
:host { position: fixed; inset: auto 24px 24px auto; z-index: 2147483000; }
.trigger { width: 76px; display: flex; flex-direction: column; align-items: stretch; padding: 8px; border: 1px solid rgba(17,24,39,0.06); border-radius: 999px; background: #fff; box-shadow: 0 18px 40px -10px rgba(11,26,58,0.32), 0 4px 12px -4px rgba(91,200,229,0.18); }
.trigger-item { position: relative; border: 0; border-radius: 999px; background: transparent; color: ${BRAND.ink}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px 0 13px; transition: background 160ms ease, transform 120ms ease; }
.trigger-item:hover { background: ${BRAND.primarySoft}; }
.trigger-item:active { transform: scale(0.96); }
.trigger-item:focus-visible { outline: 3px solid ${BRAND.primarySoft}; outline-offset: 2px; }
.trigger-item.accent { background: ${BRAND.primary}; color: #fff; margin: -2px 0 6px; padding: 14px 0 12px; }
.trigger-item.accent:hover { background: ${BRAND.primaryDark}; }
.trigger-item.accent::after { content: ''; position: absolute; top: 8px; right: 12px; width: 8px; height: 8px; border-radius: 50%; background: ${BRAND.accent}; box-shadow: 0 0 0 2px ${BRAND.primary}; }
.trigger-icon { height: 30px; display: flex; align-items: center; justify-content: center; }
.trigger-label { margin-top: 4px; color: inherit; font-size: 11px; font-weight: 600; letter-spacing: -0.02em; line-height: 1.25; text-align: center; }
.divider { height: 1px; background: #eef0f2; margin: 2px 14px; }
.panel-wrap { position: fixed; right: 116px; bottom: 24px; width: 430px; height: min(820px, calc(100vh - 48px)); border: 1px solid rgba(17,24,39,0.06); border-radius: 24px; box-shadow: ${BRAND.panelShadow}; overflow: hidden; animation: panelIn 240ms ease-out; }
.notification { position: fixed; right: 24px; bottom: 290px; width: 200px; border: 1px solid rgba(17,24,39,0.06); border-radius: 12px; background: #fff; box-shadow: 0 10px 24px -8px rgba(11,26,58,0.16), 0 2px 6px -3px rgba(11,26,58,0.08); padding: 9px 11px 8px; animation: nbIn 320ms cubic-bezier(0.2,0.8,0.2,1); }
.nb-row { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.nb-avatar { width: 24px; height: 24px; border-radius: 50%; background: ${BRAND.primary}; color: ${BRAND.accent}; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }
.nb-avatar svg { width: 14px; height: 14px; }
.nb-content { min-width: 0; flex: 1; padding-right: 14px; }
.nb-msg { display: block; overflow: hidden; color: ${BRAND.ink}; font-size: 11.5px; font-weight: 500; letter-spacing: -0.025em; line-height: 1.35; text-overflow: ellipsis; white-space: nowrap; }
.nb-msg strong { color: ${BRAND.accentDeep}; font-weight: 600; }
.nb-live { margin-top: 5px; padding-top: 5px; border-top: 1px dashed ${BRAND.bubbleBorder}; display: flex; align-items: center; gap: 5px; color: ${BRAND.inkMuted}; font-size: 10.5px; letter-spacing: -0.02em; white-space: nowrap; }
.nb-live span { position: relative; width: 5px; height: 5px; border-radius: 50%; background: #dc2626; flex: 0 0 auto; }
.nb-live span::after { content: ''; position: absolute; inset: -2px; border-radius: 50%; background: #dc2626; opacity: 0.45; animation: nbPing 1.6s cubic-bezier(0,0,0.2,1) infinite; }
.nb-close { position: absolute; top: 2px; right: 2px; z-index: 2; width: 28px; height: 28px; border: 0; border-radius: 8px; background: transparent; color: ${BRAND.inkMuted}; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.nb-close svg { width: 16px; height: 16px; }
.nb-close:hover { background: ${BRAND.surfaceTint}; color: ${BRAND.ink}; }
.nb-tail { position: absolute; right: 22px; bottom: -6px; width: 11px; height: 11px; background: #fff; border-right: 1px solid rgba(17,24,39,0.06); border-bottom: 1px solid rgba(17,24,39,0.06); transform: rotate(45deg); }
@keyframes panelIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nbIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nbPing { 0% { transform: scale(0.8); opacity: 0.7; } 80%, 100% { transform: scale(2.2); opacity: 0; } }
@media (max-width: 767px) {
  :host { right: 14px; bottom: 18px; }
  :host([data-open]) { inset: 0 auto auto 0; width: 100vw; height: 100vh; }
  .trigger { transform: scale(1.05); transform-origin: bottom right; }
  .panel-wrap { position: absolute; inset: 0; width: 100vw; height: 100vh; border: 0; border-radius: 0; box-shadow: none; transform: none; }
  .notification { right: 14px; bottom: 290px; width: 200px; transform: none; }
}
`;
