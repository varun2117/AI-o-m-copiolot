import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    try {
        db.prepare('SELECT 1').get();
        return NextResponse.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        return NextResponse.json({ status: 'error', database: 'disconnected' }, { status: 500 });
    }
}