import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // You MUST provide EMAIL_APP_PASSWORD in .env.local for this to work
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
