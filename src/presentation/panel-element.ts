import type { Chip } from '../data/types';
import { CLOSE_ICON, MEGAPHONE_ICON, ROBOT_ICON } from './icons';
import { markdownToSafeHtml } from './markdown';
import { BRAND, FONT_CSS } from './styles/tokens.css';

export type PanelTurn =
  | { type: 'greeting' }
  | { type: 'picked'; chip: Chip }
  | { type: 'typing'; chipId: string }
  | { type: 'answer'; chip: Chip };

export type PanelView = {
  faqChips: Chip[];
  consultChip: Chip | null;
  callChip: Chip | null;
  turns: PanelTurn[];
  loadFailed: boolean;
};

export class GodoPanelElement extends HTMLElement {
  private root = this.attachShadow({ mode: 'open' });
  private view: PanelView = {
    faqChips: [],
    consultChip: null,
    callChip: null,
    turns: [],
    loadFailed: false,
  };
  private listenersBound = false;
  private scrollFrame: number | null = null;

  connectedCallback() {
    this.render();
  }

  setView(view: PanelView) {
    const previousBody = this.root.querySelector<HTMLElement>('.body');
    const previousScrollTop = previousBody?.scrollTop ?? 0;
    const shouldPreserveScroll = previousBody !== null;

    this.view = view;
    this.render();

    const body = this.root.querySelector<HTMLElement>('.body');
    if (body && shouldPreserveScroll) body.scrollTop = previousScrollTop;

    requestAnimationFrame(() => this.scrollToEnd(shouldPreserveScroll));
  }

  focusFirst() {
    this.root.querySelector<HTMLButtonElement>('.close')?.focus();
  }

