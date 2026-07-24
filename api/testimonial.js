function escapeHtml(str) {
  return String(str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, role, email, testimonial, permission, 'bot-field': botField } = req.body || {};

  if (botField) {
    return res.status(200).json({ ok: true });
  }

  if (!name || !testimonial) {
    return res.status(400).json({ error: 'Name and testimonial are required' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.TESTIMONIAL_TO_EMAIL || 'lawrencejedgarcia225@gmail.com';

  if (!apiKey) {
    console.error('Missing RESEND_API_KEY environment variable');
    return res.status(500).json({ error: 'Server not configured' });
  }

  const html = `
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Role/Company:</strong> ${escapeHtml(role) || '—'}</p>
    <p><strong>Email:</strong> ${escapeHtml(email) || '—'}</p>
    <p><strong>Testimonial:</strong> ${escapeHtml(testimonial)}</p>
    <p><strong>OK to share publicly:</strong> ${escapeHtml(permission) || '—'}</p>
  `;

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Portfolio Testimonials <onboarding@resend.dev>',
      to: toEmail,
      reply_to: email || undefined,
      subject: `New testimonial from ${name}`,
      html
    })
  });

  if (!resendRes.ok) {
    console.error('Resend error:', await resendRes.text());
    return res.status(502).json({ error: 'Failed to send email' });
  }

  return res.status(200).json({ ok: true });
}
