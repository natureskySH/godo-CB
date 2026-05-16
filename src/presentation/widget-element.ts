import { handleChipAction } from '../business/action-handler';
import { ChipRouter } from '../business/chip-router';
import { StateMachine } from '../business/state-machine';
import type { Chip } from '../data/types';
import { CALENDAR_ICON, CLOSE_ICON, PHONE_ICON, ROBOT_ICON } from './icons';
import type { GodoPanelElement, PanelTurn } from './panel-element';
import { FONT_CSS } from './styles/tokens.css';
import { WIDGET_STYLES } from './styles/widget.css';

const ANSWER_DELAY_MS = 2200;

export class GodoWidgetElement extends HTMLElement {
  private root = this.attachShadow({ mode: 'open' });
  private router = new ChipRouter();
  private state = new StateMachine();
  private loading: Promise<void> | null = null;
  private faqChips: Chip[] = [];
  private consultChip: Chip | null = null;
  private callChip: Chip | null = null;
  private turns: PanelTurn[] = [{ type: 'greeting' }];
  private notificationOpen = true;
  private pendingAnswerTimer: number | null = null;

  connectedCallback() {
    this.render();
    this.loading = this.loadChips();
    document.addEventListener('keydown', this.handleKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this.handleKeydown);
    this.clearPendingAnswer();
  }

  private async loadChips() {
    await this.router.load();
    this.faqChips = this.router.getFaqChips();
    this.consultChip = this.router.getChip('consult');
    this.callChip = this.router.getChip('call');
    this.refreshOpenPanel();
  }

  private render() {
    const isOpen = this.state.state !== 'S0';
    this.toggleAttribute('data-open', isOpen);
    this.syncHostLayout(isOpen);
    this.root.innerHTML = `
      <style>${FONT_CSS}${WIDGET_STYLES}</style>
      ${!isOpen && this.notificationOpen ? this.renderNotification() : ''}
      ${!isOpen ? this.renderTrigger() : ''}
      ${isOpen ? '<div class="panel-wrap"><godo-panel></godo-panel></div>' : ''}
    `;

    this.root.querySelector('.chat')?.addEventListener('click', () => this.openPanel());
    this.root.querySelector('.consult')?.addEventListener('click', () => this.runAction('consult'));
    this.root.querySelector('.phone')?.addEventListener('click', () => this.runAction('call'));
    this.root.querySelector('.nb-row')?.addEventListener('click', () => this.openPanel());
    this.root.querySelector('.nb-close')?.addEventListener('click', (event) => {
      event.stopPropagation();
      this.notificationOpen = false;
      this.render();
    });

    const panel = this.root.querySelector<GodoPanelElement>('godo-panel');
    if (panel) {
      panel.setView({
        faqChips: this.faqChips,
        consultChip: this.consultChip,
        callChip: this.callChip,
        turns: this.turns,
        loadFailed: this.router.usedFallback,
      });
      panel.addEventListener('godo-panel-close', () => this.closePanel());
      panel.addEventListener('godo-panel-chip', this.handlePanelChip);
      requestAnimationFrame(() => panel.focusFirst());
    }
  }

  private renderTrigger(): string {
    return `
      <div class="trigger" aria-label="고도 챗봇 빠른 메뉴">
        <button class="trigger-item chat accent" type="button" aria-label="챗봇 열기">
          <span class="trigger-icon">${ROBOT_ICON}</span><span class="trigger-label">챗봇</span>
        </button>
        <button class="trigger-item consult" type="button" aria-label="상담 예약">
          <span class="trigger-icon">${CALENDAR_ICON}</span><span class="trigger-label">상담<br>예약</span>
        </button>
        <span class="divider"></span>
        <button class="trigger-item phone" type="button" aria-label="전화 연결">
          <span class="trigger-icon">${PHONE_ICON}</span>
        </button>
      </div>
    `;
  }

