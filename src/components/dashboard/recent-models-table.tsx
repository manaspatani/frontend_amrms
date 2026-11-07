"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TableSkeleton } from "@/components/status/skeletons";
import { ErrorState } from "@/components/status/error-state";
import { EmptyState } from "@/components/status/empty-state";
import { LinkButton } from "@/components/ui/button";
import { formatUtcDate, formatAccuracy } from "@/lib/format";
import type { UploadedModel } from "@/lib/schemas/dashboard";
import type { Verdict } from "@/lib/api/types";
import { cn } from "@/lib/utils";

// ─── Verdict badge configuration ───────────────────────────────────────────

interface VerdictBadgeConfig {
  label: string;
  icon: React.ElementType;
  className: string;
}

const VERDICT_BADGE: Record<Verdict, VerdictBadgeConfig> = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className:
      "bg-[var(--verdict-accepted-bg)] text-[var(--verdict-accepted-fg)] border-[color-mix(in_oklch,var(--verdict-accepted),transparent_60%)]",
  },
  rolled_back: {
    label: "Rolled Back",
    icon: RotateCcw,
    className:
      "bg-[var(--verdict-rolled-back-bg)] text-[var(--verdict-rolled-back-fg)] border-[color-mix(in_oklch,var(--verdict-rolled-back),transparent_60%)]",
  },
  healthy_no_action: {
    label: "Healthy",
    icon: ShieldCheck,
    className:
      "bg-[var(--verdict-healthy-bg)] text-[var(--verdict-healthy-fg)] border-[color-mix(in_oklch,var(--verdict-healthy),transparent_60%)]",
  },
  error: {
    label: "Error",
    icon: AlertTriangle,
    className:
      "bg-[var(--verdict-error-bg)] text-[var(--verdict-error-fg)] border-[color-mix(in_oklch,var(--verdict-error),transparent_60%)]",
  },
};

function VerdictBadge({ verdict }: { verdict: Verdict }) {
  const cfg = VERDICT_BADGE[verdict] ?? VERDICT_BADGE.error;
  const Icon = cfg.icon;
  return (
    <Badge
      className={cn(
        "inline-flex items-center gap-1 border font-medium",
        cfg.className
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span>{cfg.label}</span>
    </Badge>
  );
}

// ─── Architecture label helper ──────────────────────────────────────────────

const ARCH_LABELS: Record<string, string> = {
  mlp_small:      "MLP Small",
  small_cnn:      "Small CNN",
  resnet18_cifar: "ResNet-18 CIFAR",
};

// ─── Component ─────────────────────────────────────────────────────────────

interface RecentModelsTableProps {
  data: UploadedModel[] | undefined;
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
  className?: string;
}

export function RecentModelsTable({
  data,
  isLoading,
  error,
  onRetry,
  className,
}: RecentModelsTableProps) {
  if (isLoading) {
    return <TableSkeleton rows={8} cols={7} className={className} />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load recent models"
        error={error}
        onRetry={onRetry}
        className={className}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title="No models uploaded yet"
        description="Upload your first model checkpoint to start a recovery run."
        className={className}
        action={
          <LinkButton href="/runs/new" variant="default" size="sm">
            Start new recovery
          </LinkButton>
        }
      />
    );
  }

  return (
    <div className={cn("overflow-x-auto rounded-xl border border-border", className)}>
      <Table aria-label="Recently uploaded models">
        <TableHeader>
          <TableRow>
            <TableHead>Model Name</TableHead>
            <TableHead>Architecture</TableHead>
            <TableHead>Scenario</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Verdict</TableHead>
            <TableHead>Accuracy</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead>
              <span className="sr-only">View run</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody items={data}>
          {(model) => (
            <TableRow key={model.id} href={`/runs/${model.runId}`}>
              <TableCell className="font-medium">{model.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {ARCH_LABELS[model.architecture] ?? model.architecture}
              </TableCell>
              <TableCell>{model.scenarioId}</TableCell>
              <TableCell className="capitalize text-muted-foreground">
                {model.diagnosisLabel.replace(/_/g, " ")}
              </TableCell>
              <TableCell>
                <VerdictBadge verdict={model.verdict} />
              </TableCell>
              <TableCell className="tabular-nums">
                {formatAccuracy(model.accuracyBefore)}
                {" → "}
                {model.accuracyAfter !== null
                  ? formatAccuracy(model.accuracyAfter)
                  : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground tabular-nums">
                {formatUtcDate(model.uploadedAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/runs/${model.runId}`}
                  aria-label={`View run for ${model.name}`}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
                >
                  View
                  <ArrowRight className="size-3" aria-hidden="true" />
                </Link>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
