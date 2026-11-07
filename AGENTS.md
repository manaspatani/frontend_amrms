<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## AMRS dashboard rules
- This is a frontend-only demo of AMRS (Adaptive Model Recovery System). All data comes from src/lib/api,
  which currently returns mock data from src/lib/mock. Components never call fetch directly and never
  compute metrics, diagnoses or verdicts; they only render what src/lib/api returns.
- UI uses shadcn/ui (React Aria variant). Read the generated files in src/components/ui before using
  them; do not assume Radix-style props.
- Next.js 16 with Cache Components enabled: wrap client hooks like useSearchParams in <Suspense>, and
  do not use legacy route segment config exports. If a build error mentions this, fix it instead of disabling the feature.
- Accessibility: contrast >= 4.5:1, verdicts always show icon + text (never color alone), keyboard
  reachable controls, text summary under every chart, respect prefers-reduced-motion.
- Every page needs loading, empty and error states.
