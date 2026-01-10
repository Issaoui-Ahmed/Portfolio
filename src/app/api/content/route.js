import { NextResponse } from 'next/server';
import { getContent, saveContent } from '@/lib/content';

export async function GET() {
    const data = await getContent();
    return NextResponse.json(data);
}

export async function POST(request) {
    try {
        const data = await request.json();
        const success = await saveContent(data);

        if (success) {
            return NextResponse.json({ message: 'Content updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Failed to save content' }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }
}
