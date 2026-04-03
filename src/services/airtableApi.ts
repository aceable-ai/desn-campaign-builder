const AIRTABLE_BASE_URL = 'https://api.airtable.com/v0';
const BASE_ID = 'appcEdGGPPfJNZYPG';
const TABLE_NAME = 'Assets';

export interface CampaignRecord {
  airtableId: string;
  campaignName: string;
  subjectLine: string;
  previewText: string;
  headline: string;
  bodyCopy: string;
  ctaCopy: string;
  seriesOrder: number;
  vertical: 'aceable' | 'aceable-agent' | 'aceable-insurance' | 'aceable-mortgage';
  status: string;
  heroImageUrl?: string;
  secondaryHeadline?: string;
  bodySection?: string;
  bodySectionCta?: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
}

interface AirtableResponse {
  records: AirtableRecord[];
}

function field(fields: Record<string, unknown>, key: string): string {
  const val = fields[key];
  return typeof val === 'string' ? val.trim() : '';
}

function parseCopy(copy: string): Pick<CampaignRecord, 'subjectLine' | 'previewText' | 'headline' | 'bodyCopy' | 'ctaCopy'> {
  const extract = (label: string) => {
    const pattern = new RegExp(`${label}\\s*:\\s*(.*?)(?:\\s*\\||$)`, 's');
    return copy.match(pattern)?.[1]?.trim() ?? '';
  };
  return {
    subjectLine: extract('Subject Line'),
    previewText: extract('Preview Text'),
    headline:    extract('Headline'),
    bodyCopy:    extract('Body Copy'),
    ctaCopy:     extract('CTA'),
  };
}

function parseVertical(campaignId: string): CampaignRecord['vertical'] {
  const id = campaignId.toUpperCase();
  if (id.includes('RE')) return 'aceable-agent';
  if (id.includes('INS')) return 'aceable-insurance';
  if (id.includes('MTG')) return 'aceable-mortgage';
  return 'aceable';
}

export async function getCampaignRecords(
  apiKey: string,
  statusFilter = 'Ready',
): Promise<CampaignRecord[]> {
  const params = new URLSearchParams();
  params.set('filterByFormula', `AND({Channel} = 'Email', {Status} = '${statusFilter}')`);
  params.set('sort[0][field]', 'Asset Set');
  params.set('sort[0][direction]', 'asc');

  const url = `${AIRTABLE_BASE_URL}/${BASE_ID}/${encodeURIComponent(TABLE_NAME)}?${params}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as AirtableResponse;

  return data.records.map((record) => {
    const assetSet = typeof record.fields['Asset Set'] === 'number' ? record.fields['Asset Set'] : 0;
    const campaignId = field(record.fields, 'campaign_id');
    const copy = field(record.fields, 'Copy');
    const status = field(record.fields, 'Status');
    return {
      airtableId: record.id,
      campaignName: `${campaignId} — Email ${assetSet}`,
      seriesOrder: assetSet,
      vertical: parseVertical(campaignId),
      status,
      ...parseCopy(copy),
    };
  });
}
