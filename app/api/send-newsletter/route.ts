import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(req: Request) {
    try {
        const { newsletterId, title, link } = await req.json();

        if (!newsletterId || !title) {
            return NextResponse.json({ error: 'Missing newsletterId or title' }, { status: 400 });
        }

        // 1. Fetch all users from Firestore
        const usersSnapshot = await adminDb.collection('users').get();
        const users = usersSnapshot.docs.map((doc: any) => doc.data());
        const emails = users.map((user: any) => user.email).filter((email: string) => email);

        if (emails.length === 0) {
            return NextResponse.json({ message: 'No users to email' });
        }

        // 2. Setup Transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // 3. Send Emails
        // In production, use a queue (e.g., Redis/Bull) or batch sending.
        // For this demo, we'll loop (careful with limits).
        // Or better, send as BCC to save API calls if the provider allows.
        // Let's send individually for personalization potential later, but serially for now.

        const emailPromises = emails.map((email: string) => {
            return transporter.sendMail({
                from: process.env.SMTP_FROM || '"NewsletterMS" <noreply@example.com>',
                to: email,
                subject: `New Newsletter: ${title}`,
                html: `
                    <h1>New Newsletter Published!</h1>
                    <p>A new newsletter "<strong>${title}</strong>" has just been published.</p>
                    <p>Read it here: <a href="${link}">${link}</a></p>
                `,
            });
        });

        await Promise.all(emailPromises);

        return NextResponse.json({ success: true, count: emails.length });
    } catch (error: any) {
        console.error('Email sending error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
