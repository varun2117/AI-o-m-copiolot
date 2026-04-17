import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import db from "@/lib/db";

async function getReport(siteId: string) {
  try {
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(siteId) as any;
    if (!site) return null;

    const batches = db.prepare('SELECT id FROM batches WHERE site_id = ?').all(siteId) as { id: string }[];
    const batchIds = batches.map(b => b.id);
    
    let totalFindings = 0;
    let findingsSummary = {};
    
    if (batchIds.length > 0) {
        const placeholders = batchIds.map(() => '?').join(',');
        const findings = db.prepare(`SELECT type, severity FROM findings WHERE batch_id IN (${placeholders})`).all(...batchIds) as { type: string, severity: string }[];
        
        totalFindings = findings.length;
        findingsSummary = findings.reduce((acc: any, curr) => {
            acc[curr.type] = (acc[curr.type] || 0) + 1;
            return acc;
        }, {});
    }

    return {
        data: {
            site,
            report: {
                totalBatches: batches.length,
                totalFindings,
                findingsSummary
            }
        }
    };
  } catch (error) {
    return null;
  }
}

export default async function SiteReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reportData = await getReport(id);

  if (!reportData) {
    notFound();
  }

  const { site, report } = reportData.data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{site.name} - Report</h1>
        <p className="text-muted-foreground">Summary of inspections and findings.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Batches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalBatches}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalFindings}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Findings Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md overflow-auto text-sm">
            {JSON.stringify(report.findingsSummary, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
