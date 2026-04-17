import db from './db';
import crypto from 'crypto';

export async function startAnalysis(batchId: string) {
    const jobId = crypto.randomUUID();
    
    // Create job
    db.prepare(`
        INSERT INTO analysis_jobs (id, batch_id, status, progress)
        VALUES (?, ?, 'queued', 0)
    `).run(jobId, batchId);

    // Update batch status
    db.prepare(`
        UPDATE batches SET status = 'analyzing' WHERE id = ?
    `).run(batchId);

    // Simulate async processing
    setTimeout(() => processAnalysis(jobId, batchId), 1000);

    return jobId;
}

async function processAnalysis(jobId: string, batchId: string) {
    // Update to processing
    db.prepare(`
        UPDATE analysis_jobs SET status = 'processing', progress = 10, updated_at = CURRENT_TIMESTAMP WHERE id = ?
    `).run(jobId);

    // Simulate work
    setTimeout(() => {
        db.prepare(`
            UPDATE analysis_jobs SET progress = 50, updated_at = CURRENT_TIMESTAMP WHERE id = ?
        `).run(jobId);
        
        setTimeout(() => completeAnalysis(jobId, batchId), 2000);
    }, 2000);
}

function completeAnalysis(jobId: string, batchId: string) {
    // Generate mock findings
    const files = db.prepare(`SELECT id FROM files WHERE batch_id = ?`).all(batchId) as { id: string }[];
    
    const findingTypes = ['hotspot', 'soiling', 'physical_damage', 'shading'];
    const severities = ['low', 'medium', 'high', 'critical'];
    
    const insertFinding = db.prepare(`
        INSERT INTO findings (id, batch_id, file_id, type, severity, description, confidence, coordinates)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    let findingCount = 0;

    db.transaction(() => {
        for (const file of files) {
            // 50% chance of finding per file
            if (Math.random() > 0.5) {
                const type = findingTypes[Math.floor(Math.random() * findingTypes.length)];
                const severity = severities[Math.floor(Math.random() * severities.length)];
                insertFinding.run(
                    crypto.randomUUID(),
                    batchId,
                    file.id,
                    type,
                    severity,
                    `Detected ${type} on panel`,
                    0.85 + (Math.random() * 0.1),
                    JSON.stringify({ x: 100, y: 100, w: 50, h: 50 })
                );
                findingCount++;
            }
        }

        // Update job
        db.prepare(`
            UPDATE analysis_jobs 
            SET status = 'completed', progress = 100, result_summary = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?
        `).run(`Found ${findingCount} issues`, jobId);

        // Update batch
        db.prepare(`
            UPDATE batches SET status = 'completed' WHERE id = ?
        `).run(batchId);
    })();
}