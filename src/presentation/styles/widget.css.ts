import { BRAND } from './tokens.css';

export const WIDGET_STYLES = `
:host { position: fixed; inset: auto 21px 72px auto; z-index: 90; }
.trigger { width: 50px; display: flex; flex-direction: column; align-items: stretch; gap: 4px; padding: 0; border: 0; border-radius: 999px; background: #fff; box-shadow: 0 18px 40px -10px rgba(11,26,58,0.32), 0 4px 12px -4px rgba(91,200,229,0.18); overflow: hidden; }
.trigger-item { position: relative; width: 50px; height: 50px; border: 0; border-radius: 0; background: transparent; color: ${BRAND.ink}; cursor: pointer; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0; transition: background 160ms ease, transform 120ms ease; }
.trigger-item + .trigger-item::before { content: ''; position: absolute; left: 11px; right: 11px; top: -2px; height: 1px; background: rgba(15,23,42,0.1); pointer-events: none; }
.trigger-item:hover { background: ${BRAND.primarySoft}; }
.trigger-item:active { transform: scale(0.96); }
.trigger-item:focus-visible { outline: 3px solid ${BRAND.primarySoft}; outline-offset: 2px; }
.trigger-item.chat { padding: 0; }
.trigger-item.chat::before { content: ''; position: absolute; inset: 3px; border-radius: 50%; background: rgba(255,214,94,0.34); box-shadow: 0 0 0 2px rgba(255,214,94,0.72), 0 0 16px 5px rgba(245,158,11,0.72), 0 0 30px 9px rgba(255,229,128,0.5); opacity: 0.98; pointer-events: none; animation: avatarGlowPulse 0.95s ease-in-out infinite alternate; }
.trigger-item.chat:hover { background: transparent; }
.trigger-icon { height: 30px; display: flex; align-items: center; justify-content: center; }
.trigger-item.chat .trigger-icon { width: 50px; height: 50px; border-radius: 50%; overflow: hidden; }
.trigger-icon .chatbot-avatar-img { position: relative; z-index: 1; width: 50px; height: 50px; border: 0; border-radius: 50%; box-shadow: none; display: block; filter: none; object-fit: cover; transform: scale(0.92); transform-origin: center; }
.trigger-item.consult .trigger-icon,
.trigger-item.phone .trigger-icon { height: 30px; }
.trigger-item.consult .trigger-icon svg,
.trigger-item.phone .trigger-icon svg { width: 30px; height: 30px; }
.panel-wrap { position: fixed; right: 83px; bottom: 10px; width: 430px; height: min(820px, calc(100vh - 20px)); border: 1px solid rgba(17,24,39,0.06); border-radius: 24px; box-shadow: ${BRAND.panelShadow}; overflow: hidden; animation: panelIn 240ms ease-out; }
.notification { position: fixed; right: 21px; bottom: 245px; width: auto; min-width: 202px; border: 1px solid rgba(17,24,39,0.06); border-radius: 14px; background: #fff; box-shadow: 0 16px 34px -10px rgba(11,26,58,0.22), 0 4px 12px -5px rgba(11,26,58,0.1); padding: 10px 42px 10px 14px; animation: nbIn 320ms cubic-bezier(0.2,0.8,0.2,1); }
.nb-row { display: flex; align-items: center; cursor: pointer; }
.nb-content { min-width: 0; flex: 1; }
.nb-msg { display: block; color: ${BRAND.ink}; letter-spacing: -0.02em; line-height: 1.3; }
.nb-msg-main { color: ${BRAND.ink}; font-size: 15.5px; font-weight: 650; white-space: nowrap; }
.nb-msg strong { color: #D79200; font-weight: 850; }
.nb-close { position: absolute; top: 5px; right: 5px; z-index: 2; width: 32px; height: 32px; border: 0; border-radius: 10px; background: transparent; color: ${BRAND.inkMuted}; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.nb-close svg { width: 18px; height: 18px; }
.nb-close:hover { background: ${BRAND.surfaceTint}; color: ${BRAND.ink}; }
.nb-tail { position: absolute; right: 18px; bottom: -7px; width: 14px; height: 14px; background: #fff; border-right: 1px solid rgba(17,24,39,0.06); border-bottom: 1px solid rgba(17,24,39,0.06); transform: rotate(45deg); }
@keyframes panelIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes nbIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes avatarGlowPulse { from { opacity: 0.72; transform: scale(0.9); } to { opacity: 1; transform: scale(1.16); } }
@media (prefers-reduced-motion: reduce) {
  .trigger-item.chat::before { animation: none; }
}
@media (max-width: 767px) {
  :host { right: 21px; bottom: 72px; }
  :host([data-open]) { inset: 0 auto auto 0; width: 100vw; height: 100vh; }
  .trigger { width: 50px; gap: 4px; padding: 0; transform: none; transform-origin: bottom right; }
  .trigger-item { width: 50px; height: 50px; padding: 0; }
  .trigger-item.chat { padding: 0; }
  .trigger-icon { height: 26px; }
  .trigger-item.chat .trigger-icon { width: 50px; height: 50px; }
  .trigger-icon svg { width: 22px; height: 22px; }
  .trigger-icon .chatbot-avatar-img { width: 50px; height: 50px; transform: scale(0.92); }
  .trigger-item.consult .trigger-icon,
  .trigger-item.phone .trigger-icon { height: 24px; }
  .trigger-item.consult .trigger-icon svg,
  .trigger-item.phone .trigger-icon svg { width: 24px; height: 24px; }
  .panel-wrap { position: absolute; inset: 0; width: 100vw; height: 100vh; border: 0; border-radius: 0; box-shadow: none; transform: none; }
  .notification { right: 21px; bottom: 245px; min-width: 174px; border-radius: 13px; padding: 9px 34px 9px 12px; transform: none; }
  .nb-content { padding-right: 0; }
  .nb-msg { letter-spacing: -0.025em; }
  .nb-msg-main { font-size: 12.5px; }
  .nb-close { top: 2px; right: 2px; width: 28px; height: 28px; border-radius: 8px; }
  .nb-close svg { width: 16px; height: 16px; }
  .nb-tail { right: 20px; bottom: -6px; width: 11px; height: 11px; }
}
`;
