import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'movies';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    
    // Convert buffer to base64 data URL
    const base64String = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64String}`;
    
    // Determine resource type
    const isVideo = file.type.startsWith('video/');
    const resourceType = isVideo ? 'video' : 'image';

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataUrl, {
      resource_type: resourceType,
      folder: folder,
      public_id: `${Date.now()}-${file.name.split('.')[0]}`,
      overwrite: true,
    });

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Upload failed' 
    }, { status: 500 });
  }
}
