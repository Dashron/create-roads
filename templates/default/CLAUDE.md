# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Communication Style

- **Be direct and provide honest feedback** - don't sugar-coat issues or problems
- **If you don't know an answer, say so** - don't guess or make assumptions
- **If you disagree with something, express it clearly** - provide your reasoning and alternative suggestions

## Important Notes

- **Never commit code automatically** - user handles all git commits manually
- **Always verify before planning** - run tests/linting first to get complete picture
- **Use MultiEdit for similar fixes** - handle multiple similar issues efficiently
- **Ask for clarification on vague styling terms** - color/size references may not match what's visible in code
- **Search for specific styling patterns** - use targeted searches like "text-2xl" to find size references efficiently

## Error Handling Guidelines

- **Maintain consistency** - decide early whether to show user-facing errors or gracefully degrade
- **Update ESLint config** - add missing globals (setTimeout, etc.) rather than working around them
- **Mock Node.js test environment properly** - set up window, clipboard, and other browser APIs for tests

## AI Development Retrospectives

When the user asks to "record a retro", create a new markdown file in the `ai-notes/` folder with this structure:

```markdown
# Retrospective - [Date]

## What Went Well
- [Positive outcomes, successful approaches, good decisions]

## What Went Poorly
- [Challenges, mistakes, inefficiencies, problems encountered]

## What We Can Do Better Next Time
- [Actionable improvements, lessons learned, process changes]

## Additional Notes
- [Any other relevant observations or context]
```

**File naming**: `retro-YYYY-MM-DD-feature-name.md`


## Essential Commands

### Development
- `npm run watch-all` - Main development command: builds TypeScript, starts server with auto-restart, and watches client-side React components
- `npm start` - Build TypeScript and start server once (production mode)
- `npm run build-js` - Compile TypeScript only
- `npm run build-css` - Build Tailwind CSS
- `npm run watch-css` - Watch and rebuild Tailwind CSS on changes

## Architecture Overview

This is a **roads-ssr** project - a Server-Side Rendering framework built on top of the Roads.js framework with React and Express. It demonstrates hybrid server-side + client-side rendering capabilities.

### Key Architecture Patterns

**Dual TypeScript Configurations:**
- `tsconfig.json` - Server-side compilation (ES2022, Node.js modules to `./dist/node`)
- `tsconfig-frontend.json` - Client-side compilation (ES2015, AMD modules to `./dist/browser`)

**Project Structure:**
- `src/projects/core/` - Framework core utilities for static file handling and React rendering
- `src/projects/example/` - Example application implementation
- `src/middleware/` - Custom Roads.js middleware (layout, CSRF, 404 handling)
- `src/server.ts` - Express + Roads.js server entry point

**Client-Side Hydration System:**
- Components ending in `.client.tsx` are automatically built for browser execution
- esbuild creates separate bundles for each client component with code splitting
- Server-side renders initial HTML, client-side hydrates for interactivity

**Static Asset Pipeline:**
- `src/projects/core/static.ts` automatically discovers and serves:
  - CSS files from `public/css/`
  - Font files from `public/fonts/` 
  - React client bundles from `public/dist-js/`
  - Static files (robots.txt, favicon.svg)

**Development Workflow:**
- `watchAll.ts` orchestrates: TypeScript compilation → server restart → React bundling → CSS building
- Uses tsc-watch for TypeScript, esbuild for React components, and Tailwind CLI for CSS
- Hot reloading for both server and client code

### Key Files
- `src/server.ts:85` - Server starts on port 8080
- `src/watchAll.ts:35` - Server restart logic after TypeScript compilation
- `src/projects/core/static.ts:39` - Auto-discovery of `.client.tsx` components
- `src/projects/example/routes.tsx:27` - Route definitions using Roads.js RouterMiddleware

This architecture enables both SSR performance and SPA-like client interactivity on a per-component basis.