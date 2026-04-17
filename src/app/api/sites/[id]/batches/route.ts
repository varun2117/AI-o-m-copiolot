import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { z } from 'zod';

const CreateBatchSchema = z.object({
    name: z.string().min(1)
});

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const batches = db.prepare('SELECT * FROM batches WHERE site_id = ? ORDER BY created_at DESC').all(id);
    return NextResponse.json({ data: batches });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: siteId } = await params;
        const body = await request.json();
        const parsed = CreateBatchSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }
        
        const id = crypto.randomUUID();
        db.prepare(`
            INSERT INTO batches (id, site_id, name, status)
            VALUES (?, ?, ?, 'pending')
        `).run(id, siteId, parsed.data.name);
        
        const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(id);
        return NextResponse.json({ data: batch }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}