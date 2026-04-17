import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id);
    if (!site) {
        return NextResponse.json({ error: 'Site not found' }, { status: 404 });
    }
    
    // Get all completed batches for this site
    const batches = db.prepare('SELECT id, name, created_at FROM batches WHERE site_id = ? AND status = "completed" ORDER BY created_at DESC').all(id) as { id: string, name: string, created_at: string }[];
    
    const batchIds = batches.map(b => b.id);
    
    let findingsSummary = [];
    let totalFindings = 0;
    
    if (batchIds.length > 0) {
        const placeholders = batchIds.map(() => '?').join(',');
        
        // Group findings by type and severity
        findingsSummary = db.prepare(`
            SELECT type, severity, COUNT(*) as count
            FROM findings
            WHERE batch_id IN (${placeholders})
            GROUP BY type, severity
        `).all(...batchIds) as any[];
        
        totalFindings = findingsSummary.reduce((acc, curr) => acc + curr.count, 0);
    }
    
    return NextResponse.json({
        data: {
            site,
            report: {
                totalBatches: batches.length,
                recentBatches: batches.slice(0, 5),
                totalFindings,
                findingsSummary
            }
        }
    });
}