  private render() {
    const turns = this.view.turns.length
      ? this.view.turns
      : [{ type: 'greeting' } satisfies PanelTurn];
    this.root.innerHTML = `
      <style>${FONT_CSS}${styles}</style>
      <section class="panel" role="dialog" aria-label="고도 봇" aria-modal="false">
        <header class="head">
          <div class="head-left">
            <span class="avatar">${ROBOT_ICON}</span>
            <strong>고도 봇</strong>
          </div>
          <button class="close" type="button" aria-label="챗봇 닫기">${CLOSE_ICON}</button>
        </header>
        <div class="body">
          ${this.view.loadFailed ? '<div class="error">잠시 후 다시 시도해주세요.</div>' : ''}
          ${turns.map((turn, index) => this.renderTurn(turn, this.shouldAnimateTurn(turns, index))).join('')}
        </div>
      </section>
    `;

    this.root.querySelector('.close')?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('godo-panel-close', { bubbles: true, composed: true }));
    });
    if (!this.listenersBound) {
      this.root.addEventListener('godo-chip-click', this.handleChipClick);
      this.root.addEventListener('keydown', this.handleKeydown);
      this.listenersBound = true;
    }
  }

  private handleChipClick = (event: Event) => {
    const custom = event as CustomEvent<{ chipId: string | null }>;
    const chipId = custom.detail.chipId;
    if (!chipId) return;

    this.dispatchEvent(
      new CustomEvent('godo-panel-chip', {
        bubbles: true,
        composed: true,
        detail: { chipId },
      }),
    );
  };

  private renderTurn(turn: PanelTurn, animate: boolean): string {
    const className = `turn${animate ? ' is-new' : ''}`;
    if (turn.type === 'greeting') return `<div class="${className}">${this.renderGreeting()}</div>`;
    if (turn.type === 'picked') {
      return `<div class="${className}"><godo-bubble from="user" text="${attr(turn.chip.label)}"></godo-bubble></div>`;
    }
    if (turn.type === 'typing') return `<div class="${className}">${this.renderTyping()}</div>`;
    return `<div class="${className}">${this.renderAnswerTurn(turn.chip)}</div>`;
  }

  private shouldAnimateTurn(turns: PanelTurn[], index: number): boolean {
    const last = turns[turns.length - 1];
    if (last?.type === 'typing') return index >= turns.length - 2;
    return index === turns.length - 1 && turns.length > 1;
  }

  private renderGreeting(): string {
    return `
      <div class="announce"><span>${MEGAPHONE_ICON}</span>학부모님의 입시 고민, 가장 빠르고 정확하게 안내드릴게요.</div>
      <h2>미대입시 합격신화, 강남고도 <span>⭐</span></h2>
      <p class="welcome">궁금한 항목을<br>눌러주세요.</p>
      <div class="chips">${this.view.faqChips.map((chip) => renderChip(chip, 'faq')).join('')}</div>
      ${renderBotSig()}
    `;
  }

  private renderAnswerTurn(chip: Chip): string {
    return `
      <article class="answer">${markdownToSafeHtml(chip.answer)}</article>
      ${renderBotSig()}
      <div class="chips follow">
        <godo-chip chip-id="__return" kind="ghost" label="↩️ 처음으로"></godo-chip>
        ${this.view.callChip ? renderChip(this.view.callChip, 'primary', '📞 상담 전화 연결') : ''}
        ${this.view.consultChip ? renderChip(this.view.consultChip, 'primary', '📅 방문 상담 예약', '예약 마감 전') : ''}
      </div>
    `;
  }

  private renderTyping(): string {
    return `
      <div class="typing" aria-label="고도 봇이 답변을 준비 중입니다">
        <span class="typing-avatar">${ROBOT_ICON}</span>
        <span class="typing-loader" aria-hidden="true"><span></span></span>
      </div>
    `;
  }

  private scrollToEnd(animated: boolean) {
    const body = this.root.querySelector<HTMLElement>('.body');
    if (!body) return;

    const targetTop = body.scrollHeight - body.clientHeight;
    if (!animated) {
      body.scrollTop = targetTop;
      return;
    }

    this.animateScroll(body, targetTop, 760);
  }

  private animateScroll(body: HTMLElement, targetTop: number, duration: number) {
    if (this.scrollFrame !== null) window.cancelAnimationFrame(this.scrollFrame);

    const startTop = body.scrollTop;
    const distance = targetTop - startTop;
    if (Math.abs(distance) < 1) return;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      body.scrollTop = startTop + distance * eased;

      if (elapsed < 1) {
        this.scrollFrame = window.requestAnimationFrame(step);
      } else {
        this.scrollFrame = null;
      }
    };

    this.scrollFrame = window.requestAnimationFrame(step);
  }

  private handleKeydown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key !== 'Tab') return;

    const focusable = Array.from(this.root.querySelectorAll<HTMLElement>('button, godo-chip'));
    if (!focusable.length) return;

    const active = this.root.activeElement as HTMLElement | null;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (keyboardEvent.shiftKey && active === first) {
      keyboardEvent.preventDefault();
      last.focus();
    } else if (!keyboardEvent.shiftKey && active === last) {
      keyboardEvent.preventDefault();
      first.focus();
    }
  };
}

function renderChip(chip: Chip, kind: string, label = chip.label, badge?: string): string {
  const badgeAttr = badge ? ` badge="${attr(badge)}"` : '';
  return `<godo-chip chip-id="${attr(chip.chip_id)}" kind="${kind}" label="${attr(label)}"${badgeAttr}></godo-chip>`;
}

function renderBotSig(): string {
  return `<div class="bot-sig"><span>${ROBOT_ICON}</span>고도 봇(bot)</div>`;
}

