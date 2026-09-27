---
phase: 2
plan: 2
wave: 2
---

# Plan 2.2: Curated Skills Database, Indexing & Server Integration

## Objective
Curate a comprehensive dataset of 100+ developer skills and technologies across 15 engineering domains, build a fast indexed in-memory `SkillsRepository` in `@skillforge/server`, enforce automated build-time validation, and connect the repository to the LSP suggestion handler.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md
- PROJECT_RULES.md
- .gsd/phases/2/RESEARCH.md
- packages/shared/src/schemas.ts
- packages/server/src/server.ts

## Tasks

<task type="auto" effort="large">
  <name>Curate 100+ skills database in packages/server/src/data/skills.json</name>
  <files>
    packages/server/src/data/skills.json
  </files>
  <action>
    Create `packages/server/src/data/skills.json` containing 100+ developer skills:
    1. Distribute skills across all 15 categories:
       - Frontend Frameworks (React, Vue, Svelte, Angular, SolidJS, Next.js, Nuxt, SvelteKit, Remix, Astro)
       - UI Libraries (Tailwind CSS, Chakra UI, Shadcn/UI, Material UI, Radix UI, Ant Design, Emotion, Styled Components)
       - State Management (Redux Toolkit, Zustand, MobX, Recoil, Jotai, Pinia, TanStack Query, SWR)
       - Backend Frameworks (Express.js, Fastify, NestJS, Koa, Hono, Django, FastAPI, Flask, Spring Boot, Go Chi, Gin, Actix Web, Axum, ASP.NET Core, Ruby on Rails)
       - Databases (PostgreSQL, MySQL, SQLite, MongoDB, Redis, Cassandra, DynamoDB, Supabase, Neon, Elasticsearch, Meilisearch, ChromaDB, Pinecone)
       - ORMs (Prisma, Drizzle ORM, TypeORM, Mongoose, SQLAlchemy, Tortoise ORM, GORM, Diesel, Flyway, Liquibase)
       - Authentication & Security (Passport.js, NextAuth.js, Lucia, Firebase Auth, Clerk, Auth0 SDK, Jose, Bcrypt, Helmet, CORS)
       - API Protocols (Socket.io, ws, GraphQL Apollo, tRPC, gRPC, Pusher, WebRTC, Axios, Ky)
       - DevOps & Cloud (Docker, Kubernetes, Docker Compose, Terraform, GitHub Actions, AWS CDK, Vercel, Railway, Render, Fly.io, Cloudflare Workers, Nginx)
       - Testing (Vitest, Jest, Playwright, Cypress, Supertest, Pytest, Mockito)
       - AI/ML & Utilities (LangChain, LlamaIndex, OpenAI SDK, Zod, Lodash, Date-fns, Sharp, Winston, Pino)
    2. Ensure every skill has:
       - Unique alphanumeric-hyphen `id`
       - Clear, beginner-friendly `description` and `whyUseIt` guidance
       - Curated learning resources (docs, tutorial, video) with valid HTTPS URLs
       - Meaningful `tags`, `alternatives`, `worksWellWith`, `prerequisites`, and `stackIndicators` (exact package names)
    AVOID: Hallucinated or placeholder URLs; all links must point to authentic documentation domains.
  </action>
  <verify>node -e "const skills = require('./packages/server/src/data/skills.json'); console.log('Total skills count:', skills.length); if (skills.length < 100) process.exit(1);"</verify>
  <done>skills.json contains >= 100 valid skill entries across all domains.</done>
</task>

<task type="auto" effort="medium">
  <name>Build SkillsRepository and automated integrity validation script</name>
  <files>
    packages/server/src/data/skills-repository.ts,
    packages/server/scripts/validate-skills.ts,
    packages/server/src/server.ts,
    packages/server/package.json
  </files>
  <action>
    1. Create `packages/server/src/data/skills-repository.ts`:
       - Class `SkillsRepository` loading and validating `skills.json` via Zod schema.
       - Construct in-memory indices on load:
         - `idIndex`: `Map<string, Skill>` for O(1) retrieval.
         - `tagIndex`: `Map<string, Set<string>>` for fast keyword tag lookups.
         - `categoryIndex`: `Map<string, Set<string>>` for domain filtering.
         - `ecosystemIndex`: `Map<string, Set<string>>`.
       - Query methods: `getSkillById(id)`, `findSkillsByTag(tag)`, `findSkillsByCategory(category)`, `searchSkills(query, options)`, `getAllSkills()`.
    2. Create `packages/server/scripts/validate-skills.ts`:
       - Build-time validation script executing Zod validation over `skills.json`.
       - Assert no duplicate IDs, valid HTTPS URLs, and relational consistency.
       - Add `"validate:skills": "tsx scripts/validate-skills.ts"` or node runner in `packages/server/package.json`.
    3. Update `packages/server/src/server.ts`:
       - Inject `SkillsRepository` into `SkillForgeServer`.
       - Update `skillforge/suggest` handler to query `SkillsRepository` instead of hardcoded baseline skills.
  </action>
  <verify>pnpm --filter @skillforge/server build</verify>
  <done>packages/server builds cleanly with SkillsRepository integrated and validation passing.</done>
</task>

<task type="auto" effort="small">
  <name>Add tests for SkillsRepository and dataset search</name>
  <files>
    packages/server/src/__tests__/skills-repository.test.ts,
    packages/server/src/__tests__/server-integration.test.ts
  </files>
  <action>
    1. Create `packages/server/src/__tests__/skills-repository.test.ts`:
       - Verify repository loads >= 100 skills.
       - Test O(1) ID lookups, category lookups, and tag-based searches.
       - Test search relevance ranking for various queries (e.g., "frontend UI", "orm database", "authentication").
    2. Update `packages/server/src/__tests__/server-integration.test.ts`:
       - Assert that `skillforge/suggest` returns matching skills from the curated database across multiple domains.
  </action>
  <verify>pnpm test</verify>
  <done>All tests in packages/shared and packages/server pass with 100% success.</done>
</task>

## Success Criteria
- [ ] `packages/server/src/data/skills.json` contains 100+ fully-formed, schema-compliant skills.
- [ ] `SkillsRepository` provides O(1) ID lookups and fast tag/category indices.
- [ ] Build-time validation script verifies relational consistency and passes.
- [ ] All unit and integration tests pass with zero regressions.
