Add-Type -AssemblyName System.Drawing

$targetDir = Join-Path $PSScriptRoot "..\resources\screenshots"
if (!(Test-Path $targetDir)) {
    New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
}

function Create-RoundedRectanglePath {
    param(
        [float]$x,
        [float]$y,
        [float]$width,
        [float]$height,
        [float]$radius
    )
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $diameter = $radius * 2
    $path.AddArc($x, $y, $diameter, $diameter, 180, 90)
    $path.AddArc($x + $width - $diameter, $y, $diameter, $diameter, 270, 90)
    $path.AddArc($x + $width - $diameter, $y + $height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($x, $y + $height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function Draw-WindowFrame {
    param($g, $width, $height, $title)
    $titleBarBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 9, 9, 11))
    $g.FillRectangle($titleBarBrush, 0, 0, $width, 38)
    $titleBarBrush.Dispose()

    $red = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 239, 68, 68))
    $yellow = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 245, 158, 11))
    $green = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))

    $g.FillEllipse($red, 20, 13, 12, 12)
    $g.FillEllipse($yellow, 38, 13, 12, 12)
    $g.FillEllipse($green, 56, 13, 12, 12)

    $red.Dispose(); $yellow.Dispose(); $green.Dispose()

    $font = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 161, 161, 170))
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString($title, $font, $brush, ($width / 2), 10, $sf)
    $font.Dispose(); $brush.Dispose(); $sf.Dispose()
}

# -------------------------------------------------------------
# 1. SIDEBAR OVERVIEW PNG
# -------------------------------------------------------------
$bmp1 = New-Object System.Drawing.Bitmap 960, 620
$g1 = [System.Drawing.Graphics]::FromImage($bmp1)
$g1.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g1.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g1.Clear([System.Drawing.Color]::FromArgb(255, 24, 24, 27))

Draw-WindowFrame $g1 960 620 "SkillForge — Activity Bar & Workspace Context Scoping (VS Code)"

# Activity bar (Far left)
$barBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 18, 18, 20))
$g1.FillRectangle($barBrush, 0, 38, 54, 582)
$barBrush.Dispose()

# Active bar marker
$activeMarker = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$g1.FillRectangle($activeMarker, 0, 96, 3, 36)
$activeMarker.Dispose()

# Sidebar
$sidebarBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 31, 31, 35))
$g1.FillRectangle($sidebarBrush, 54, 38, 320, 582)
$sidebarBrush.Dispose()

$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 39, 39, 42), 1)
$g1.DrawLine($borderPen, 374, 38, 374, 620)

# Sidebar Header
$fHeader = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$bMuted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 161, 161, 170))
$g1.DrawString("SKILLFORGE: DEVELOPER COMPASS", $fHeader, $bMuted, 72, 55)

# Card 1: Context & Stack
$cardBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 39, 39, 42))
$fTitle = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$fBody = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$fCode = New-Object System.Drawing.Font("Consolas", 9, [System.Drawing.FontStyle]::Regular)
$bWhite = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 244, 244, 245))
$bCyan = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))

$p1 = Create-RoundedRectanglePath 64 78 300 115 6
$g1.FillPath($cardBrush, $p1); $g1.DrawPath($borderPen, $p1); $p1.Dispose()
$g1.DrawString("📦 Context & Stack", $fTitle, $bWhite, 76, 88)
$g1.DrawString("Scope: Entire Workspace", $fBody, $bWhite, 76, 110)
$g1.DrawString("Ecosystems: TypeScript, Python, Rust", $fBody, $bMuted, 76, 130)
$g1.DrawString("Manifests: package.json, pyproject.toml", $fBody, $bMuted, 76, 150)
$badgeBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 6, 78, 59))
$badgePen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 5, 150, 105), 1)
$fBadge = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$bGreen = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 52, 211, 153))
$g1.FillRectangle($badgeBrush, 76, 168, 85, 18); $g1.DrawRectangle($badgePen, 76, 168, 85, 18)
$g1.DrawString("✓ 36 Installed", $fBadge, $bGreen, 82, 170)

