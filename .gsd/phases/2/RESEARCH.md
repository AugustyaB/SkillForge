# Phase 2: Research — Skills Database & Schema Architecture

> **Phase**: 2 — Skills Database & Schema — The Knowledge Base
> **Date**: 2026-09-27
> **Standards Alignment**: Follows [`PROJECT_RULES.md`](../../PROJECT_RULES.md) (Gating Protocol & Monorepo Boundaries)

---

## 1. Zod Runtime Schema Integration

### Rule
Per `PROJECT_RULES.md`:
> `@skillforge/shared`: Pure protocol contracts, Zod schemas, domain types. Zero node/vscode dependencies.
> Runtime data contracts enforced via Zod schemas.

### Schema Design
- Use `zod` (`^3.24.2`) in `@skillforge/shared`.
- Schema defines `DifficultySchema`, `SkillCategorySchema`, `LearnLinkSchema`, and `SkillSchema`.
- Derive TypeScript types using `z.infer<typeof SkillSchema>` to guarantee zero drift between static types and runtime validation.
- Export validation helper `validateSkill(data: unknown): Skill` and `validateSkillsArray(data: unknown): Skill[]`.

---

## 2. Curated Skills Dataset (100+ Skills)

### Categories & Domain Distribution
The 100+ skills must provide realistic, comprehensive coverage across modern software development:
1. **Frontend Frameworks & UI**: React, Vue, Svelte, Angular, SolidJS, Next.js, Nuxt, SvelteKit, Remix, Astro (10)
2. **UI Component & Styling**: Tailwind CSS, Chakra UI, Shadcn/UI, Material UI, Radix UI, Ant Design, Emotion, Styled Components (8)
3. **State Management**: Redux Toolkit, Zustand, MobX, Recoil, Jotai, Pinia, TanStack Query, SWR (8)
4. **Backend Frameworks**: Express.js, Fastify, NestJS, Koa, Hono, Django, FastAPI, Flask, Spring Boot, Go Chi, Gin, Actix Web, Axum, ASP.NET Core, Ruby on Rails (15)
5. **Databases**: PostgreSQL, MySQL, SQLite, MongoDB, Redis, Cassandra, DynamoDB, Supabase, Neon, Elasticsearch, Meilisearch, ChromaDB, Pinecone (13)
6. **ORMs & Database Tools**: Prisma, Drizzle ORM, TypeORM, Mongoose, SQLAlchemy, Tortoise ORM, GORM, Diesel, Flyway, Liquibase (10)
7. **Authentication & Security**: Passport.js, NextAuth.js (Auth.js), Lucia, Firebase Auth, Clerk, Auth0 SDK, Jose, Bcrypt, Helmet, CORS (10)
8. **API Protocols & Real-time**: Socket.io, ws, GraphQL (Apollo), tRPC, gRPC (protobuf), Pusher, WebRTC, Axios, Ky (9)
9. **DevOps, Containers & Cloud**: Docker, Kubernetes, Docker Compose, Terraform, GitHub Actions, AWS CDK, Vercel, Railway, Render, Fly.io, Cloudflare Workers, Nginx (12)
10. **Testing**: Vitest, Jest, Playwright, Cypress, Supertest, Pytest, Mockito (7)
11. **AI/ML & Utilities**: LangChain, LlamaIndex, OpenAI SDK, Zod, Lodash, Date-fns, Sharp, Winston, Pino (9)

**Total**: ~111 curated, verified skills.

---

## 3. Storage & Packaging Architecture

### Location of Dataset
- Dataset stored as pure JSON at `packages/server/src/data/skills.json`.
- Clean JSON format allows version control diffing and easy community contributions later.
- JSON imported directly with TypeScript `resolveJsonModule: true`.

### In-Memory Indexing (`SkillsRepository`)
For fast, deterministic local matching:
- **ID Map**: `Map<string, Skill>` for O(1) retrieval.
- **Inverted Tag Index**: `Map<string, Set<string>>` mapping tags (normalized lowercase) to skill IDs.
- **Category Index**: `Map<string, Set<string>>` grouping skills by category.
- **Ecosystem Index**: `Map<string, Set<string>>` grouping skills by primary ecosystem.

---

## 4. Build-Time Validation Script
- Script `packages/server/scripts/validate-skills.ts` runs during `pnpm build` and `pnpm test`.
- Asserts:
  1. Validates all entries match `SkillSchema`.
  2. No duplicate IDs.
  3. All `alternatives` and `prerequisites` reference recognized skill IDs or valid tools.
  4. All URLs are valid HTTPS strings.
  5. Stack indicators are non-empty arrays.
