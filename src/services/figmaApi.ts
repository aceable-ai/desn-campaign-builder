import type { CampaignRecord } from './airtableApi';

const FIGMA_API = 'https://api.figma.com/v1';

// ─── URL parsing ──────────────────────────────────────────────────────────────

export function parseFigmaUrl(url: string): { fileKey: string; nodeId: string | null } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    const keyIndex = parts.findIndex((p) => p === 'design' || p === 'file');
    if (keyIndex === -1 || !parts[keyIndex + 1]) return null;
    const fileKey = parts[keyIndex + 1];
    const rawNodeId = u.searchParams.get('node-id');
    const nodeId = rawNodeId ? rawNodeId.replace(/-/g, ':') : null;
    return { fileKey, nodeId };
  } catch {
    return null;
  }
}

// ─── Figma node types ─────────────────────────────────────────────────────────

interface FigmaNode {
  id: string;
  name: string;
  type: string;
  characters?: string;
  children?: FigmaNode[];
}

// ─── Text extraction ──────────────────────────────────────────────────────────

function findText(node: FigmaNode, nameMatcher: (n: string) => boolean): string {
  if (node.type === 'TEXT' && nameMatcher(node.name) && node.characters) {
    return node.characters.trim();
  }
  for (const child of node.children ?? []) {
    const result = findText(child, nameMatcher);
    if (result) return result;
  }
  return '';
}

function findHeroImageNodeId(frame: FigmaNode): string | null {
  for (const child of frame.children ?? []) {
    if (child.type === 'FRAME' &&
        (child.name === 'Hero Image' || child.name === 'Illustration')) {
      return child.id;
    }
  }
  return null;
}

function parseVerticalFromSection(sectionName: string): CampaignRecord['vertical'] {
  const s = sectionName.toUpperCase();
  if (s.includes('INS')) return 'aceable-insurance';
  if (s.includes('MTG')) return 'aceable-mortgage';
  if (s.includes('RE')) return 'aceable-agent';
  return 'aceable';
}

// ─── Image export ─────────────────────────────────────────────────────────────

async function batchExportImages(
  fileKey: string,
  nodeIds: string[],
  apiToken: string,
): Promise<Record<string, string>> {
  if (nodeIds.length === 0) return {};
  const res = await fetch(
    `${FIGMA_API}/images/${fileKey}?ids=${nodeIds.join(',')}&format=png&scale=2`,
    { headers: { 'X-Figma-Token': apiToken } },
  );
  if (!res.ok) return {};
  const data = await res.json() as { images: Record<string, string> };
  return data.images ?? {};
}

async function imageUrlToDataUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function getEmailsFromFigma(
  figmaUrl: string,
  apiToken: string,
): Promise<CampaignRecord[]> {
  const parsed = parseFigmaUrl(figmaUrl);
  if (!parsed) throw new Error('Invalid Figma URL');

  const { fileKey, nodeId } = parsed;

  const ids = nodeId ?? '';
  const endpoint = ids
    ? `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`
    : `${FIGMA_API}/files/${fileKey}`;

  const res = await fetch(endpoint, { headers: { 'X-Figma-Token': apiToken } });
  if (!res.ok) throw new Error(`Figma API error: ${res.status} ${res.statusText}`);

  const data = await res.json() as Record<string, unknown>;

  let canvasChildren: FigmaNode[] = [];
  if (ids) {
    const nodes = data.nodes as Record<string, { document: FigmaNode }>;
    const root = Object.values(nodes)[0]?.document;
    canvasChildren = root?.children ?? [];
  } else {
    const pages = (data.document as FigmaNode).children ?? [];
    const emailPage = pages.find((p) => p.name.toLowerCase().includes('email')) ?? pages[0];
    canvasChildren = emailPage?.children ?? [];
  }

  // ── Pass 1: extract copy + collect image node IDs ─────────────────────────
  type Draft = { record: Omit<CampaignRecord, 'heroImageUrl'>; imageNodeId: string | null };
  const drafts: Draft[] = [];

  for (const section of canvasChildren) {
    if (section.type !== 'SECTION') continue;

    for (const frame of section.children ?? []) {
      if (frame.type !== 'FRAME') continue;
      if (!/email/i.test(frame.name)) continue;

      const eyebrow          = findText(frame, (n) => n === 'Eyebrow');
      const headline         = findText(frame, (n) => n === 'Headline');
      const body             = findText(frame, (n) => n === 'Body');
      const cta              = findText(frame, (n) => n === 'Button Text Goes Here');
      const banner           = findText(frame, (n) => /spring sale|sale/i.test(n));
      // One-Column section: secondary headline + body section text
      const secondaryHeadline = findText(frame, (n) => /punchy header/i.test(n));
      const bodySection       = findText(frame, (n) => /lorem ipsum/i.test(n));
      const bodySectionCta    = findText(frame, (n) => n === 'Button Text');

      if (!headline && !cta) continue;

      drafts.push({
        record: {
          airtableId:   `figma_${fileKey}_${frame.id}`,
          campaignName: `${section.name} — ${frame.name}`,
          seriesOrder:  parseInt(frame.name.replace(/\D/g, '') || '0', 10),
          vertical:     parseVerticalFromSection(section.name),
          status:       'Figma',
          subjectLine:  banner,
          previewText:  eyebrow,
          headline,
          bodyCopy:     body,
          ctaCopy:      cta,
          secondaryHeadline: secondaryHeadline || undefined,
          bodySection:       bodySection || undefined,
          bodySectionCta:    bodySectionCta || undefined,
        },
        imageNodeId: findHeroImageNodeId(frame),
      });
    }
  }

  if (drafts.length === 0) {
    throw new Error('No email frames found. Make sure the link points to a canvas with email sections.');
  }

  // ── Pass 2: batch export image URLs from Figma ────────────────────────────
  const imageNodeIds = drafts
    .map((d) => d.imageNodeId)
    .filter((id): id is string => id !== null);

  const exportedUrls = await batchExportImages(fileKey, imageNodeIds, apiToken);

  // Convert S3 URLs to base64 in parallel (avoids CORS issues on PNG export)
  const base64Map: Record<string, string> = {};
  await Promise.all(
    Object.entries(exportedUrls).map(async ([nid, url]) => {
      if (url) base64Map[nid] = await imageUrlToDataUrl(url);
    }),
  );

  // ── Pass 3: merge images into final records ───────────────────────────────
  return drafts.map(({ record, imageNodeId }) => ({
    ...record,
    heroImageUrl: imageNodeId ? base64Map[imageNodeId] : undefined,
  }));
}
