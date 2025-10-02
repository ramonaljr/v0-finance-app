# Windows Build Guide

This document provides solutions for building the Next.js 14 application on Windows systems, addressing common issues with symlinks and JSON parsing during the build process.

## Problem Description

When using `output: 'standalone'` in `next.config.mjs`, Next.js attempts to create symlinks during the build process. Windows has strict symlink restrictions that can cause:

- `EPERM: operation not permitted, symlink` errors
- `SyntaxError: Unexpected end of JSON input` during tracing
- Build failures in `.next/standalone` directory creation

## Solution 1: Disable Standalone Output (Recommended)

The fastest solution is to disable `output: 'standalone'` in `next.config.mjs` on Windows systems.

### Changes Made

```javascript
// next.config.mjs
// Configure output for better handling of dynamic routes
// output: 'standalone', // Disabled on Windows to avoid symlink EPERM issues
```

### Why This Works

- Eliminates symlink creation entirely
- No Windows permission issues
- Faster build times
- Suitable for most deployment scenarios (Vercel, Docker, etc.)

## Solution 2: Enable Windows Symlinks

If you must use `output: 'standalone'`, enable Windows symlink support:

### Step 1: Enable Developer Mode

1. Open **Settings** → **Privacy & security** → **For developers**
2. Enable **Developer Mode**
3. Restart your computer if prompted

### Step 2: Run as Administrator

Open PowerShell or Command Prompt as Administrator and run:

```powershell
# Test symlink creation
New-Item -ItemType SymbolicLink -Path "$env:TEMP\linktest" -Target "$env:TEMP"

# If this fails, symlinks are still not enabled
# Build from admin shell:
pnpm build
```

### Step 3: Antivirus Exclusions

Windows Defender or other antivirus software may block symlink creation:

1. Open **Windows Security** → **Virus & threat protection** → **Manage settings**
2. Scroll to **Exclusions** → **Add or remove exclusions**
3. Add exclusions for:
   - `node.exe`
   - Your project directory (e.g., `C:\dev\v0-finance-app`)
   - `.next` build directory

### Step 4: Project Location

Ensure your project is not in a synced/locked directory:
- ❌ `C:\Users\Username\Desktop\project` (OneDrive/Desktop sync)
- ❌ `C:\Users\Username\OneDrive\project` (OneDrive sync)
- ✅ `C:\dev\project` (Local, non-synced location)

## Solution 3: WSL2 Alternative

For fully reproducible builds without Windows symlink restrictions:

### Setup WSL2

1. Install **WSL2** with Ubuntu from Microsoft Store
2. Place project in Linux filesystem: `/home/username/v0-finance-app`
3. Avoid Windows mounts (`/mnt/c/`) for build process

### Build in WSL2

```bash
corepack enable
pnpm install
pnpm build
```

## Build Verification

### Clean Commands

```bash
# Clean all build artifacts
pnpm dlx rimraf .next .turbo

# Clean pnpm store
pnpm store prune

# Fresh install
pnpm install --force
```

### JSON Integrity Check

Prevent partial JSON issues during builds:

```bash
pnpm dlx tsx -e "
import {readdirSync,readFileSync,statSync} from 'fs';
import {join} from 'path';
const r=(d)=>{
  for(const f of readdirSync(d)){
    const p=join(d,f);
    if(statSync(p).isDirectory()) r(p);
    else if(f==='package.json'){
      try{JSON.parse(readFileSync(p,'utf8'))}catch(e){
        console.error('Bad JSON:',p); process.exit(1)
      }
    }
  }
};
r('node_modules');
console.log('node_modules JSON OK');
"
```

## Deployment Considerations

### If using Vercel
- No `output: 'standalone'` needed
- Vercel handles packaging automatically
- Keep standalone disabled for Windows development

### If using Docker
- Prefer WSL2 builds for reproducible Linux images
- Use multi-stage builds in Docker for optimal size

### If using standalone deployment
- Use WSL2 or Linux CI/CD for builds
- Copy resulting `.next/standalone` to deployment target

## Troubleshooting

### Build Still Fails
1. Check Node.js version: `node -v` (recommend 18.17+ or 20 LTS)
2. Verify pnpm version: `pnpm -v` (recommend latest stable)
3. Ensure project not in OneDrive/synced folder
4. Try building from different directory location

### Permission Errors
- Run terminal as Administrator
- Check antivirus exclusions
- Verify Developer Mode is enabled

### JSON Parsing Errors
- Delete `node_modules` and `pnpm-lock.yaml`
- Run `pnpm install` fresh
- Check for interrupted installations

## CI/CD Recommendations

For Windows CI environments, consider:

```yaml
# .github/workflows/build.yml
- name: Build on Windows
  runs-on: windows-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2
    - name: Install dependencies
      run: pnpm install --force
    - name: Build
      run: pnpm build
```

## Version Requirements

- **Node.js**: 18.17+ or 20 LTS recommended
- **pnpm**: Latest stable (10.17.1+ tested)
- **Next.js**: 14.2.16 (configured for app router)

## Related Files

- `next.config.mjs` - Build configuration
- `package.json` - Scripts and dependencies
- `tsconfig.json` - TypeScript configuration
