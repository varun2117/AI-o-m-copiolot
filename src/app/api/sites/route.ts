import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import crypto from 'crypto';
import { z } from 'zod';

const CreateSiteSchema = z.object({
    name: z.string().min(1),
    location: z.string().min(1),
    capacity_mw: z.number().positive()
});

export async function GET() {
    const sites = db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all();
    return NextResponse.json({ data: sites });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const parsed = CreateSiteSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }
        
        const id = crypto.randomUUID();
        db.prepare(`
            INSERT INTO sites (id, name, location, capacity_mw)
            VALUES (?, ?, ?, ?)
        `).run(id, parsed.data.name, parsed.data.location, parsed.data.capacity_mw);
        
        const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
        return NextResponse.json({ data: site }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}