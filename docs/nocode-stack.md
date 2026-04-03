# No-code and Free-build Options

## Recommended stack

- Automation orchestration: n8n (self-hosted, open source)
- Internal admin panel: Appsmith (open source)
- Auth + DB accelerator: Supabase free tier
- Analytics dashboards: Metabase (open source)

## Integration strategy

1. Keep this repo as the core product and API.
2. Use n8n for webhook/event workflows:
   - New lead comment -> DM workflow
   - Failed post retry workflow
3. Use Appsmith for ops dashboards:
   - Queue health
   - Failed automation runs
4. Add Metabase for read-only analytics over PostgreSQL.

## Why this is optimal

- Fast iteration without vendor lock-in
- Open-source components with active ecosystems
- Can start free, then migrate to paid infra only when growth requires
