import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import {
  checkRateLimit,
  getClientIp,
  pruneRateLimitBuckets,
} from '@/lib/rate-limit';
import { parseJsonBody, isBoundedString } from '@/lib/request-guard';

const WINDOW_MS = 60_000;
const MUTATION_LIMIT = 10; // POST/DELETE per IP per minute
const READ_LIMIT = 60; // GET per IP per minute
const MAX_BODY_BYTES = 16_384;

function rateLimited(request: Request, scope: string, limit: number) {
  pruneRateLimitBuckets();
  const { ok, retryAfterSeconds } = checkRateLimit(
    `${scope}:${getClientIp(request)}`,
    limit,
    WINDOW_MS
  );
  if (ok) return null;
  return NextResponse.json(
    { error: 'Too many requests. Please slow down.' },
    { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
  );
}

// Timing-safe string comparison: crypto.timingSafeEqual throws on length
// mismatch, so guard lengths first (length itself is not secret here).
function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export async function GET(request: Request) {
  const limited = rateLimited(request, 'endorsements:GET', READ_LIMIT);
  if (limited) return limited;

  try {
    const endorsements = await prisma.endorsement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(endorsements);
  } catch (error) {
    console.error("Failed to fetch endorsements:", error);
    return NextResponse.json({ error: 'Failed to fetch endorsements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const limited = rateLimited(request, 'endorsements:POST', MUTATION_LIMIT);
  if (limited) return limited;

  try {
    const parsed = await parseJsonBody(request, MAX_BODY_BYTES);
    if ('response' in parsed) return parsed.response;
    const { name, role, company, content, rating } = parsed.data;

    if (
      !isBoundedString(name, 100) ||
      !isBoundedString(role, 100) ||
      !isBoundedString(content, 2000) ||
      (company !== undefined &&
        (typeof company !== 'string' || company.length > 100)) ||
      typeof rating !== 'number' ||
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json({ error: 'Missing or invalid fields' }, { status: 400 });
    }

    const endorsement = await prisma.endorsement.create({
      data: {
        name,
        role,
        company: typeof company === 'string' ? company : '',
        content,
        rating
      }
    });

    return NextResponse.json(endorsement, { status: 201 });
  } catch (error) {
    console.error("Failed to submit endorsement:", error);
    return NextResponse.json({ error: 'Failed to submit endorsement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const limited = rateLimited(request, 'endorsements:DELETE', MUTATION_LIMIT);
  if (limited) return limited;

  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Admin Key' }, { status: 401 });
    }

    const submittedKey = authHeader.slice('Bearer '.length);

    // FAIL CLOSED: the admin key check is configured ONLY via the
    // AES_KEY / AES_IV / ENCRYPTED_ADMIN_KEY environment variables.
    // There is deliberately NO hard-coded fallback key: if the server is
    // not configured, DELETE refuses with 503 rather than trusting any
    // built-in literal (a literal in source is public to anyone who can
    // read the repo, so it authenticates nobody).
    const aesKeyHex = process.env.AES_KEY;
    const aesIvHex = process.env.AES_IV;
    const encryptedAdminKeyHex = process.env.ENCRYPTED_ADMIN_KEY;

    if (!aesKeyHex || !aesIvHex || !encryptedAdminKeyHex) {
      return NextResponse.json(
        { error: 'Admin operations are not configured on this server' },
        { status: 503 }
      );
    }

    let isValid = false;
    try {
      // Encrypt the submitted key and compare against the stored encrypted
      // key using a timing-safe comparison (blocks timing side-channels).
      const cipher = crypto.createCipheriv(
        'aes-256-cbc',
        Buffer.from(aesKeyHex, 'hex'),
        Buffer.from(aesIvHex, 'hex')
      );
      let encryptedSubmission = cipher.update(submittedKey, 'utf8', 'hex');
      encryptedSubmission += cipher.final('hex');

      isValid = timingSafeStringEqual(encryptedSubmission, encryptedAdminKeyHex);
    } catch (err) {
      // Malformed key material in env = misconfiguration: fail closed.
      console.error("AES Encryption comparison failed", err);
      return NextResponse.json(
        { error: 'Admin operations are not configured on this server' },
        { status: 503 }
      );
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized: Invalid Admin Key' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await prisma.endorsement.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete endorsement:", error);
    return NextResponse.json({ error: 'Failed to delete endorsement' }, { status: 500 });
  }
}
