import { BRAND, FONT_CSS } from './styles/tokens.css';

export class GodoBubbleElement extends HTMLElement {
  static observedAttributes = ['from', 'text'];

  private root = this.attachShadow({ mode: 'open' });

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  private render() {
    const from = this.getAttribute('from') ?? 'user';
    const text = this.getAttribute('text') ?? '';

    this.root.innerHTML = `
      <style>${FONT_CSS}${styles}</style>
      <div class="row" data-from="${from}">
        <div class="bubble"><slot>${escapeHtml(text)}</slot></div>
      </div>
    `;
  }
}

function escapeHtml(value: string): string {
  const span = document.createElement('span');
  span.textContent = value;
  return span.innerHTML;
}

const styles = `
.row {
  display: flex;
  margin: 6px 0 18px;
}
.row[data-from='user'] { justify-content: flex-end; }
.bubble {
  background: #f1f3f5;
  border-radius: 18px 18px 4px 18px;
  color: ${BRAND.ink};
  font-size: 14.5px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.4;
  max-width: 78%;
  padding: 11px 16px;
  word-break: keep-all;
}
`;

if (!customElements.get('godo-bubble')) {
  customElements.define('godo-bubble', GodoBubbleElement);
}
