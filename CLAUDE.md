# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

### Development
- `npm run build` - Compile TypeScript to dist/
- `npm run dev` - Watch mode compilation with TypeScript
- `npm run lint` - Run ESLint on src/
- `npm run lint:fix` - Run ESLint with auto-fixing

### Testing
- `npm test` - Build and show test options
- `npm run test:default` - Test default template scaffolding
- `npm run test:spa` - Test SPA template scaffolding

## Architecture Overview

This is **create-roads**, a CLI scaffolding tool for Roads.js applications built with oclif framework. It generates two template types: SSR (Server-Side Rendering) and SPA (Single Page Application).

### Key Components

**CLI Framework (oclif):**
- `src/bin/run.ts` - CLI entry point
- `src/commands/index.ts` - Main command implementation with prompts and flags
- `src/index.ts` - Exports oclif's run function

**Core Library Architecture (`src/lib/`):**
- `project-scaffolder.ts` - Main scaffolding orchestration and build process
- `file-operations.ts` - File copying, template variable replacement, package.json generation
- `templates.ts` - Template definitions and discovery
- `package-manager.ts` - Package manager detection (npm/yarn/pnpm) and command execution
- `validation.ts` - Project name and package name validation

### Template System

**Template Structure:**
- `templates/default/` - SSR template with Roads.js + Express + React islands
- `templates/spa/` - SPA template with client-side routing

**Template Processing:**
- Template files support `{{packageName}}` and `{{description}}` variable substitution
- Separate package.json files for each template with different dependencies and scripts
- Post-scaffolding build process runs template-specific build commands

### Scaffolding Process

1. **Interactive Prompts:** Project name, template selection, package name validation
2. **Directory Management:** Clean existing directories, create new ones
3. **Template Copying:** Copy template files with variable substitution
4. **Package.json Generation:** Process template package.json with user variables
5. **Dependency Installation:** Auto-detect and run package manager commands
6. **Initial Build:** Run template-specific build commands (build-js for default, build for SPA)

### Template Differences

**Default Template (SSR):**
- Uses Roads.js for server-side routing with Express
- React components with .client.tsx for client-side hydration
- Builds with `npm run build-js` and creates `public/dist-js/` directory
- Dual TypeScript configs for server/client compilation

**SPA Template:**
- Pure client-side React application
- Uses esbuild for bundling and http-server for serving
- Builds with `npm run build` 
- Single TypeScript configuration

### Key Patterns

- **Progressive Enhancement:** Default template SSRs first, then hydrates interactivity
- **Package Manager Agnostic:** Detects npm/yarn/pnpm and uses appropriate commands
- **Template Validation:** Ensures package names are valid before scaffolding
- **Error Handling:** Graceful failures with cleanup and helpful error messages