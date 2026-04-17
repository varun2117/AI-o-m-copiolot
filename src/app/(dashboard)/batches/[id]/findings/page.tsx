import { FindingsTable } from "@/components/findings-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import db from "@/lib/db";

async function getFindings(batchId: string) {
  try {
    const findings = db.prepare('SELECT * FROM findings WHERE batch_id = ? ORDER BY created_at DESC').all(batchId);
    return { data: findings };
  } catch (error) {
    return { data: [] };
  }
}

export default async function BatchFindingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: findings } = await getFindings(id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Inspection Findings</h1>
        <p className="text-muted-foreground">Review anomalies detected in this batch.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detected Anomalies</CardTitle>
        </CardHeader>
        <CardContent>
          <FindingsTable findings={findings} />
        </CardContent>
      </Card>
    </div>
  );
}
