import { mkdir, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import nodemailer from 'nodemailer';

export function createMailer(config) {
  const transport = config.smtp ? nodemailer.createTransport(config.smtp) : null;
  return async ({ to, code, purpose }) => {
    const subject = purpose === 'register' ? 'Verify your DPA portal account' : 'Reset your DPA portal password';
    const text = `Your verification code is ${code}. It expires in 10 minutes. If you did not request this, ignore it.`;
    if (transport) { await transport.sendMail({ from: config.mailFrom, to, subject, text }); return; }
    if (config.production) throw new Error('Email delivery is not configured.');
    const directory = new URL('../.mail/', import.meta.url);
    await mkdir(directory, { recursive: true });
    await writeFile(new URL(`${Date.now()}-${randomUUID()}.json`, directory), JSON.stringify({ to, subject, text, code, createdAt: new Date() }, null, 2), { mode: 0o600 });
    console.log('Development verification email saved to server/.mail (SMTP is not configured).');
  };
}
