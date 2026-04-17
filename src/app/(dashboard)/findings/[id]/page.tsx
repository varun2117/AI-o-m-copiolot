import { FindingEvidence } from "@/components/finding-evidence";
import { ReviewPanel } from "@/components/review-panel";

// Mock finding fetch since we don't have a specific GET /api/findings/[id] in the contract,
// but we have PATCH /api/findings/[id]. We'll assume we can fetch it or pass it.
// For now, we'll just render the UI components.
export default async function FindingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Review Finding</h1>
        <p className="text-muted-foreground">Finding ID: {id}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <FindingEvidence findingId={id} />
        </div>
        <div>
          <ReviewPanel findingId={id} />
        </div>
      </div>
    </div>
  );
}
