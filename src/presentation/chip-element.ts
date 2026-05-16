import { BRAND, FONT_CSS } from './styles/tokens.css';

export class GodoChipElement extends HTMLElement {
  static observedAttributes = ['chip-id', 'label', 'kind', 'badge'];

  private root = this.attachShadow({ mode: 'open', delegatesFocus: true });

  focus(options?: FocusOptions) {
    this.root.querySelector<HTMLButtonElement>('button')?.focus(options);
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const label = this.getAttribute('label') ?? '';
    const kind = this.getAttribute('kind') ?? 'faq';
    const badge = this.getAttribute('badge');

    this.root.innerHTML = `
      <style>${FONT_CSS}${styles}</style>
      <button class="chip" type="button">
        <span class="label"></span>
        ${
          badge
            ? '<span class="badge"><span class="badge-dot"></span><span class="badge-label"></span></span>'
            : ''
        }
      </button>
    `;

    const button = this.root.querySelector<HTMLButtonElement>('button');
    if (!button) return;

    button.dataset.kind = kind;
    button.setAttribute('aria-label', label);
    const labelNode = button.querySelector<HTMLElement>('.label');
    if (labelNode) labelNode.textContent = label;
    const badgeNode = button.querySelector<HTMLElement>('.badge-label');
    if (badgeNode && badge) badgeNode.textContent = badge;

    button.addEventListener('click', () => {
      this.dispatchEvent(
        new CustomEvent('godo-chip-click', {
          bubbles: true,
          composed: true,
          detail: { chipId: this.getAttribute('chip-id') },
        }),
      );
    });
  }
}

const styles = `
.chip {
  border: 0;
  border-radius: 999px;
  background: ${BRAND.accentSoft};
  color: ${BRAND.accentDeep};
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.2;
  padding: 9px 15px;
  transition: background 140ms ease, transform 120ms ease;
}
.chip:hover { background: rgba(91, 200, 229, 0.24); }
.chip:active { transform: scale(0.97); }
.chip:focus-visible { outline: 3px solid ${BRAND.primarySoft}; outline-offset: 2px; }
.chip[data-kind='primary'] { background: ${BRAND.primary}; color: #fff; }
.chip[data-kind='primary']:hover { background: ${BRAND.primaryDark}; }
.chip[data-kind='ghost'] {
  background: transparent;
  border: 1px solid ${BRAND.bubbleBorder};
  color: ${BRAND.inkSoft};
}
.chip[data-kind='ghost']:hover { background: ${BRAND.surfaceTint}; }
.badge {
  align-items: center;
  animation: badgePulse 1.8s ease-in-out infinite;
  background: linear-gradient(135deg, #ff5c46 0%, #ff7a2b 100%);
  border-radius: 999px;
  box-shadow: 0 3px 8px -2px rgba(255, 92, 70, 0.45);
  color: #fff;
  display: inline-flex;
  font-size: 10.5px;
  font-weight: 800;
  gap: 3px;
  letter-spacing: 0.01em;
  line-height: 1.1;
  margin-left: 4px;
  padding: 3px 8px 3px 7px;
}
.badge-dot { width: 5px; height: 5px; border-radius: 50%; background: #fff; }
@keyframes badgePulse {
  0%, 100% { transform: scale(1); box-shadow: 0 3px 8px -2px rgba(255, 92, 70, 0.45), 0 0 0 0 rgba(255, 92, 70, 0.55); }
  50% { transform: scale(1.08); box-shadow: 0 3px 8px -2px rgba(255, 92, 70, 0.45), 0 0 0 8px rgba(255, 92, 70, 0); }
}
`;

if (!customElements.get('godo-chip')) {
  customElements.define('godo-chip', GodoChipElement);
}
