import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
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
  try {
    const body = await request.json();
    const { name, role, company, content, rating } = body;

    if (!name || !role || !content || typeof rating !== 'number') {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const endorsement = await prisma.endorsement.create({
      data: {
        name,
        role,
        company: company || '',
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

import crypto from 'crypto';

export async function DELETE(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing Admin Key' }, { status: 401 });
    }

    const submittedKey = authHeader.split(' ')[1];

    // Load AES Configuration from Env
    const aesKeyHex = process.env.AES_KEY;
    const aesIvHex = process.env.AES_IV;
    const encryptedAdminKeyHex = process.env.ENCRYPTED_ADMIN_KEY;

    let isValid = false;

    if (aesKeyHex && aesIvHex && encryptedAdminKeyHex) {
      try {
        // Encrypt the submitted key to match against the stored encrypted key
        const cipher = crypto.createCipheriv(
          'aes-256-cbc',
          Buffer.from(aesKeyHex, 'hex'),
          Buffer.from(aesIvHex, 'hex')
        );
        let encryptedSubmission = cipher.update(submittedKey, 'utf8', 'hex');
        encryptedSubmission += cipher.final('hex');
        
        isValid = (encryptedSubmission === encryptedAdminKeyHex);
      } catch (err) {
        console.error("AES Encryption comparison failed", err);
      }
    } else {
      // Fallback if env vars are missing
      isValid = (submittedKey === '20M@#2011n0j03');
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
