import { toPng } from 'html-to-image';
import type { EmailConfig } from '../types/email';

function buildIterableHtml(templateEl: HTMLDivElement): string {
  const clone = templateEl.cloneNode(true) as HTMLDivElement;

  // Strip header — replace with actual footer HTML from Iterable
  clone.querySelector('[data-section="header"]')?.remove();

  // Replace footer with the real Aceable footer HTML
  const footerEl = clone.querySelector('[data-section="footer"]');
  if (footerEl) {
    footerEl.outerHTML = `<table class="row row-11" align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td><table class="row-content stack" align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;background-color:#f1f5f5;border-radius:0;color:#000;width:600px;margin:0 auto" width="600"><tbody><tr><td class="column column-1" width="100%" style="mso-table-lspace:0;mso-table-rspace:0;font-weight:400;text-align:left;padding-bottom:24px;padding-left:32px;padding-right:32px;padding-top:32px;vertical-align:top"><table class="heading_block block-1" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td class="pad" style="padding-bottom:10px;text-align:center;width:100%"><h1 style="margin:0;color:#43646f;direction:ltr;font-family:Lato,Tahoma,Verdana,Segoe,sans-serif;font-size:16px;font-weight:700;letter-spacing:normal;line-height:1.2;text-align:center;margin-top:0;margin-bottom:0;mso-line-height-alt:19px"><span class="tinyMce-placeholder" style="word-break: break-word;">Download the Aceable App:</span></h1></td></tr></tbody></table><table class="image_block block-2" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td class="pad" style="padding-bottom:15px;padding-top:15px;width:100%;padding-right:0;padding-left:0"><div class="alignment" align="center"><div style="max-width:161px"><a href="https://apps.apple.com/us/app/aceable-real-estate-insurance/id1183000995" target="_blank"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/6440a75dcccb48a896c67c06dbfdf9f7/apple%20badge.png" style="display:block;height:auto;border:0;width:100%" width="161" alt="Apple App Store" title="Apple App Store" height="auto"></a></div></div></td></tr></tbody></table><table class="image_block block-3" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td class="pad" style="padding-bottom:15px;padding-top:15px;width:100%;padding-right:0;padding-left:0"><div class="alignment" align="center"><div style="max-width:161px"><a href="https://play.google.com/store/apps/details?id=com.aceable.aceablere_android&hl=en_US" target="_blank"><img src="https://d15k2d11r6t6rl.cloudfront.net/public/users/Integrators/669d5713-9b6a-46bb-bd7e-c542cff6dd6a/6440a75dcccb48a896c67c06dbfdf9f7/google%20badge.png" style="display:block;height:auto;border:0;width:100%" width="161" alt="Google Play App Store" title="Google Play App Store" height="auto"></a></div></div></td></tr></tbody></table><table class="social_block block-4" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0"><tbody><tr><td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:35px;text-align:center"><div class="alignment" align="center"><table class="social-table" width="170px" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;display:inline-block"><tbody><tr><td style="padding:0 7px 0 0"><a href="https://www.facebook.com/AceableAgent/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/facebook@2x.png" width="32" height="auto" alt="Facebook" title="Facebook" style="display:block;height:auto;border:0"></a></td><td style="padding:0 7px 0 7px"><a href="https://x.com/aceableagent" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/twitter@2x.png" width="32" height="auto" alt="X" title="X" style="display:block;height:auto;border:0"></a></td><td style="padding:0 7px 0 7px"><a href="https://www.instagram.com/aceableagent/" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/instagram@2x.png" width="32" height="auto" alt="Instagram" title="Instagram" style="display:block;height:auto;border:0"></a></td><td style="padding:0 0 0 7px"><a href="https://www.youtube.com/channel/UC5JBaTSOw3cQY54xsW_Dclw" target="_blank"><img src="https://app-rsrc.getbee.io/public/resources/social-networks-icon-sets/circle-dark-gray/youtube@2x.png" width="32" height="auto" alt="YouTube" title="YouTube" style="display:block;height:auto;border:0"></a></td></tr></tbody></table></div></td></tr></tbody></table><table class="text_block block-5" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace:0;mso-table-rspace:0;word-break:break-word"><tbody><tr><td class="pad" style="padding-bottom:10px;padding-left:10px;padding-right:10px"><div style="font-family:sans-serif"><div class="" style="font-size:14px;font-family:Lato,Tahoma,Verdana,Segoe,sans-serif;mso-line-height-alt:16.8px;color:#21333f;line-height:1.2"><p style="margin:0;mso-line-height-alt:16.8px" align="center">&nbsp;</p><p style="margin:0;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px">&nbsp;&#169; {{now format='yyyy'}} Aceable, Inc.</p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px">TREC Provider #701048 | California Sponsor #S0654 | Illinois Provider #515.000001</p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;font-size:14px;text-align:center;mso-line-height-alt:16.8px"><a href="http://www.aceableagent.com/privacy-policy/" rel="noopener" target="_blank" style="text-decoration: underline; color: #43646f;">Privacy Policy</a>&nbsp; |&nbsp;&nbsp;<a href="http://www.aceableagent.com/terms-and-conditions/" rel="noopener" target="_blank" style="text-decoration: underline; color: #43646f;">Terms &amp; Conditions</a>&nbsp; | &nbsp;<a href="https://support.aceableagent.com/hc/en-us/requests/new" rel="noopener" target="_blank" style="text-decoration: underline; color: #43646f;">Contact Us</a>&nbsp; | &nbsp;<a href="{{viewInBrowserUrl}}" target="_blank" style="text-decoration: underline; color: #43646f;" rel="noopener">View in Browser</a></p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px"><strong>Note:&nbsp;</strong>Users in Arizona will not have ability to complete the real estate course via mobile app.&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">&nbsp;</p><p style="margin:0;text-align:center;mso-line-height-alt:16.8px">This is an advertisement or promotional email from Aceable.&nbsp;</p><p style="margin:0;mso-line-height-alt:16.8px">&nbsp;</p></div></div></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table>`;
  }

  // Replace hero tiles with a placeholder that the server swaps for the uploaded PNG URL
  const tileSection = clone.querySelector('[data-section="hero-tiles"]') as HTMLElement | null;
  if (tileSection) {
    tileSection.style.padding = '0';
    tileSection.innerHTML = '<img data-hero-src="HERO_IMAGE_PLACEHOLDER" width="600" style="display:block;width:100%" alt="" />';
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Lato:wght@200;400;700;900&family=Nunito+Sans:wght@400;600;800;900&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#f4f9fc;">
${clone.outerHTML}
</body>
</html>`;
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
