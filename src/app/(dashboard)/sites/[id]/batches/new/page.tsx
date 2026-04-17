"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useParams } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import { toast } from "sonner";

export default function NewBatchPage() {
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;
  
  const [name, setName] = useState("");
  const [batchId, setBatchId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch(`/api/sites/${siteId}/batches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create batch");
      const { data } = await res.json();
      setBatchId(data.id);
      toast.success("Batch created successfully");
    } catch (error) {
      toast.error("Failed to create batch");
    } finally {
      setIsCreating(false);
    }
  };

  const handleAnalyze = async () => {
    if (!batchId) return;
    try {
      const res = await fetch(`/api/batches/${batchId}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { jobId: "job-" + Date.now() } }),
      });
      if (!res.ok) throw new Error("Failed to start analysis");
      toast.success("Analysis started");
      router.push(`/sites/${siteId}`);
    } catch (error) {
      toast.error("Failed to start analysis");
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Inspection Batch</h1>
        <p className="text-muted-foreground">Upload drone imagery for analysis.</p>
      </div>

      {!batchId ? (
        <Card>
          <CardHeader>
            <CardTitle>Batch Details</CardTitle>
            <CardDescription>Give this inspection batch a name.</CardDescription>
          </CardHeader>
          <form onSubmit={handleCreateBatch}>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="name">Batch Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="e.g., Spring 2024 Inspection" 
                  required 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "Creating..." : "Create Batch"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Upload Images</CardTitle>
            <CardDescription>Upload thermal and RGB images for this batch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FileUpload batchId={batchId} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push(`/sites/${siteId}`)}>
              Cancel
            </Button>
            <Button onClick={handleAnalyze}>
              Start Analysis
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
