import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { writeFileSync, mkdirSync } from 'fs';
import { randomUUID } from 'crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = '/tmp/campaign-builder-uploads';

try { mkdirSync(UPLOADS_DIR, { recursive: true }); } catch {}

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

// Serve saved hero images
app.use('/uploads', express.static(UPLOADS_DIR));

app.post('/api/push-to-iterable', async (req, res) => {
  const { heroImageBase64, htmlBody, vertical } = req.body;
  const apiKey = process.env.ITERABLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ITERABLE_API_KEY not configured' });
  }

  try {
    // Save hero PNG to Railway filesystem and build a public URL for it
    const today = new Date().toISOString().slice(0, 10);
    const filename = `hero-${vertical}-${today}-${randomUUID()}.png`;
    writeFileSync(path.join(UPLOADS_DIR, filename), Buffer.from(heroImageBase64, 'base64'));

    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const imageUrl = `${protocol}://${req.headers.host}/uploads/${filename}`;

    // Inject the image URL into the HTML and create the Iterable template
    const finalHtml = htmlBody.replace('HERO_IMAGE_PLACEHOLDER', imageUrl);
    const templateName = `[Campaign Builder] ${vertical} ${today}`;

    const tmplRes = await fetch('https://api.iterable.com/api/templates/email/upsert', {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: templateName, htmlBody: finalHtml, clientTemplateId: filename, subject: '[Subject]' }),
    });

    if (!tmplRes.ok) {
      throw new Error(`Template creation failed: ${await tmplRes.text()}`);
    }

    const tmplData = await tmplRes.json();
    console.log('Iterable template response:', JSON.stringify(tmplData));
    console.log('htmlBody length:', finalHtml.length);

    const templateId = tmplData.templateId ?? tmplData.id ?? tmplData.template?.id;
    res.json({ templateId, templateName });
  } catch (err) {
    console.error('Push to Iterable error:', err);
    res.status(500).json({ error: String(err) });
  }
});

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
