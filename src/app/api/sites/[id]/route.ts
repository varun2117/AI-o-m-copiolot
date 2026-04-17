import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    
    if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: site });
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const result = db.prepare('DELETE FROM sites WHERE id = ?').run(id);
    
    if (result.changes === 0) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
}