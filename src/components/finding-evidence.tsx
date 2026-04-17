import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function FindingEvidence({ findingId }: { findingId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Evidence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
          {/* Placeholder for actual image */}
          <span className="text-muted-foreground">Thermal Image View</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">RGB Reference</span>
          </div>
          <div className="aspect-video relative rounded-lg overflow-hidden bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Context Map</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
