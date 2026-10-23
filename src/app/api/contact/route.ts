import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import {
  checkRateLimit,
  getClientIp,
  pruneRateLimitBuckets,
} from '@/lib/rate-limit';
import { parseJsonBody, isBoundedString } from '@/lib/request-guard';

const MAX_BODY_BYTES = 32_768;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  pruneRateLimitBuckets();
  const { ok, retryAfterSeconds } = checkRateLimit(
    `contact:POST:${getClientIp(req)}`,
    10,
    60_000
  );
  if (!ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    );
  }

  try {
    const parsed = await parseJsonBody(req, MAX_BODY_BYTES);
    if ('response' in parsed) return parsed.response;
    const { name, email, message } = parsed.data;

    if (
      !isBoundedString(name, 100) ||
      !isBoundedString(email, 254) ||
      !EMAIL_PATTERN.test(email) ||
      !isBoundedString(message, 10_000)
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid fields' },
        { status: 400 }
      );
    }

    // Fail closed: without mail credentials configured via the environment
    // there is nothing to fall back to — refuse cleanly instead of erroring
    // deep inside the SMTP client. (The password is ONLY ever read from
    // EMAIL_APP_PASSWORD; no credential literal exists in source.)
    if (!process.env.EMAIL_APP_PASSWORD) {
      return NextResponse.json(
        { error: 'Contact form is not configured on this server' },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'sharmamanojkumar697@gmail.com',
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER || 'sharmamanojkumar697@gmail.com',
      to: 'sharmamanojkumar697@gmail.com',
      subject: `[SOC ALERT] New Secure Message from ${name}`,
      text: `
[ SECURE COMMUNICATION CHANNEL ]

SENDER IDENTIFICATION:
Name/Organization: ${name}
Return Address: ${email}

--- DECRYPTED PAYLOAD ---
${message}

--- END OF TRANSMISSION ---
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: 'Message sent securely.' });
  } catch (error) {
    console.error('SMTP Transmission Error:', error);
    return NextResponse.json({ error: 'Transmission Failed. Check SMTP Credentials.' }, { status: 500 });
  }
}
