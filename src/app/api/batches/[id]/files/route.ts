import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { uploadFile } from '@/lib/storage';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const files = db.prepare('SELECT * FROM files WHERE batch_id = ? ORDER BY created_at DESC').all(id);
    return NextResponse.json({ data: files });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: batchId } = await params;
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const type = formData.get('type') as string | null;
        
        if (!file || !type) {
            return NextResponse.json({ error: 'File and type are required' }, { status: 400 });
        }
        
        const url = await uploadFile(file);
        const id = crypto.randomUUID();
        
        db.prepare(`
            INSERT INTO files (id, batch_id, filename, url, type)
            VALUES (?, ?, ?, ?, ?)
        `).run(id, batchId, file.name, url, type);
        
        const newFile = db.prepare('SELECT * FROM files WHERE id = ?').get(id);
        return NextResponse.json({ data: newFile }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}