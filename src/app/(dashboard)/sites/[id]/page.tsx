import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import db from "@/lib/db";

async function getSite(id: string) {
  try {
    const site = db.prepare('SELECT * FROM sites WHERE id = ?').get(id) as any;
    if (!site) return null;
    return { data: site };
  } catch (error) {
    return null;
  }
}

async function getBatches(id: string) {
  try {
    const batches = db.prepare('SELECT * FROM batches WHERE site_id = ? ORDER BY created_at DESC').all(id);
    return { data: batches };
  } catch (error) {
    return { data: [] };
  }
}

export default async function SitePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const siteData = await getSite(id);
  
  if (!siteData) {
    notFound();
  }

  const site = siteData.data;
  const { data: batches } = await getBatches(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{site.name}</h1>
          <p className="text-muted-foreground">{site.location} • {site.capacity_mw} MW</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/sites/${id}/report`}>
              <FileText className="mr-2 h-4 w-4" /> View Report
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/sites/${id}/batches/new`}>
              <Plus className="mr-2 h-4 w-4" /> New Batch
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inspection Batches</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches?.map((batch: any) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.status || "Pending"}</TableCell>
                  <TableCell>{new Date(batch.createdAt || Date.now()).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/batches/${batch.id}/findings`}>View Findings</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {(!batches || batches.length === 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No batches found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
