import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const findings = db.prepare(`
        SELECT f.*, fi.filename, fi.url as file_url 
        FROM findings f
        LEFT JOIN files fi ON f.file_id = fi.id
        WHERE f.batch_id = ? 
        ORDER BY f.severity DESC, f.confidence DESC
    `).all(id);
    
    return NextResponse.json({ data: findings });
}