# Card 2: Quick Actions
$p2 = Create-RoundedRectanglePath 64 205 300 105 6
$g1.FillPath($cardBrush, $p2); $g1.DrawPath($borderPen, $p2); $p2.Dispose()
$g1.DrawString("⚡ Quick Actions", $fTitle, $bWhite, 76, 215)
$btnBlue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 59, 130, 246))
$g1.FillRectangle($btnBlue, 76, 238, 130, 24)
$g1.DrawString("✨ Suggest for Idea", $fBadge, $bWhite, 86, 242)
$btnGray = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 63, 63, 70))
$g1.FillRectangle($btnGray, 214, 238, 136, 24)
$g1.DrawString("⚖️ Compare Tools", $fBadge, $bWhite, 224, 242)
$g1.DrawString("Shortcuts: Ctrl+Alt+S / Cmd+Alt+S", $fBody, $bMuted, 76, 275)

# Card 3: All Commands
$p3 = Create-RoundedRectanglePath 64 322 300 120 6
$g1.FillPath($cardBrush, $p3); $g1.DrawPath($borderPen, $p3); $p3.Dispose()
$g1.DrawString("🛠️ All Commands (16 Available)", $fTitle, $bWhite, 76, 332)
$g1.DrawString("• Suggest for Current File (Ctrl+Alt+F)", $fBody, $bWhite, 76, 355)
$g1.DrawString("• Select Scope Directory", $fBody, $bWhite, 76, 375)
$g1.DrawString("• Generate AI Agent Skill (SKILL.md)", $fBody, $bWhite, 76, 395)
$g1.DrawString("• Configure BYOK API Key (Gemini/OpenAI)", $fBody, $bMuted, 76, 415)

# Card 4: Bookmarks
$p4 = Create-RoundedRectanglePath 64 452 300 148 6
$g1.FillPath($cardBrush, $p4); $g1.DrawPath($borderPen, $p4); $p4.Dispose()
$g1.DrawString("⭐ Saved Bookmarks", $fTitle, $bWhite, 76, 462)
$g1.DrawString("⭐ zustand — State Management", $fBody, $bWhite, 76, 485)
$g1.DrawString("⭐ fastapi — Web Backend Framework", $fBody, $bWhite, 76, 505)
$g1.DrawString("⭐ shadcn-ui — React UI Components", $fBody, $bWhite, 76, 525)
$g1.DrawString("🕒 Recent: 'state management for react'", $fBody, $bMuted, 76, 560)

# Right Panel Preview: Canvas
$pCanvHeader = Create-RoundedRectanglePath 395 55 545 65 8
$g1.FillPath($cardBrush, $pCanvHeader); $g1.DrawPath($borderPen, $pCanvHeader); $pCanvHeader.Dispose()
$fCanvTitle = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$g1.DrawString("🎯 Recommended Libraries for 'state management'", $fCanvTitle, $bWhite, 410, 68)
$g1.DrawString("Curated offline search across 363 vetted developer tools • 0ms latency", $fBody, $bMuted, 410, 94)

# Canvas Card 1: Zustand
$pCard1 = Create-RoundedRectanglePath 395 135 545 130 8
$g1.FillPath($cardBrush, $pCard1); $g1.DrawPath($borderPen, $pCard1); $pCard1.Dispose()
$fCardName = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$g1.DrawString("1. Zustand (zustand)", $fCardName, $bWhite, 410, 148)
$g1.FillRectangle($badgeBrush, 825, 148, 95, 20); $g1.DrawRectangle($badgePen, 825, 148, 95, 20)
$g1.DrawString("✅ Verified Tier", $fBadge, $bGreen, 835, 151)
$g1.DrawString("A small, fast, and scalable bearbones state management solution using simplified flux principles.", $fBody, $bWhite, 410, 175)
$g1.DrawString("Works well with: react, nextjs, typescript • Alternatives: jotai, recoil, redux", $fBody, $bMuted, 410, 200)
$btnInst = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 16, 185, 129))
$g1.FillRectangle($btnInst, 410, 225, 130, 25)
$g1.DrawString("📥 pnpm add zustand", $fBadge, $bWhite, 418, 230)
$btnDirect = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 99, 102, 241))
$g1.FillRectangle($btnDirect, 550, 225, 130, 25)
$g1.DrawString("🤖 Agent Directive", $fBadge, $bWhite, 560, 230)

