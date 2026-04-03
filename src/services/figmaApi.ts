import type { CampaignRecord } from './airtableApi';

const FIGMA_API = 'https://api.figma.com/v1';

// ─── URL parsing ──────────────────────────────────────────────────────────────

export function parseFigmaUrl(url: string): { fileKey: string; nodeId: string | null } | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/');
    // /design/{fileKey}/... or /file/{fileKey}/...
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

// ─── Text extraction helpers ──────────────────────────────────────────────────

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

function parseVerticalFromSection(sectionName: string): CampaignRecord['vertical'] {
  const s = sectionName.toUpperCase();
  if (s.includes('INS')) return 'aceable-insurance';
  if (s.includes('MTG')) return 'aceable-mortgage';
  if (s.includes('RE')) return 'aceable-agent';
  return 'aceable';
}

function extractEmailRecord(
  frame: FigmaNode,
  sectionName: string,
  fileKey: string,
): CampaignRecord {
  // Eyebrow: layer named exactly "Eyebrow" (not "Eyebrow Text" which is the placeholder label)
  const eyebrow = findText(frame, (n) => n === 'Eyebrow');

  // Headline: layer named "Headline"
  const headline = findText(frame, (n) => n === 'Headline');

  // Body: layer named "Body"
  const body = findText(frame, (n) => n === 'Body');

  // CTA: first "Button Text Goes Here" layer (the hero button)
  const cta = findText(frame, (n) => n === 'Button Text Goes Here');

  // Banner: the shared banner text layer
  const banner = findText(frame, (n) => n.toLowerCase().includes('spring sale') || n.toLowerCase().includes('sale'));

  return {
    airtableId: `figma_${fileKey}_${frame.id}`,
    campaignName: `${sectionName} — ${frame.name}`,
    seriesOrder: parseInt(frame.name.replace(/\D/g, '') || '0', 10),
    vertical: parseVerticalFromSection(sectionName),
    status: 'Figma',
    subjectLine: banner,
    previewText: eyebrow,
    headline,
    bodyCopy: body,
    ctaCopy: cta,
  };
}

// ─── Main export function ─────────────────────────────────────────────────────

export async function getEmailsFromFigma(
  figmaUrl: string,
  apiToken: string,
): Promise<CampaignRecord[]> {
  const parsed = parseFigmaUrl(figmaUrl);
  if (!parsed) throw new Error('Invalid Figma URL');

  const { fileKey, nodeId } = parsed;

  // Fetch the canvas node (or specific node if provided)
  const ids = nodeId ?? '';
  const endpoint = ids
    ? `${FIGMA_API}/files/${fileKey}/nodes?ids=${encodeURIComponent(ids)}`
    : `${FIGMA_API}/files/${fileKey}`;

  const res = await fetch(endpoint, {
    headers: { 'X-Figma-Token': apiToken },
  });

  if (!res.ok) {
    throw new Error(`Figma API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json() as Record<string, unknown>;

  // Get the canvas children
  let canvasChildren: FigmaNode[] = [];

  if (ids) {
    const nodes = data.nodes as Record<string, { document: FigmaNode }>;
    const root = Object.values(nodes)[0]?.document;
    canvasChildren = root?.children ?? [];
  } else {
    const pages = (data.document as FigmaNode).children ?? [];
    // Find the "Email" canvas page
    const emailPage = pages.find((p) => p.name.toLowerCase().includes('email')) ?? pages[0];
    canvasChildren = emailPage?.children ?? [];
  }

  const records: CampaignRecord[] = [];

  for (const section of canvasChildren) {
    // Only process SECTION nodes that look like email verticals
    if (section.type !== 'SECTION') continue;
    const sectionName = section.name;

    for (const frame of section.children ?? []) {
      if (frame.type !== 'FRAME') continue;
      // Only process frames named "Email XX"
      if (!/email/i.test(frame.name)) continue;

      const record = extractEmailRecord(frame, sectionName, fileKey);
      // Only add if we got at least a headline or CTA
      if (record.headline || record.ctaCopy) {
        records.push(record);
      }
    }
  }

  if (records.length === 0) {
    throw new Error('No email frames found. Make sure the link points to a canvas with email sections.');
  }

  return records;
}
