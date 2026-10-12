# SkillForge — Marketplace & Open VSX Deployment Guide

This guide details how to publish SkillForge to the **Visual Studio Marketplace** (for VS Code and Antigravity IDE users) and the **Open VSX Registry** (for VSCodium, Gitpod, Cursor, and open-source VS Code distributions).

---

## 🏛️ Prerequisites & Publisher Setup

Before your first release, you need to register a publisher identifier and obtain API tokens from both registries.

### 1. Visual Studio Marketplace (Microsoft)

1. Sign in to the [Visual Studio Marketplace Management Portal](https://marketplace.visualstudio.com/manage) using your Microsoft account.
2. Click **Create publisher**:
   - **ID**: `skillforge` (or your chosen unique organization handle, e.g. `your-name`).
   - **Name**: `SkillForge Team` (display name).
   - If your registered ID differs from `skillforge`, update `"publisher": "<YOUR_ID>"` in [`packages/vscode-client/package.json`](./packages/vscode-client/package.json).
3. Generate a Personal Access Token (PAT) via [Azure DevOps](https://dev.azure.com/):
   - Click **User settings** (top-right gear icon) $\to$ **Personal access tokens** $\to$ **+ New Token**.
   - **Organization**: Select `All accessible organizations`.
   - **Expiration**: Set desired duration (e.g., 90 or 180 days).
   - **Scopes**: Click *Show all scopes* at the bottom, find **Marketplace**, and select **Acquire** and **Manage**.
   - Copy the generated token immediately.

---

### 2. Open VSX Registry (Eclipse Foundation)

1. Sign in to [Open VSX](https://open-vsx.org/) using your GitHub or Eclipse account.
2. Create or verify a namespace matching your publisher ID (e.g. `skillforge`):
   - Go to **User Settings** $\to$ **Namespaces** $\to$ Claim or create the namespace.
3. Generate an access token:
   - Go to [Open VSX Token Settings](https://open-vsx.org/user-settings/tokens).
   - Generate a new Personal Access Token with publishing permissions and copy it.

---

## 🔐 GitHub Secrets Configuration

Add your generated publishing tokens to your GitHub repository so the automated release pipeline can publish on tag pushes:

1. Navigate to your GitHub repository: **Settings** $\to$ **Secrets and variables** $\to$ **Actions**.
2. Click **New repository secret** and add:
   - `VSCE_PAT`: Your Azure DevOps Personal Access Token (for VS Code Marketplace).
   - `OVSX_PAT`: Your Open VSX Access Token (for Open VSX Registry).

---

## 🚀 Releasing a New Version (Automated via GitHub Actions)

The release workflow ([`.github/workflows/release.yml`](./.github/workflows/release.yml)) is completely automated:

1. **Bump Version**: Ensure [`packages/vscode-client/package.json`](./packages/vscode-client/package.json) has the target version (e.g. `"0.1.0"`):
   ```bash
   # In packages/vscode-client/package.json
   "version": "0.1.0"
   ```

2. **Commit and Tag**:
   ```bash
   git add .
   git commit -m "chore(release): prepare v0.1.0"
   git tag v0.1.0
   git push origin main
   git push origin v0.1.0
   ```

3. **Workflow Execution**:
   - GitHub Actions verifies that the git tag (`v0.1.0`) strictly matches the version in `packages/vscode-client/package.json`.
   - Runs full verification gates (`pnpm typecheck`, `pnpm test`, `pnpm build`).
   - Packages `skillforge-0.1.0.vsix` with zero unbundled dependencies.
   - Publishes to VS Code Marketplace using `VSCE_PAT`.
   - Publishes to Open VSX Registry using `OVSX_PAT`.
   - Creates a GitHub Release and attaches the `.vsix` installer binary for direct manual downloads.

---

## 🛠️ Manual CLI Publishing (Local Fallback)

If you prefer to publish directly from your local terminal without pushing a git tag:

### 1. Build and Package VSIX
```bash
pnpm package
```
This generates `packages/vscode-client/skillforge-<version>.vsix`.

### 2. Publish to Visual Studio Marketplace
```bash
# Using root shortcut:
$env:VSCE_PAT="your-azure-devops-pat"
npx @vscode/vsce publish --packagePath packages/vscode-client/skillforge-0.1.0.vsix -p $env:VSCE_PAT
```

### 3. Publish to Open VSX Registry
```bash
$env:OVSX_PAT="your-open-vsx-pat"
npx ovsx publish packages/vscode-client/skillforge-0.1.0.vsix -p $env:OVSX_PAT
```

---

## 📦 VSIX Size & Bundle Audit

SkillForge bundles its headless LSP server, all 363 curated skills, and its webview assets into a compact package:
- Target package size: $< 350\text{ KB}$ (actual: $\approx 274\text{ KB}$).
- All TypeScript source files, test fixtures, and intermediate build info are excluded via [`packages/vscode-client/.vscodeignore`](./packages/vscode-client/.vscodeignore).
- The package audit in CI automatically asserts that package size is below $1.5\text{ MB}$ and that raw `src/` files are never distributed.