# Canvas Card 2: TanStack Query
$pCard2 = Create-RoundedRectanglePath 395 280 545 130 8
$g1.FillPath($cardBrush, $pCard2); $g1.DrawPath($borderPen, $pCard2); $pCard2.Dispose()
$g1.DrawString("2. TanStack Query (@tanstack/react-query)", $fCardName, $bWhite, 410, 293)
$g1.FillRectangle($badgeBrush, 825, 293, 95, 20); $g1.DrawRectangle($badgePen, 825, 293, 95, 20)
$g1.DrawString("✅ Verified Tier", $fBadge, $bGreen, 835, 296)
$g1.DrawString("Powerful asynchronous state management for server state synchronization and background refetching.", $fBody, $bWhite, 410, 320)
$g1.DrawString("Works well with: react, vue, nextjs • Weekly Downloads: 4.2M", $fBody, $bMuted, 410, 345)
$g1.FillRectangle($btnInst, 410, 370, 180, 25)
$g1.DrawString("📥 pnpm add @tanstack/react-query", $fBadge, $bWhite, 418, 375)

# Privacy Banner
$bPrivBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
$pPriv = Create-RoundedRectanglePath 395 435 545 60 8
$g1.FillPath($bPrivBg, $pPriv); $g1.DrawPath($borderPen, $pPriv); $pPriv.Dispose()
$g1.DrawString("🔒 100% Offline & Private by Default", $fTitle, $bCyan, 410, 445)
$g1.DrawString("Zero source code leaves your machine. Inverted index executes with <2ms latency.", $fBody, $bMuted, 410, 468)

$bmp1.Save((Join-Path $targetDir "sidebar-overview.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g1.Dispose(); $bmp1.Dispose()


# -------------------------------------------------------------
# 2. COMPARISON MATRIX PNG
# -------------------------------------------------------------
$bmp2 = New-Object System.Drawing.Bitmap 960, 620
$g2 = [System.Drawing.Graphics]::FromImage($bmp2)
$g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g2.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g2.Clear([System.Drawing.Color]::FromArgb(255, 24, 24, 27))

Draw-WindowFrame $g2 960 620 "SkillForge — Side-by-Side Architectural Comparison Matrix"

$fMatrixTitle = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$g2.DrawString("⚖️ Side-by-Side Comparison: FastAPI vs Django", $fMatrixTitle, $bWhite, 40, 52)
$g2.DrawString("Head-to-head architectural analysis across maintainability, conflict risk, and production tradeoffs.", $fBody, $bMuted, 40, 78)

# Warning Banner
$warnBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 69, 26, 3))
$warnPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 180, 83, 9), 1)
$bWarn = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 252, 211, 77))
$pWarn = Create-RoundedRectanglePath 40 102 880 36 6
$g2.FillPath($warnBg, $pWarn); $g2.DrawPath($warnPen, $pWarn); $pWarn.Dispose()
$g2.DrawString("⚠️ Architectural Conflict: Both packages occupy the primary Python Web API backend slot. Pick one for clean architecture.", $fBadge, $bWarn, 55, 112)

# Table Box
$tableBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 31, 31, 35))
$pTable = Create-RoundedRectanglePath 40 150 880 435 8
$g2.FillPath($tableBg, $pTable); $g2.DrawPath($borderPen, $pTable); $pTable.Dispose()

# Header Row
$g2.FillRectangle($cardBrush, 40, 150, 880, 42)
$g2.DrawString("Dimension", $fTitle, $bWhite, 60, 162)
$g2.DrawString("FastAPI (fastapi)", $fTitle, $bCyan, 280, 162)
$g2.DrawString("Django (django)", $fTitle, $bCyan, 600, 162)

# Row 1: Category
$g2.DrawLine($borderPen, 40, 192, 920, 192)
$g2.DrawString("Category", $fBody, $bMuted, 60, 204)
$g2.DrawString("Web Backend Framework", $fBody, $bWhite, 280, 204)
$g2.DrawString("Full-Stack Web Framework", $fBody, $bWhite, 600, 204)

# Row 2: Ecosystem & Difficulty (Alt row)
$rowAlt = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 34, 34, 38))
$g2.FillRectangle($rowAlt, 40, 230, 880, 38)
$g2.DrawLine($borderPen, 40, 230, 920, 230)
$g2.DrawString("Ecosystem / Difficulty", $fBody, $bMuted, 60, 240)
$g2.DrawString("Python • Beginner friendly", $fBody, $bWhite, 280, 240)
$g2.DrawString("Python • Intermediate", $fBody, $bWhite, 600, 240)

