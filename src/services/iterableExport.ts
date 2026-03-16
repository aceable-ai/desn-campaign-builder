import { toPng } from 'html-to-image';
import type { EmailConfig } from '../types/email';

function buildIterableHtml(templateEl: HTMLDivElement): string {
  const clone = templateEl.cloneNode(true) as HTMLDivElement;

  // Strip header and footer — handled by Iterable snippets
  clone.querySelector('[data-section="header"]')?.remove();
  clone.querySelector('[data-section="footer"]')?.remove();

  // Replace hero tiles with a placeholder that the server swaps for the uploaded PNG URL
  const tileSection = clone.querySelector('[data-section="hero-tiles"]') as HTMLElement | null;
  if (tileSection) {
    tileSection.style.padding = '0';
    tileSection.innerHTML = '<img src="HERO_IMAGE_PLACEHOLDER" width="600" style="display:block;width:100%" alt="" />';
  }

  return clone.outerHTML;
}

export async function pushToIterable(
  tileEl: HTMLDivElement,
  templateEl: HTMLDivElement,
  config: EmailConfig,
): Promise<{ templateId: number; templateName: string }> {
  const dataUrl = await toPng(tileEl, {
    style: { transform: 'none', backgroundColor: 'transparent' },
    backgroundColor: undefined,
    cacheBust: true,
  });

  const heroImageBase64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  const htmlBody = buildIterableHtml(templateEl);

  const res = await fetch('/api/push-to-iterable', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ heroImageBase64, htmlBody, vertical: config.vertical }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || 'Push to Iterable failed');
  }

  return res.json();
}
