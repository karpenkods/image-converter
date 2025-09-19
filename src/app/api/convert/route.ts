import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string;
    const width = formData.get('width');
    const height = formData.get('height');
    const quality = parseInt(formData.get('quality') as string) || 90;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let outputBuffer: Buffer;
    let contentType: string;
    let filename: string;

    // Handle image formats with Sharp
    let sharpInstance = sharp(buffer);

    if (width || height) {
      const w = width ? parseInt(width as string) : undefined;
      const h = height ? parseInt(height as string) : undefined;
      sharpInstance = sharpInstance.resize(w, h);
    }

    switch (format) {
      case 'webp':
        outputBuffer = await sharpInstance.webp({ quality }).toBuffer();
        contentType = 'image/webp';
        filename = `${file.name.split('.')[0].replace(/_/g, '-')}.webp`;
        break;
      case 'png':
        outputBuffer = await sharpInstance.png().toBuffer();
        contentType = 'image/png';
        filename = `${file.name.split('.')[0].replace(/_/g, '-')}.png`;
        break;
      case 'jpg':
        outputBuffer = await sharpInstance.jpeg({ quality }).toBuffer();
        contentType = 'image/jpeg';
        filename = `${file.name.split('.')[0].replace(/_/g, '-')}.jpg`;
        break;
      case 'ico':
        outputBuffer = await sharpInstance.resize(32, 32).png().toBuffer();
        contentType = 'image/x-icon';
        filename = `${file.name.split('.')[0].replace(/_/g, '-')}.ico`;
        break;
      case 'pdf':
        // For PDF, we'll return the original image as base64 for client-side processing
        const base64 = buffer.toString('base64');
        return NextResponse.json({
          type: 'pdf',
          data: base64,
          filename: `${file.name.split('.')[0].replace(/_/g, '-')}.pdf`,
        });
      default:
        return NextResponse.json(
          { error: 'Unsupported format' },
          { status: 400 }
        );
    }

    return new NextResponse(outputBuffer as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Conversion error:', error);
    return NextResponse.json(
      { error: 'Failed to convert image' },
      { status: 500 }
    );
  }
}
