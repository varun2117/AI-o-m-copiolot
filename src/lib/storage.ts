import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export async function uploadFile(file: File): Promise<string> {
    const id = crypto.randomUUID();
    const filename = `${id}-${file.name}`;
    const uploadDir = path.join(process.cwd(), 'uploads');
    
    // Ensure directory exists
    try {
        await fs.access(uploadDir);
    } catch {
        await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    await fs.writeFile(filePath, buffer);
    
    return `/uploads/${filename}`;
}