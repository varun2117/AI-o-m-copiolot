import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { startAnalysis } from '@/lib/ai-service';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: batchId } = await params;
        
        const batch = db.prepare('SELECT * FROM batches WHERE id = ?').get(batchId);
        if (!batch) {
            return NextResponse.json({ error: 'Batch not found' }, { status: 404 });
        }
        
        const jobId = await startAnalysis(batchId);
        
        return NextResponse.json({ data: { jobId } }, { status: 202 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}