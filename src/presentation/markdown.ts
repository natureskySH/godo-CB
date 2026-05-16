const HTML_ESCAPE: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function markdownToSafeHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      if (inList) {
        html.push('</ul>');
        inList = false;
      }
      continue;
    }

    if (line.startsWith('- ')) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${formatInline(line.slice(2))}</li>`);
      continue;
    }

    if (inList) {
      html.push('</ul>');
      inList = false;
    }

    if (line.startsWith('## ')) {
      html.push(`<h4>${formatInline(line.slice(3))}</h4>`);
    } else {
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

function formatInline(value: string): string {
  const escaped = value.replace(/[&<>"']/g, (char) => HTML_ESCAPE[char] ?? char);
  return escaped.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}