# Row 3: Trust Tier & Downloads
$g2.DrawLine($borderPen, 40, 268, 920, 268)
$g2.DrawString("Trust Tier & Downloads", $fBody, $bMuted, 60, 280)
$g2.FillRectangle($badgeBrush, 280, 278, 80, 20); $g2.DrawRectangle($badgePen, 280, 278, 80, 20)
$g2.DrawString("✅ Verified", $fBadge, $bGreen, 286, 281)
$g2.DrawString("18.5M/week", $fBody, $bWhite, 370, 280)
$g2.FillRectangle($badgeBrush, 600, 278, 80, 20); $g2.DrawRectangle($badgePen, 600, 278, 80, 20)
$g2.DrawString("✅ Verified", $fBadge, $bGreen, 606, 281)
$g2.DrawString("6.2M/week", $fBody, $bWhite, 690, 280)

# Row 4: Strengths (Alt row)
$g2.FillRectangle($rowAlt, 40, 308, 880, 50)
$g2.DrawLine($borderPen, 40, 308, 920, 308)
$g2.DrawString("Core Strengths", $fBody, $bMuted, 60, 320)
$g2.DrawString("High async speed; automatic OpenAPI docs; native Pydantic validation.", $fBody, $bWhite, 280, 320)
$g2.DrawString("Batteries-included: ORM, admin portal, auth, and schema migrations.", $fBody, $bWhite, 600, 320)

# Row 5: Tradeoffs & Caveats
$g2.DrawLine($borderPen, 40, 358, 920, 358)
$g2.DrawString("Tradeoffs & Caveats", $fBody, $bMuted, 60, 375)
$g2.DrawString("Requires manual choices for ORM, migrations, and authentication architecture.", $fBody, $bWhite, 280, 375)
$g2.DrawString("Heavier footprint; async is retrofitted compared to native ASGI frameworks.", $fBody, $bWhite, 600, 375)

# Row 6: Companion Stack (Alt row)
$g2.FillRectangle($rowAlt, 40, 410, 880, 42)
$g2.DrawLine($borderPen, 40, 410, 920, 410)
$g2.DrawString("Works Well With", $fBody, $bMuted, 60, 422)
$g2.DrawString("pydantic, sqlmodel, uvicorn, alembic", $fCode, $bCyan, 280, 422)
$g2.DrawString("django-rest-framework, celery, postgresql", $fCode, $bCyan, 600, 422)

# Row 7: Direct Install Action
$g2.DrawLine($borderPen, 40, 452, 920, 452)
$g2.DrawString("One-Click Install", $fBody, $bMuted, 60, 480)
$g2.FillRectangle($btnInst, 280, 472, 160, 30)
$g2.DrawString("📥 pip install fastapi", $fTitle, $bWhite, 292, 478)
$g2.FillRectangle($btnInst, 600, 472, 160, 30)
$g2.DrawString("📥 pip install django", $fTitle, $bWhite, 612, 478)

$bmp2.Save((Join-Path $targetDir "comparison-matrix.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g2.Dispose(); $bmp2.Dispose()


# -------------------------------------------------------------
# 3. CODELENS TRIGGERS PNG
# -------------------------------------------------------------
$bmp3 = New-Object System.Drawing.Bitmap 960, 620
$g3 = [System.Drawing.Graphics]::FromImage($bmp3)
$g3.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g3.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g3.Clear([System.Drawing.Color]::FromArgb(255, 24, 24, 27))

Draw-WindowFrame $g3 960 620 "SkillForge — Inline Multi-Language CodeLens Triggers"

# Top Banner
$pBanner = Create-RoundedRectanglePath 40 50 880 48 6
$g3.FillPath($cardBrush, $pBanner); $g3.DrawPath($borderPen, $pBanner); $pBanner.Dispose()
$g3.DrawString("💡 Zero Context Switching: Comment-Driven Tool Discovery", $fTitle, $bWhite, 55, 58)
$g3.DrawString("Type a natural language comment in any file. SkillForge detects C-style (//) and Python (#) triggers and renders clickable prompts.", $fBody, $bMuted, 55, 76)

# Editor 1 (Left - TypeScript)
$editorBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 30, 30))
$pEd1 = Create-RoundedRectanglePath 40 110 425 470 6
$g3.FillPath($editorBg, $pEd1); $g3.DrawPath($borderPen, $pEd1); $pEd1.Dispose()
$g3.FillRectangle($barBrush, 40, 110, 425, 32)
$g3.DrawString("📄 chat-service.ts", $fBody, $bWhite, 55, 118)

