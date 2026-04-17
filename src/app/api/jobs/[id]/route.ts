import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const job = db.prepare('SELECT * FROM analysis_jobs WHERE id = ?').get(id);
    
    if (!job) {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    return NextResponse.json({ data: job });
}