function attr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const styles = `
.panel { width: 100%; height: 100%; border-radius: inherit; overflow: hidden; background: ${BRAND.surface}; display: flex; flex-direction: column; }
.head { height: 60px; flex: 0 0 auto; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; border-bottom: 1px solid ${BRAND.bubbleBorder}; background: #fff; }
.head-left { display: flex; align-items: center; gap: 10px; }
.head strong { color: ${BRAND.ink}; font-size: 16px; font-weight: 700; letter-spacing: -0.025em; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: ${BRAND.primary}; color: #fff; display: inline-flex; align-items: center; justify-content: center; }
.close { width: 36px; height: 36px; border: 0; border-radius: 8px; background: transparent; color: ${BRAND.inkSoft}; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; }
.close:hover { background: ${BRAND.surfaceTint}; }
.close:focus-visible { outline: 3px solid ${BRAND.primarySoft}; }
.body { flex: 1; overflow-y: auto; padding: 18px 22px 32px; background: #fff; display: flex; flex-direction: column; }
.turn.is-new { animation: turnIn 180ms ease-out both; }
.error { margin-bottom: 14px; border-radius: 10px; background: ${BRAND.primarySofter}; color: ${BRAND.inkSoft}; font-size: 12.5px; line-height: 1.5; padding: 10px 12px; }
.announce { display: flex; align-items: center; gap: 10px; background: #f4f5f7; border-radius: 14px; color: ${BRAND.inkSoft}; font-size: 14px; letter-spacing: -0.025em; line-height: 1.45; margin-bottom: 28px; padding: 13px 16px; word-break: keep-all; }
.announce span { color: ${BRAND.inkMuted}; display: inline-flex; flex-shrink: 0; }
h2 { color: ${BRAND.ink}; display: flex; flex-wrap: wrap; align-items: center; gap: 6px; font-size: 22px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.35; margin: 0 0 16px; word-break: keep-all; }
h2 span { color: ${BRAND.accentDeep}; }
.welcome { color: ${BRAND.ink}; font-size: 15.5px; letter-spacing: -0.025em; line-height: 1.6; margin: 0 0 18px; word-break: keep-all; }
.chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: flex-end; margin-left: auto; max-width: 86%; }
.chips.follow { align-items: flex-end; flex-direction: column; margin: 0 0 18px auto; }
.bot-sig { display: inline-flex; align-items: center; gap: 7px; color: ${BRAND.inkMuted}; font-size: 13px; letter-spacing: -0.02em; margin: 12px 0 24px; }
.bot-sig span { width: 20px; height: 20px; border-radius: 50%; background: ${BRAND.primary}; color: ${BRAND.accent}; display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.bot-sig svg { width: 11px; height: 11px; }
.answer { color: ${BRAND.ink}; font-size: 15px; letter-spacing: -0.025em; line-height: 1.7; margin: 0; word-break: keep-all; }
.answer h4 { color: ${BRAND.accentDeep}; display: flex; align-items: center; gap: 8px; font-size: 19px; font-weight: 800; letter-spacing: -0.035em; line-height: 1.35; margin: 0 0 14px; }
.answer p { margin: 0 0 14px; }
.answer strong { color: ${BRAND.accentDeep}; font-weight: 700; }
.answer ul { list-style: none; margin: 4px 0 14px; padding-left: 0; }
.answer li { margin-bottom: 8px; padding-left: 20px; position: relative; }
.answer li::before { content: ''; position: absolute; left: 4px; top: 11px; width: 6px; height: 6px; border-radius: 50%; background: ${BRAND.ink}; }
.typing { align-items: center; display: inline-flex; gap: 8px; margin: 0 0 18px; }
.typing-avatar { width: 24px; height: 24px; border-radius: 50%; background: ${BRAND.primary}; color: ${BRAND.accent}; display: inline-flex; align-items: center; justify-content: center; flex: 0 0 auto; }
.typing-avatar svg { width: 14px; height: 14px; }
.typing-loader { align-items: center; background: ${BRAND.bubble}; border: 1px solid ${BRAND.bubbleBorder}; border-radius: 16px; display: inline-flex; height: 28px; justify-content: center; padding: 0 14px; }
.typing-loader span,
.typing-loader span::before,
.typing-loader span::after { width: 5px; height: 5px; border-radius: 50%; background: ${BRAND.inkMuted}; display: block; animation: typingPulse 3000ms ease-in-out infinite; }
.typing-loader span { position: relative; animation-delay: 500ms; }
.typing-loader span::before,
.typing-loader span::after { content: ''; position: absolute; top: 0; }
.typing-loader span::before { left: -9px; animation-delay: 0ms; }
.typing-loader span::after { left: 9px; animation-delay: 1000ms; }
@keyframes turnIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes typingPulse { 0%, 80%, 100% { opacity: 0.35; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
`;

if (!customElements.get('godo-panel')) {
  customElements.define('godo-panel', GodoPanelElement);
}
