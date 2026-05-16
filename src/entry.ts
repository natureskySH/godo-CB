import './presentation/bubble-element';
import './presentation/chip-element';
import './presentation/panel-element';
import './presentation/widget-element';
import { WIDGET_TAG_NAME } from './config';

function mount() {
  if (document.querySelector(WIDGET_TAG_NAME)) return;

  const widget = document.createElement(WIDGET_TAG_NAME);
  document.body.appendChild(widget);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount, { once: true });
} else {
  mount();
}
