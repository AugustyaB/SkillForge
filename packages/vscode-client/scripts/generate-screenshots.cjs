const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '../resources/screenshots');
fs.mkdirSync(targetDir, { recursive: true });

// 1. Sidebar Overview SVG
const sidebarSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" width="960" height="620">
  <defs>
    <style>
      .bg { fill: #18181b; }
      .bar { fill: #121214; }
      .sidebar { fill: #1f1f23; }
      .card { fill: #27272a; stroke: #3f3f46; stroke-width: 1; }
      .border { stroke: #27272a; stroke-width: 1; }
      .header-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; font-weight: 700; fill: #a1a1aa; letter-spacing: 0.5px; }
      .title-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 13px; font-weight: 600; fill: #f4f4f5; }
      .body-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 12px; fill: #d4d4d8; }
      .muted-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 11px; fill: #71717a; }
      .code-text { font-family: 'Cascadia Code', Consolas, monospace; font-size: 11px; fill: #38bdf8; }
      .badge-bg { fill: #064e3b; stroke: #059669; stroke-width: 1; rx: 4; }
      .badge-text { font-family: -apple-system, sans-serif; font-size: 10px; font-weight: 600; fill: #34d399; }
      .btn { fill: #3b82f6; rx: 4; }
      .btn-text { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 600; fill: #ffffff; }
      .icon-active { fill: #38bdf8; }
      .icon-dim { fill: #71717a; }
    </style>
  </defs>

  <!-- Background / Window Frame -->
  <rect class="bg" width="960" height="620" rx="10" />
  
  <!-- Titlebar -->
  <rect fill="#09090b" width="960" height="38" rx="10" />
  <circle cx="20" cy="19" r="6" fill="#ef4444" />
  <circle cx="38" cy="19" r="6" fill="#f59e0b" />
  <circle cx="56" cy="19" r="6" fill="#10b981" />
  <text x="480" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">SkillForge — Activity Bar &amp; Workspace Context (VS Code)</text>

  <!-- Activity Bar (Far Left) -->
  <rect class="bar" x="0" y="38" width="54" height="582" />
  <!-- Activity bar icons -->
  <rect x="0" y="96" width="3" height="36" fill="#38bdf8" />
  <!-- SkillForge Anvil Icon (active) -->
  <g transform="translate(15, 102)" fill="#38bdf8">
    <path d="M4 2 L20 2 L20 5 L17 7 L17 11 L19 14 L19 16 L5 16 L5 14 L7 11 L7 7 L4 5 Z" stroke="#38bdf8" stroke-width="1.5" fill="none"/>
    <circle cx="12" cy="7" r="2" fill="#38bdf8" />
  </g>
  <!-- Files Icon -->
  <g transform="translate(17, 56)" fill="#71717a">
    <rect x="2" y="2" width="16" height="18" rx="2" fill="none" stroke="#71717a" stroke-width="1.5"/>
  </g>
  <!-- Search Icon -->
  <g transform="translate(17, 150)" fill="#71717a">
    <circle cx="9" cy="9" r="6" fill="none" stroke="#71717a" stroke-width="1.5"/>
    <line x1="14" y1="14" x2="19" y2="19" stroke="#71717a" stroke-width="1.5"/>
  </g>

  <!-- Sidebar (Primary Panel) -->
  <rect class="sidebar" x="54" y="38" width="320" height="582" />
  <line x1="374" y1="38" x2="374" y2="620" stroke="#27272a" stroke-width="1" />

  <!-- Sidebar Header -->
  <text x="72" y="65" class="header-text">SKILLFORGE: DEVELOPER COMPASS</text>

  <!-- View 1: Context & Stack -->
  <rect x="64" y="80" width="300" height="120" class="card" rx="6" />
  <text x="78" y="102" class="title-text">📦 Context &amp; Stack</text>
  <text x="78" y="122" class="body-text">Scope: <tspan class="code-text">Entire Workspace</tspan></text>
  <text x="78" y="140" class="muted-text">Ecosystems: TypeScript, Python, Rust</text>
  <text x="78" y="158" class="muted-text">Manifests: package.json, pyproject.toml</text>
  <rect x="78" y="168" width="80" height="20" class="badge-bg" />
  <text x="86" y="182" class="badge-text">✓ 36 Installed</text>

  <!-- View 2: Quick Actions -->
  <rect x="64" y="210" width="300" height="110" class="card" rx="6" />
  <text x="78" y="232" class="title-text">⚡ Quick Actions</text>
  <rect x="78" y="244" width="130" height="26" class="btn" />
  <text x="88" y="261" class="btn-text">✨ Suggest for Idea</text>
  <rect x="216" y="244" width="136" height="26" fill="#3f3f46" rx="4" />
  <text x="226" y="261" class="btn-text">⚖️ Compare Tools</text>
  <text x="78" y="296" class="muted-text">Shortcuts: Ctrl+Alt+S / Cmd+Alt+S</text>

  <!-- View 3: All SkillForge Commands -->
  <rect x="64" y="330" width="300" height="110" class="card" rx="6" />
  <text x="78" y="352" class="title-text">🛠️ All Commands (16 Available)</text>
  <text x="78" y="374" class="body-text">• Suggest for Current File (Ctrl+Alt+F)</text>
  <text x="78" y="394" class="body-text">• Select Scope Directory</text>
  <text x="78" y="414" class="body-text">• Generate AI Agent Skill (SKILL.md)</text>
  <text x="78" y="430" class="muted-text">• Configure BYOK API Key (Gemini/OpenAI)</text>

  <!-- View 4: Saved Bookmarks & History -->
  <rect x="64" y="450" width="300" height="150" class="card" rx="6" />
  <text x="78" y="472" class="title-text">⭐ Saved Bookmarks</text>
  <text x="78" y="494" class="body-text">⭐ <tspan font-weight="600">zustand</tspan> — State Management</text>
  <text x="78" y="514" class="body-text">⭐ <tspan font-weight="600">fastapi</tspan> — Web Backend</text>
  <text x="78" y="534" class="body-text">⭐ <tspan font-weight="600">shadcn-ui</tspan> — UI Components</text>
  <text x="78" y="565" class="title-text">🕒 Recent Queries</text>
  <text x="78" y="585" class="muted-text">"state management for react" (5 results)</text>

  <!-- Main Canvas Preview (Right) -->
  <rect x="375" y="38" width="585" height="582" fill="#18181b" />
  
  <!-- Canvas Header -->
  <rect x="395" y="60" width="545" height="70" fill="#27272a" rx="8" />
  <text x="415" y="88" class="title-text" font-size="16px">🎯 Recommended Libraries for "state management"</text>
  <text x="415" y="112" class="muted-text">Curated offline search across 363 vetted developer tools • 0ms latency</text>

  <!-- Card 1: Zustand -->
  <rect x="395" y="145" width="545" height="135" class="card" rx="8" />
  <text x="415" y="175" class="title-text" font-size="15px">1. Zustand <tspan class="code-text" font-size="13px">zustand</tspan></text>
  <rect x="830" y="160" width="95" height="22" class="badge-bg" />
  <text x="840" y="175" class="badge-text">✅ Verified Tier</text>
  <text x="415" y="202" class="body-text">A small, fast, and scalable bearbones state management solution using simplified flux principles.</text>
  <text x="415" y="224" class="muted-text">Works well with: <tspan class="code-text">react, nextjs, typescript</tspan> • Alternatives: <tspan fill="#f59e0b">jotai, recoil, redux</tspan></text>
  <rect x="415" y="240" width="130" height="26" fill="#10b981" rx="4" />
  <text x="425" y="257" font-family="-apple-system, sans-serif" font-size="11px" font-weight="600" fill="#ffffff">📥 pnpm add zustand</text>
  <rect x="555" y="240" width="120" height="26" fill="#6366f1" rx="4" />
  <text x="565" y="257" font-family="-apple-system, sans-serif" font-size="11px" font-weight="600" fill="#ffffff">🤖 Agent Directive</text>

  <!-- Card 2: TanStack Query -->
  <rect x="395" y="295" width="545" height="135" class="card" rx="8" />
  <text x="415" y="325" class="title-text" font-size="15px">2. TanStack Query <tspan class="code-text" font-size="13px">@tanstack/react-query</tspan></text>
  <rect x="830" y="310" width="95" height="22" class="badge-bg" />
  <text x="840" y="325" class="badge-text">✅ Verified Tier</text>
  <text x="415" y="352" class="body-text">Powerful asynchronous state management for server data, caching, and background refetching.</text>
  <text x="415" y="374" class="muted-text">Works well with: <tspan class="code-text">react, vue, svelte</tspan> • Weekly Downloads: <tspan fill="#34d399">4.2M</tspan></text>
  <rect x="415" y="390" width="180" height="26" fill="#10b981" rx="4" />
  <text x="425" y="407" font-family="-apple-system, sans-serif" font-size="11px" font-weight="600" fill="#ffffff">📥 pnpm add @tanstack/...</text>

  <!-- Privacy Guarantee Footer Banner -->
  <rect x="395" y="450" width="545" height="55" fill="#0f172a" stroke="#1e293b" rx="8" />
  <text x="415" y="475" class="title-text" fill="#38bdf8">🔒 100% Offline &amp; Private by Default</text>
  <text x="415" y="493" class="muted-text">Zero source code leaves your machine. In-memory inverted index searches without cloud dependencies.</text>
</svg>`;

// 2. Comparison Matrix SVG
const comparisonSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" width="960" height="620">
  <defs>
    <style>
      .bg { fill: #18181b; }
      .table-bg { fill: #1f1f23; stroke: #27272a; stroke-width: 1; rx: 8; }
      .header-bg { fill: #27272a; }
      .row-alt { fill: #222226; }
      .row-border { stroke: #2e2e33; stroke-width: 1; }
      .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size: 16px; font-weight: 700; fill: #f4f4f5; }
      .th { font-family: -apple-system, sans-serif; font-size: 13px; font-weight: 700; fill: #ffffff; }
      .td-dim { font-family: -apple-system, sans-serif; font-size: 12px; font-weight: 600; fill: #a1a1aa; }
      .td-val { font-family: -apple-system, sans-serif; font-size: 12px; fill: #e4e4e7; }
      .code { font-family: 'Cascadia Code', Consolas, monospace; font-size: 12px; fill: #38bdf8; }
      .badge-verified { fill: #064e3b; stroke: #059669; rx: 4; }
      .badge-text { font-family: -apple-system, sans-serif; font-size: 10px; font-weight: 700; fill: #34d399; }
      .warn-box { fill: #451a03; stroke: #b45309; stroke-width: 1; rx: 6; }
      .warn-text { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 600; fill: #fcd34d; }
      .btn-install { fill: #10b981; rx: 4; }
      .btn-text { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 700; fill: #ffffff; }
    </style>
  </defs>

  <!-- Background -->
  <rect class="bg" width="960" height="620" rx="10" />

  <!-- Window Bar -->
  <rect fill="#09090b" width="960" height="38" rx="10" />
  <circle cx="20" cy="19" r="6" fill="#ef4444" />
  <circle cx="38" cy="19" r="6" fill="#f59e0b" />
  <circle cx="56" cy="19" r="6" fill="#10b981" />
  <text x="480" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">SkillForge — Side-by-Side Architectural Comparison Matrix</text>

  <!-- Header Title -->
  <text x="40" y="75" class="title">⚖️ Side-by-Side Comparison: FastAPI vs Django</text>
  <text x="40" y="95" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">Deep-dive technical matrix analyzing architectural slot, maintainability, and production tradeoffs.</text>

  <!-- Conflict Warning Banner -->
  <rect x="40" y="115" width="880" height="38" class="warn-box" />
  <text x="56" y="138" class="warn-text">⚠️ Architectural Conflict: Both packages occupy the primary Python Web API backend slot. Pick one for clean architecture.</text>

  <!-- Table Container -->
  <g transform="translate(40, 165)">
    <rect width="880" height="420" class="table-bg" />

    <!-- Table Header Row -->
    <rect width="880" height="44" class="header-bg" rx="8" />
    <text x="24" y="27" class="th">Dimension</text>
    <text x="260" y="27" class="th">FastAPI <tspan class="code" font-size="11px">fastapi</tspan></text>
    <text x="580" y="27" class="th">Django <tspan class="code" font-size="11px">django</tspan></text>

    <!-- Row 1: Category -->
    <line x1="0" y1="44" x2="880" y2="44" class="row-border" />
    <text x="24" y="72" class="td-dim">Category</text>
    <text x="260" y="72" class="td-val">Web Backend Framework</text>
    <text x="580" y="72" class="td-val">Full-Stack Web Framework</text>

    <!-- Row 2: Ecosystem & Difficulty -->
    <line x1="0" y1="90" x2="880" y2="90" class="row-border" />
    <rect y="91" width="880" height="45" class="row-alt" />
    <text x="24" y="118" class="td-dim">Ecosystem / Difficulty</text>
    <text x="260" y="118" class="td-val">Python • Beginner friendly</text>
    <text x="580" y="118" class="td-val">Python • Intermediate</text>

    <!-- Row 3: Trust Tier & Downloads -->
    <line x1="0" y1="136" x2="880" y2="136" class="row-border" />
    <text x="24" y="164" class="td-dim">Trust Tier &amp; Downloads</text>
    <g transform="translate(260, 150)">
      <rect width="80" height="20" class="badge-verified" />
      <text x="8" y="14" class="badge-text">✅ Verified</text>
      <text x="95" y="14" class="td-val">18.5M/week</text>
    </g>
    <g transform="translate(580, 150)">
      <rect width="80" height="20" class="badge-verified" />
      <text x="8" y="14" class="badge-text">✅ Verified</text>
      <text x="95" y="14" class="td-val">6.2M/week</text>
    </g>

    <!-- Row 4: Core Strengths -->
    <line x1="0" y1="182" x2="880" y2="182" class="row-border" />
    <rect y="183" width="880" height="55" class="row-alt" />
    <text x="24" y="212" class="td-dim">Key Strengths</text>
    <text x="260" y="206" class="td-val">High async performance via Starlette &amp; Pydantic;</text>
    <text x="260" y="224" class="td-val">automatic OpenAPI / Swagger documentation.</text>
    <text x="580" y="206" class="td-val">"Batteries-included" with built-in ORM, admin</text>
    <text x="580" y="224" class="td-val">panel, auth system, and migrations engine.</text>

    <!-- Row 5: Architectural Caveats -->
    <line x1="0" y1="238" x2="880" y2="238" class="row-border" />
    <text x="24" y="268" class="td-dim">Tradeoffs &amp; Caveats</text>
    <text x="260" y="262" class="td-val">Requires manual choice of ORM (SQLAlchemy)</text>
    <text x="260" y="280" class="td-val">and authentication architecture.</text>
    <text x="580" y="262" class="td-val">Heavier footprint; async support is retrofitted</text>
    <text x="580" y="280" class="td-val">compared to native ASGI frameworks.</text>

    <!-- Row 6: Companion Ecosystem -->
    <line x1="0" y1="294" x2="880" y2="294" class="row-border" />
    <rect y="295" width="880" height="50" class="row-alt" />
    <text x="24" y="324" class="td-dim">Works Well With</text>
    <text x="260" y="324" class="code">pydantic, sqlmodel, uvicorn</text>
    <text x="580" y="324" class="code">django-rest-framework, celery</text>

    <!-- Row 7: Actions -->
    <line x1="0" y1="345" x2="880" y2="345" class="row-border" />
    <text x="24" y="380" class="td-dim">Terminal Install</text>
    <g transform="translate(260, 362)">
      <rect width="140" height="28" class="btn-install" />
      <text x="12" y="18" class="btn-text">📥 pip install fastapi</text>
    </g>
    <g transform="translate(580, 362)">
      <rect width="140" height="28" class="btn-install" />
      <text x="12" y="18" class="btn-text">📥 pip install django</text>
    </g>
  </g>
</svg>`;

// 3. CodeLens Triggers SVG
const codelensSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" width="960" height="620">
  <defs>
    <style>
      .bg { fill: #18181b; }
      .editor { fill: #1e1e1e; }
      .tab-active { fill: #1e1e1e; }
      .tab-inactive { fill: #2d2d2d; }
      .gutter { fill: #1e1e1e; }
      .line-num { font-family: 'Cascadia Code', Consolas, monospace; font-size: 13px; fill: #6e7681; }
      .code { font-family: 'Cascadia Code', Consolas, monospace; font-size: 13px; fill: #d4d4d4; }
      .kwd { fill: #569cd6; font-weight: 600; }
      .str { fill: #ce9178; }
      .comment { fill: #6a9955; font-style: italic; }
      .func { fill: #dcdcaa; }
      .type { fill: #4ec9b0; }
      .codelens { font-family: -apple-system, sans-serif; font-size: 11px; fill: #38bdf8; font-weight: 500; cursor: pointer; }
      .codelens-box { fill: #0f172a; stroke: #0284c7; stroke-width: 1; rx: 4; }
      .banner { fill: #27272a; stroke: #3f3f46; stroke-width: 1; rx: 6; }
    </style>
  </defs>

  <rect class="bg" width="960" height="620" rx="10" />

  <!-- Window Bar -->
  <rect fill="#09090b" width="960" height="38" rx="10" />
  <circle cx="20" cy="19" r="6" fill="#ef4444" />
  <circle cx="38" cy="19" r="6" fill="#f59e0b" />
  <circle cx="56" cy="19" r="6" fill="#10b981" />
  <text x="480" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">SkillForge — Multi-Language Inline CodeLens Triggers</text>

  <!-- Top Explanation Banner -->
  <g transform="translate(40, 50)">
    <rect width="880" height="54" class="banner" />
    <text x="20" y="24" font-family="-apple-system, sans-serif" font-size="13px" font-weight="700" fill="#f4f4f5">💡 Zero Context Switching: Comment-Driven Tool Discovery</text>
    <text x="20" y="44" font-family="-apple-system, sans-serif" font-size="12px" fill="#a1a1aa">Type a natural language comment in any file. SkillForge detects C-style (//) and Python (#) syntax and renders clickable CodeLenses.</text>
  </g>

  <!-- Editor Window 1: TypeScript (Left) -->
  <g transform="translate(40, 120)">
    <rect width="425" height="460" class="editor" rx="6" />
    <!-- Tab Bar -->
    <rect width="425" height="35" fill="#252526" rx="6" />
    <rect width="160" height="35" class="tab-active" />
    <text x="24" y="22" font-family="-apple-system, sans-serif" font-size="12px" fill="#ffffff">📄 chat-service.ts</text>

    <!-- Gutter -->
    <line x1="45" y1="35" x2="45" y2="460" stroke="#2d2d2d" stroke-width="1" />
    <text x="18" y="70" class="line-num">1</text>
    <text x="18" y="95" class="line-num">2</text>
    <text x="18" y="120" class="line-num">3</text>
    <text x="18" y="145" class="line-num">4</text>
    <text x="18" y="170" class="line-num">5</text>
    <text x="18" y="195" class="line-num">6</text>
    <text x="18" y="220" class="line-num">7</text>
    <text x="18" y="245" class="line-num">8</text>

    <!-- Code Content -->
    <text x="60" y="70" class="code"><tspan class="kwd">import</tspan> { createServer } <tspan class="kwd">from</tspan> <tspan class="str">'http'</tspan>;</text>
    
    <!-- CodeLens 1 -->
    <g transform="translate(60, 83)">
      <rect width="320" height="18" class="codelens-box" />
      <text x="8" y="13" class="codelens">✨ SkillForge: Suggest libraries for "real-time chat with ws"</text>
    </g>
    <text x="60" y="120" class="code"><tspan class="comment">// IDEA: real-time chat with websockets</tspan></text>
    <text x="60" y="145" class="code"><tspan class="kwd">export class</tspan> <tspan class="type">ChatGateway</tspan> {</text>
    <text x="75" y="170" class="code"><tspan class="kwd">private</tspan> server = <tspan class="func">createServer</tspan>();</text>
    <text x="60" y="195" class="code">}</text>

    <!-- CodeLens 2 -->
    <g transform="translate(60, 218)">
      <rect width="300" height="18" class="codelens-box" />
      <text x="8" y="13" class="codelens">✨ SkillForge: Suggest libraries for "schema validation"</text>
    </g>
    <text x="60" y="245" class="code"><tspan class="comment">// SKILL: runtime schema validation for api</tspan></text>
  </g>

  <!-- Editor Window 2: Python (Right) -->
  <g transform="translate(495, 120)">
    <rect width="425" height="460" class="editor" rx="6" />
    <!-- Tab Bar -->
    <rect width="425" height="35" fill="#252526" rx="6" />
    <rect width="150" height="35" class="tab-active" />
    <text x="24" y="22" font-family="-apple-system, sans-serif" font-size="12px" fill="#ffffff">🐍 database.py</text>

    <!-- Gutter -->
    <line x1="45" y1="35" x2="45" y2="460" stroke="#2d2d2d" stroke-width="1" />
    <text x="18" y="70" class="line-num">1</text>
    <text x="18" y="95" class="line-num">2</text>
    <text x="18" y="120" class="line-num">3</text>
    <text x="18" y="145" class="line-num">4</text>
    <text x="18" y="170" class="line-num">5</text>
    <text x="18" y="195" class="line-num">6</text>
    <text x="18" y="220" class="line-num">7</text>

    <!-- Code Content -->
    <text x="60" y="70" class="code"><tspan class="kwd">import</tspan> asyncio</text>

    <!-- Python CodeLens 1 -->
    <g transform="translate(60, 83)">
      <rect width="330" height="18" class="codelens-box" />
      <text x="8" y="13" class="codelens">✨ SkillForge: Suggest libraries for "async postgres pool"</text>
    </g>
    <text x="60" y="120" class="code"><tspan class="comment"># IDEA: async postgres connection pool with alembic</tspan></text>
    <text x="60" y="145" class="code"><tspan class="kwd">async def</tspan> <tspan class="func">init_db_pool</tspan>():</text>
    <text x="85" y="170" class="code"><tspan class="kwd">pass</tspan></text>

    <!-- Python Floor Division (NOT CodeLens) -->
    <text x="60" y="205" class="code"><tspan class="comment"># Safe against floor division operators:</tspan></text>
    <text x="60" y="230" class="code">batch_size = total_items // num_workers</text>
  </g>
</svg>`;

// 4. Agent Directives SVG
const agentDirectivesSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 620" width="960" height="620">
  <defs>
    <style>
      .bg { fill: #18181b; }
      .card { fill: #1f1f23; stroke: #27272a; stroke-width: 1; rx: 8; }
      .title { font-family: -apple-system, sans-serif; font-size: 16px; font-weight: 700; fill: #f4f4f5; }
      .code-box { fill: #0f172a; stroke: #1e293b; stroke-width: 1; rx: 6; }
      .code { font-family: 'Cascadia Code', Consolas, monospace; font-size: 12px; fill: #e2e8f0; }
      .yaml-key { fill: #38bdf8; font-weight: 600; }
      .yaml-val { fill: #fcd34d; }
      .md-h1 { fill: #a78bfa; font-weight: 700; }
      .md-h2 { fill: #ec4899; font-weight: 700; }
      .md-bullet { fill: #34d399; font-weight: 600; }
      .badge { fill: #581c87; stroke: #9333ea; rx: 4; }
      .badge-text { font-family: -apple-system, sans-serif; font-size: 11px; font-weight: 700; fill: #c084fc; }
    </style>
  </defs>

  <rect class="bg" width="960" height="620" rx="10" />

  <!-- Window Bar -->
  <rect fill="#09090b" width="960" height="38" rx="10" />
  <circle cx="20" cy="19" r="6" fill="#ef4444" />
  <circle cx="38" cy="19" r="6" fill="#f59e0b" />
  <circle cx="56" cy="19" r="6" fill="#10b981" />
  <text x="480" y="24" text-anchor="middle" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">SkillForge — Agent Skill Directive Generator (Karpathy Coding Disciplines)</text>

  <!-- Header -->
  <text x="40" y="75" class="title">🤖 1-Click Agent Skill Directives (.agent/skills/SKILL.md &amp; .cursor/rules)</text>
  <text x="40" y="95" font-family="-apple-system, sans-serif" font-size="12px" fill="#71717a">Automate AI coding agent behavior. Generates structured operational rules and bash verification protocols.</text>

  <!-- Directive Preview Box -->
  <g transform="translate(40, 115)">
    <rect width="880" height="470" class="code-box" />

    <!-- File Path Bar -->
    <rect width="880" height="32" fill="#1e293b" rx="6" />
    <text x="20" y="21" font-family="'Cascadia Code', monospace" font-size="12px" fill="#94a3b8">📁 Target: .agent/skills/zod/SKILL.md (Supports Claude Code, Antigravity, Cursor, Windsurf)</text>

    <!-- Frontmatter -->
    <text x="24" y="60" class="code"><tspan fill="#64748b">---</tspan></text>
    <text x="24" y="80" class="code"><tspan class="yaml-key">name:</tspan> <tspan class="yaml-val">zod</tspan></text>
    <text x="24" y="100" class="code"><tspan class="yaml-key">description:</tspan> <tspan class="yaml-val">TypeScript-first schema validation with static type inference</tspan></text>
    <text x="24" y="120" class="code"><tspan class="yaml-key">triggers:</tspan> <tspan fill="#64748b">[zod, schema-validation, input-sanitization, typescript]</tspan></text>
    <text x="24" y="140" class="code"><tspan class="yaml-key">official_docs:</tspan> <tspan class="yaml-val">"https://zod.dev"</tspan></text>
    <text x="24" y="160" class="code"><tspan fill="#64748b">---</tspan></text>

    <!-- Header 1 -->
    <text x="24" y="195" class="code"><tspan class="md-h1"># SkillForge Agent Directive: Zod</tspan></text>

    <!-- Karpathy Disciplines Section -->
    <text x="24" y="225" class="code"><tspan class="md-h2">## 2. Operational Rules &amp; Andrej Karpathy Coding Disciplines</tspan></text>
    
    <text x="24" y="255" class="code"><tspan class="md-bullet">1. Think Before Coding:</tspan> Inspect existing types &amp; schemas before writing changes.</text>
    <text x="24" y="280" class="code"><tspan class="md-bullet">2. Simplicity &amp; Minimal Surface Area:</tspan> Do not introduce premature abstractions or wrappers.</text>
    <text x="24" y="305" class="code"><tspan class="md-bullet">3. Surgical Precision:</tspan> Make targeted modifications; preserve existing docstrings &amp; tests.</text>
    <text x="24" y="330" class="code"><tspan class="md-bullet">4. Verification Rigor:</tspan> Validate using deterministic verification commands before completion.</text>

    <!-- Verification Commands Section -->
    <text x="24" y="365" class="code"><tspan class="md-h2">## 5. Verification Protocol (Deterministic Terminal Commands)</tspan></text>
    <g transform="translate(24, 380)">
      <rect width="400" height="50" fill="#020617" stroke="#334155" rx="4" />
      <text x="15" y="22" font-family="'Cascadia Code', monospace" font-size="12px" fill="#38bdf8"># Primary Verification</text>
      <text x="15" y="40" font-family="'Cascadia Code', monospace" font-size="12px" fill="#4ade80">pnpm test &amp;&amp; pnpm typecheck</text>
    </g>

    <text x="450" y="405" class="code" fill="#94a3b8">&gt; Standards: Zero regressions. Typecheck and unit tests must pass.</text>
  </g>
</svg>`;

fs.writeFileSync(path.join(targetDir, 'sidebar-overview.svg'), sidebarSvg);
fs.writeFileSync(path.join(targetDir, 'comparison-matrix.svg'), comparisonSvg);
fs.writeFileSync(path.join(targetDir, 'codelens-triggers.svg'), codelensSvg);
fs.writeFileSync(path.join(targetDir, 'agent-directives.svg'), agentDirectivesSvg);

console.log('Successfully generated 4 vector SVGs in resources/screenshots/');