  private renderNotification(): string {
    return `
      <div class="notification" role="status">
        <button class="nb-close" type="button" aria-label="알림 닫기">${CLOSE_ICON}</button>
        <div class="nb-row">
          <span class="nb-avatar">${ROBOT_ICON}</span>
          <span class="nb-content">
            <span class="nb-msg"><strong>미대입시</strong> 궁금하신가요?</span>
            <span class="nb-live"><span></span>상담 예약 진행 중</span>
          </span>
        </div>
        <span class="nb-tail"></span>
      </div>
    `;
  }

  private openPanel() {
    this.notificationOpen = false;
    this.state.transition({ type: 'CLICK_CHATBOT_COMPONENT' });
    this.render();
  }

  private syncHostLayout(isOpen: boolean) {
    const mobile = window.matchMedia('(max-width: 767px)').matches;
    if (isOpen && mobile) {
      this.style.inset = '0 auto auto 0';
      this.style.width = '100vw';
      this.style.height = '100vh';
      this.style.right = 'auto';
      this.style.bottom = 'auto';
      return;
    }

    this.style.removeProperty('inset');
    this.style.removeProperty('width');
    this.style.removeProperty('height');
    this.style.removeProperty('right');
    this.style.removeProperty('bottom');
  }

  private closePanel() {
    this.clearPendingAnswer();
    this.state.transition({ type: 'CLOSE_PANEL' });
    this.render();
  }

  private async runAction(chipId: string) {
    if (this.loading) await this.loading;
    const route = this.router.route(chipId);
    if (route.type === 'action') handleChipAction(route.action);
  }

  private handlePanelChip = async (event: Event) => {
    const chipId = (event as CustomEvent<{ chipId: string }>).detail.chipId;
    if (chipId === '__return') {
      this.turns = [...this.turns, { type: 'greeting' }];
      this.state.transition({ type: 'CLICK_RETURN' });
      this.refreshOpenPanel();
      return;
    }

    if (this.loading) await this.loading;
    const route = this.router.route(chipId);
    if (route.type === 'answer') {
      this.showTypingThenAnswer(route.chip);
      this.state.transition({ type: 'CLICK_CHIP', chipId });
    }
    if (route.type === 'action') handleChipAction(route.action);
  };

  private showTypingThenAnswer(chip: Chip) {
    if (this.pendingAnswerTimer !== null) return;

    this.turns = [
      ...this.turns,
      { type: 'picked', chip },
      { type: 'typing', chipId: chip.chip_id },
    ];
    this.refreshOpenPanel();

    this.pendingAnswerTimer = window.setTimeout(() => {
      this.pendingAnswerTimer = null;
      this.turns = this.turns.map((turn) =>
        turn.type === 'typing' && turn.chipId === chip.chip_id ? { type: 'answer', chip } : turn,
      );
      this.refreshOpenPanel();
    }, ANSWER_DELAY_MS);
  }

  private clearPendingAnswer() {
    if (this.pendingAnswerTimer === null) return;
    window.clearTimeout(this.pendingAnswerTimer);
    this.pendingAnswerTimer = null;
  }

  private refreshOpenPanel() {
    const panel = this.root.querySelector<GodoPanelElement>('godo-panel');
    if (!panel) {
      this.render();
      return;
    }

    panel.setView({
      faqChips: this.faqChips,
      consultChip: this.consultChip,
      callChip: this.callChip,
      turns: this.turns,
      loadFailed: this.router.usedFallback,
    });
  }

  private handleKeydown = (event: KeyboardEvent) => {
    if (this.state.state === 'S0') return;
    if (event.key === 'Escape') {
      event.preventDefault();
      this.closePanel();
    }
    if (event.key === 'Tab') this.trapFocus(event);
  };

  private trapFocus(event: KeyboardEvent) {
    const panelRoot = this.root.querySelector<GodoPanelElement>('godo-panel')?.shadowRoot;
    if (!panelRoot) return;
    const focusable = Array.from(panelRoot.querySelectorAll<HTMLElement>('button, godo-chip'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

if (!customElements.get('godo-widget')) {
  customElements.define('godo-widget', GodoWidgetElement);
}