# Code lines TypeScript
$fEditorCode = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)
$bEditorKwd = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 86, 156, 214))
$bEditorStr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 206, 145, 120))
$bEditorCom = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 106, 153, 85))
$bEditorLens = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$lensBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 15, 23, 42))
$lensPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 2, 132, 199), 1)

$g3.DrawString("1", $fEditorCode, $bMuted, 50, 155)
$g3.DrawString("import { createServer } from 'http';", $fEditorCode, $bWhite, 75, 155)

# CodeLens Prompt 1
$g3.FillRectangle($lensBg, 75, 185, 370, 20); $g3.DrawRectangle($lensPen, 75, 185, 370, 20)
$g3.DrawString("✨ SkillForge: Suggest libraries for 'real-time chat with ws'", $fBadge, $bEditorLens, 80, 188)

$g3.DrawString("2", $fEditorCode, $bMuted, 50, 215)
$g3.DrawString("// IDEA: real-time chat with websockets", $fEditorCode, $bEditorCom, 75, 215)
$g3.DrawString("3", $fEditorCode, $bMuted, 50, 240)
$g3.DrawString("export class ChatGateway {", $fEditorCode, $bWhite, 75, 240)
$g3.DrawString("4", $fEditorCode, $bMuted, 50, 265)
$g3.DrawString("  private server = createServer();", $fEditorCode, $bWhite, 75, 265)
$g3.DrawString("5", $fEditorCode, $bMuted, 50, 290)
$g3.DrawString("}", $fEditorCode, $bWhite, 75, 290)

# CodeLens Prompt 2
$g3.FillRectangle($lensBg, 75, 330, 360, 20); $g3.DrawRectangle($lensPen, 75, 330, 360, 20)
$g3.DrawString("✨ SkillForge: Suggest libraries for 'schema validation'", $fBadge, $bEditorLens, 80, 333)

$g3.DrawString("6", $fEditorCode, $bMuted, 50, 360)
$g3.DrawString("// SKILL: runtime schema validation for api", $fEditorCode, $bEditorCom, 75, 360)


# Editor 2 (Right - Python)
$pEd2 = Create-RoundedRectanglePath 495 110 425 470 6
$g3.FillPath($editorBg, $pEd2); $g3.DrawPath($borderPen, $pEd2); $pEd2.Dispose()
$g3.FillRectangle($barBrush, 495, 110, 425, 32)
$g3.DrawString("🐍 database.py", $fBody, $bWhite, 510, 118)

$g3.DrawString("1", $fEditorCode, $bMuted, 505, 155)
$g3.DrawString("import asyncio", $fEditorCode, $bWhite, 530, 155)

# Python CodeLens Prompt
$g3.FillRectangle($lensBg, 530, 185, 370, 20); $g3.DrawRectangle($lensPen, 530, 185, 370, 20)
$g3.DrawString("✨ SkillForge: Suggest libraries for 'async postgres pool'", $fBadge, $bEditorLens, 535, 188)

$g3.DrawString("2", $fEditorCode, $bMuted, 505, 215)
$g3.DrawString("# IDEA: async postgres connection pool with alembic", $fEditorCode, $bEditorCom, 530, 215)
$g3.DrawString("3", $fEditorCode, $bMuted, 505, 240)
$g3.DrawString("async def init_db_pool():", $fEditorCode, $bWhite, 530, 240)
$g3.DrawString("4", $fEditorCode, $bMuted, 505, 265)
$g3.DrawString("    pass", $fEditorCode, $bWhite, 530, 265)
$g3.DrawString("5", $fEditorCode, $bMuted, 505, 310)
$g3.DrawString("# Protected against floor division syntax errors:", $fEditorCode, $bMuted, 530, 310)
$g3.DrawString("6", $fEditorCode, $bMuted, 505, 335)
$g3.DrawString("chunk_size = total_records // worker_threads", $fEditorCode, $bWhite, 530, 335)

