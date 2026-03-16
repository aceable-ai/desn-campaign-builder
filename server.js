import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/api/push-to-iterable', async (req, res) => {
  const { heroImageBase64, htmlBody, vertical } = req.body;
  const apiKey = process.env.ITERABLE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'ITERABLE_API_KEY not configured' });
  }

  try {
    // 1. Upload hero PNG to Iterable media library
    const imageBuffer = Buffer.from(heroImageBase64, 'base64');
    const blob = new Blob([imageBuffer], { type: 'image/png' });
    const today = new Date().toISOString().slice(0, 10);
    const filename = `hero-tiles-${vertical}-${today}.png`;

    const fd = new FormData();
    fd.append('image', blob, filename);

    const uploadRes = await fetch('https://api.iterable.com/api/images/upload', {
      method: 'POST',
      headers: { 'Api-Key': apiKey },
      body: fd,
    });

    if (!uploadRes.ok) {
      throw new Error(`Image upload failed: ${await uploadRes.text()}`);
    }

    const { url: imageUrl } = await uploadRes.json();

    // 2. Inject uploaded image URL into the HTML
    const finalHtml = htmlBody.replace('HERO_IMAGE_PLACEHOLDER', imageUrl);

    // 3. Create new template in Iterable
    const templateName = `[Campaign Builder] ${vertical} ${today}`;

    const tmplRes = await fetch('https://api.iterable.com/api/templates/email/upsert', {
      method: 'POST',
      headers: { 'Api-Key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: templateName, htmlBody: finalHtml }),
    });

    if (!tmplRes.ok) {
      throw new Error(`Template creation failed: ${await tmplRes.text()}`);
    }

    const { templateId } = await tmplRes.json();
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
