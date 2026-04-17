import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { z } from 'zod';

const UpdateFindingSchema = z.object({
    severity: z.enum(['low', 'medium', 'high', 'critical']).optional(),
    description: z.string().optional()
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const parsed = UpdateFindingSchema.safeParse(body);
        
        if (!parsed.success) {
            return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten() }, { status: 400 });
        }
        
        const updates = [];
        const values = [];
        
        if (parsed.data.severity) {
            updates.push('severity = ?');
            values.push(parsed.data.severity);
        }
        
        if (parsed.data.description) {
            updates.push('description = ?');
            values.push(parsed.data.description);
        }
        
        if (updates.length > 0) {
            values.push(id);
            db.prepare(`
                UPDATE findings 
                SET ${updates.join(', ')} 
                WHERE id = ?
            `).run(...values);
        }
        
        const finding = db.prepare('SELECT * FROM findings WHERE id = ?').get(id);
        if (!finding) {
            return NextResponse.json({ error: 'Finding not found' }, { status: 404 });
        }
        
        return NextResponse.json({ data: finding });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}