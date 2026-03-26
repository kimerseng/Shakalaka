import { NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function GET() {
  try {
    // simple DB check
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ ok: true, db: true });
  } catch (err) {
    console.error('health check failed:', err);
    return NextResponse.json({ ok: false, db: false, error: String(err) }, { status: 500 });
  }
}
