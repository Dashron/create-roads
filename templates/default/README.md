# {{packageName}}

Starter template for a server‑rendered Roads.js app with React "islands" and Tailwind CSS. It renders HTML on the server, then only hydrates the interactive components on the client for fast loads.

## Requirements
- Node.js 18+

## Quick Start
```bash
npm install
npm run watch-all
```

Open http://localhost:8080 in your browser to see your app running.

This compiles TypeScript, builds client bundles with esbuild, watches Tailwind, and restarts the server on changes.

## Development Scripts
- `watch-all` – **Main development command**: builds, watches, and serves with hot reload
- `start` – One-shot build then start production server
- `build-js` – Compile TypeScript to `dist/`
- `build-css` – Build Tailwind CSS to `public/css/main.css`
- `watch-css` – Watch and rebuild Tailwind CSS only

## Architecture

This is a **SSR with islands** application that combines the SEO benefits of server-side rendering with the interactivity of client-side React components.

### How It Works
1. **Server renders** initial HTML for fast first paint
2. **Client hydrates** only interactive components (`.client.tsx` files)
3. **Code splitting** ensures minimal JavaScript per page
4. **Hot reloading** in development for both server and client code

### Project Structure
```
src/
  server.ts               # Roads.js + Express server entry point
  watchAll.ts             # Development orchestrator (TypeScript, esbuild, Tailwind)
  middleware/             # Custom middleware (layout, CSRF, error handling)
  projects/
    core/                 # Framework utilities and client runtime
      static.ts           # Auto-discovery of static assets and client bundles
      staticUtil.ts       # Static file serving utilities  
    example/              # Your application code
      routes.tsx          # Route definitions
      components/         # React components
        *.client.tsx      # Client-side hydrated components
css/input.css             # Tailwind CSS input file
public/                   # Built static assets
  css/                    # Generated CSS
  dist-js/                # Generated client JavaScript bundles
```

## Adding New Features

### Creating Routes
Add routes in `src/projects/example/routes.tsx`:
```typescript
router.get('/my-page', myPageHandler);
```

### Adding Components
- **Standard components**: Regular `.tsx` files. These may or may not be exposed to the client depending on how you import them
- **Interactive components**: End with `.client.tsx` for automatic client bundling
- Components are automatically discovered and bundled by esbuild

### Styling
- Edit `css/input.css` to customize Tailwind
- Configure Tailwind in `tailwind.config.js`
- CSS is automatically rebuilt in watch mode

## Production Deployment
```bash
npm start
```
Builds and starts the server on port 8080. Set `PORT` environment variable to customize.

## Learn More
- [Roads.js Documentation](https://github.com/Dashron/roads)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
