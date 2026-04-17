"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function FindingsTable({ findings }: { findings: any[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {findings?.map((finding) => (
          <TableRow key={finding.id}>
            <TableCell className="font-medium">{finding.id.slice(0, 8)}</TableCell>
            <TableCell>{finding.type || "Anomaly"}</TableCell>
            <TableCell>
              <Badge variant={finding.severity === "high" ? "destructive" : finding.severity === "medium" ? "default" : "secondary"}>
                {finding.severity || "unknown"}
              </Badge>
            </TableCell>
            <TableCell>{finding.status || "Open"}</TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link href={`/findings/${finding.id}`}>Review</Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {(!findings || findings.length === 0) && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground">
              No findings detected.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
