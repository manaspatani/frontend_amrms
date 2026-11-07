import * as React from "react";
import { RunDetailContent } from "@/components/runs/run-detail-content";

interface RunDetailPageProps {
  params: Promise<{ runId: string }>;
}

export default async function RunDetailPage({ params }: RunDetailPageProps) {
  const { runId } = await params;
  return <RunDetailContent runId={runId} />;
}
