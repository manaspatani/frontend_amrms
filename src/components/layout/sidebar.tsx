"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Play,
  BarChart3,
  Activity,
  History,
  ChevronLeft,
  ChevronRight,
  Cpu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";

export interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;
}

export const navItems: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Run Recovery", href: "/runs/new", icon: Play },
  { name: "Benchmarks", href: "/benchmarks", icon: BarChart3 },
  { name: "Live Monitor", href: "/monitor", icon: Activity },
  { name: "History", href: "/history", icon: History },
];

export interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({
  className,
  isCollapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();

  const isRouteActive = React.useCallback(
    (href: string) => {
      if (pathname === href) return true;
      if (href !== "/" && pathname?.startsWith(href + "/")) return true;
      return false;
    },
    [pathname]
  );

  return (
    <aside
      aria-label="Sidebar navigation"
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border backdrop-blur-md transition-[width] duration-200 select-none",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Brand header */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-sidebar-border px-3 gap-2.5",
          isCollapsed ? "justify-center" : "justify-between"
        )}
      >
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-md p-1 font-semibold text-sidebar-foreground hover:text-sidebar-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground font-bold shadow-xs">
            <Cpu className="size-4.5" aria-hidden="true" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-bold tracking-tight leading-none text-sidebar-foreground">
                AMRS
              </span>
              <span className="text-[10px] text-muted-foreground truncate leading-snug">
                Model Recovery
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav aria-label="Main" className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {navItems.map((item) => {
          const isActive = isRouteActive(item.href);
          const Icon = item.icon;

          const linkContent = (
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors outline-none",
                "focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon
                className={cn(
                  "size-5 shrink-0 transition-colors",
                  isActive
                    ? "text-sidebar-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground"
                )}
                aria-hidden="true"
              />
              {!isCollapsed && <span className="truncate">{item.name}</span>}
              {isCollapsed && <span className="sr-only">{item.name}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <TooltipTrigger key={item.href} delay={150}>
                {linkContent}
                <Tooltip placement="right">{item.name}</Tooltip>
              </TooltipTrigger>
            );
          }

          return <div key={item.href}>{linkContent}</div>;
        })}
      </nav>

      {/* Collapse Toggle Footer */}
      {onToggleCollapse && (
        <div
          className={cn(
            "p-2 border-t border-sidebar-border flex items-center",
            isCollapsed ? "justify-center" : "justify-end"
          )}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onPress={onToggleCollapse}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isCollapsed}
            className="text-muted-foreground hover:text-sidebar-foreground"
          >
            {isCollapsed ? (
              <ChevronRight className="size-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4" aria-hidden="true" />
            )}
            <span className="sr-only">
              {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            </span>
          </Button>
        </div>
      )}
    </aside>
  );
}
