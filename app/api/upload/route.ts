import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const filenameParam = url.searchParams.get('filename');

    if (!filenameParam) {
      return NextResponse.json({ error: 'Missing filename query param' }, { status: 400 });
    }

    const filename = filenameParam.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filepath = path.join(uploadsDir, filename);
    await fs.writeFile(filepath, buffer);

    // Return a URL relative to the public folder
    const publicUrl = `/uploads/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error('upload error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