$bmp3.Save((Join-Path $targetDir "codelens-triggers.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g3.Dispose(); $bmp3.Dispose()


# -------------------------------------------------------------
# 4. AGENT DIRECTIVES PNG
# -------------------------------------------------------------
$bmp4 = New-Object System.Drawing.Bitmap 960, 620
$g4 = [System.Drawing.Graphics]::FromImage($bmp4)
$g4.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g4.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g4.Clear([System.Drawing.Color]::FromArgb(255, 24, 24, 27))

Draw-WindowFrame $g4 960 620 "SkillForge — Agent Skill Directive Generator (Karpathy Coding Disciplines)"

$g4.DrawString("🤖 1-Click Agent Skill Directives (.agent/skills/SKILL.md & .cursor/rules)", $fMatrixTitle, $bWhite, 40, 52)
$g4.DrawString("Automate AI coding agent behavior. Generates structured operational rules and bash verification protocols.", $fBody, $bMuted, 40, 78)

# Terminal / Code Container
$pTerm = Create-RoundedRectanglePath 40 105 880 480 8
$g4.FillPath($lensBg, $pTerm); $g4.DrawPath($lensPen, $pTerm); $pTerm.Dispose()

# File path bar
$termTitleBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 30, 41, 59))
$g4.FillRectangle($termTitleBrush, 40, 105, 880, 30)
$g4.DrawString("📁 Target File: .agent/skills/zod/SKILL.md (Supports Claude Code, Antigravity, Cursor, Windsurf)", $fCode, $bWhite, 55, 112)

# Markdown Directive Content
$bYamlKey = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 56, 189, 248))
$bYamlVal = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 252, 211, 77))
$bH1 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 167, 139, 250))
$bH2 = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 236, 72, 153))

$g4.DrawString("---", $fEditorCode, $bMuted, 60, 145)
$g4.DrawString("name: zod", $fEditorCode, $bYamlKey, 60, 165)
$g4.DrawString("description: TypeScript-first schema validation with static type inference", $fEditorCode, $bYamlVal, 60, 185)
$g4.DrawString("triggers: [zod, schema-validation, input-sanitization, typescript]", $fEditorCode, $bMuted, 60, 205)
$g4.DrawString("official_docs: 'https://zod.dev'", $fEditorCode, $bYamlVal, 60, 225)
$g4.DrawString("---", $fEditorCode, $bMuted, 60, 245)

$fH1 = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$g4.DrawString("# SkillForge Agent Directive: Zod", $fH1, $bH1, 60, 275)

$fH2 = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$g4.DrawString("## 2. Operational Rules & Andrej Karpathy Coding Disciplines", $fH2, $bH2, 60, 305)

$g4.DrawString("1. Think Before Coding: Inspect existing types and schemas before writing speculative code.", $fEditorCode, $bWhite, 60, 335)
$g4.DrawString("2. Simplicity & Minimal Surface Area: Do not introduce premature abstractions or wrappers.", $fEditorCode, $bWhite, 60, 360)
$g4.DrawString("3. Surgical Precision: Make targeted localized modifications; preserve comments and tests.", $fEditorCode, $bWhite, 60, 385)
$g4.DrawString("4. Verification Rigor: Validate using deterministic commands before claiming completion.", $fEditorCode, $bWhite, 60, 410)

$g4.DrawString("## 5. Verification Protocol (Deterministic Terminal Commands)", $fH2, $bH2, 60, 445)
$cmdBg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 2, 6, 23))
$cmdPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 51, 65, 85), 1)
$g4.FillRectangle($cmdBg, 60, 475, 420, 50); $g4.DrawRectangle($cmdPen, 60, 475, 420, 50)
$g4.DrawString("# Primary Verification Command", $fCode, $bCyan, 75, 482)
$g4.DrawString("pnpm test && pnpm typecheck", $fCode, $bGreen, 75, 500)

$g4.DrawString("> Standard: Zero regressions. Do not mark task complete if tests fail.", $fCode, $bMuted, 500, 495)

$bmp4.Save((Join-Path $targetDir "agent-directives.png"), [System.Drawing.Imaging.ImageFormat]::Png)
$g4.Dispose(); $bmp4.Dispose()

Write-Host "Successfully generated 4 high-resolution PNG screenshots in resources/screenshots/"
