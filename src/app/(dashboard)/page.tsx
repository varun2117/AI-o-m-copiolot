import { DashboardStats } from "@/components/dashboard-stats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import db from "@/lib/db";

async function getSites() {
  try {
    const sites = db.prepare('SELECT * FROM sites ORDER BY created_at DESC').all();
    return { data: sites };
  } catch (error) {
    return { data: [] };
  }
}

export default async function DashboardPage() {
  const { data: sites } = await getSites();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your solar sites and recent activity.</p>
      </div>

      <DashboardStats sitesCount={sites?.length || 0} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sites?.slice(0, 3).map((site: any) => (
          <Card key={site.id}>
            <CardHeader>
              <CardTitle>{site.name}</CardTitle>
              <CardDescription>{site.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{site.capacity_mw} MW</div>
              <p className="text-xs text-muted-foreground">Capacity</p>
            </CardContent>
            <div className="p-6 pt-0">
              <Button asChild variant="outline" className="w-full">
                <Link href={`/sites/${site.id}`}>
                  View Site <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
