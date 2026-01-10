import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json({ message: 'No file received' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = Date.now() + '-' + file.name.replaceAll(' ', '_');

        // Write to public/uploads
        // Note: In development, this writes to the source public folder if running from root.
        // In production build, it writes to the build output, which isn't persistent.
        // Assuming 'Local CMS' workflow where user commits these files.
        // We try to write to the project root 'public' folder.

        const uploadDir = path.join(process.cwd(), 'public/uploads');
        const filePath = path.join(uploadDir, filename);

        await writeFile(filePath, buffer);

        return NextResponse.json({
            message: 'File uploaded',
            url: `/uploads/${filename}`
        }, { status: 200 });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
    }
}
