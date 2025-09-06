# {{packageName}}

Modern Single Page Application (SPA) built with React, TypeScript, and Tailwind CSS. Features client-side routing and hot reloading for fast development.

## Requirements
- Node.js 18+

## Quick Start
```bash
npm install
npm run watch-all
```

Open http://localhost:8080 in your browser to see your app running.

This builds the app (JS + CSS) and serves it with a static file server that automatically reloads on changes.

## Development Scripts
- `watch-all` – **Main development command**: builds and serves with auto-reload
- `build` – Build optimized JS and CSS for production
- `build-js` – Bundle `src/main.tsx` to `public/js/` via esbuild
- `build-css` – Build Tailwind CSS to `public/css/main.css`
- `start` – Serve `public/` directory (production mode)
- `watch-css` – Watch and rebuild Tailwind CSS only

## Architecture

This is a **client-side SPA** that loads once and handles all navigation in the browser for instant page transitions.

### How It Works
1. **Single page load** - All JavaScript loaded upfront
2. **Client-side routing** - Navigation handled by React Router
3. **Component-based** - Modular React components with TypeScript
4. **Build optimization** - esbuild for fast bundling and hot reload

### Project Structure
```
src/
  core/                   # Core utilities and routing
    Router.tsx            # Client-side router component
    routerUtil.ts         # Routing utilities
  pages/                  # Page-level components and routing
    routes.tsx            # Route definitions and page mapping
    components/           # Individual page components
      HomePage.tsx        # Example home page
      AboutPage.tsx       # Example about page
  components/             # Reusable UI components
    Layout.tsx            # App shell/layout component
  main.tsx                # Application entry point
css/input.css             # Tailwind CSS input file
public/                   # Static assets and built files
  index.html              # Single HTML entry point
  js/                     # Built JavaScript bundles
  css/                    # Built CSS files
```

## Adding New Features

### Creating Pages
1. Add a new component in `src/pages/components/`:
```typescript
// src/pages/components/NewPage.tsx
export default function NewPage() {
  return <div>My new page</div>;
}
```

2. Register the route in `src/pages/routes.tsx`:
```typescript
import NewPage from './components/NewPage';

const routes = [
  // existing routes...
  { path: '/new-page', component: NewPage }
];
```

### Adding Components
Create reusable components in `src/components/`:
```typescript
// src/components/MyComponent.tsx
interface Props {
  title: string;
}

export default function MyComponent({ title }: Props) {
  return <h2 className="text-xl font-bold">{title}</h2>;
}
```

### Styling with Tailwind
- Edit `css/input.css` to add custom styles
- Configure Tailwind in `tailwind.config.js`
- Use Tailwind utility classes directly in components
- CSS rebuilds automatically in development

## Production Build
```bash
npm run build
npm start
```

Creates optimized bundles in `public/` and serves them on http://localhost:8080.

## Deployment
The `public/` directory contains your complete app after building:
- Upload `public/` contents to any static hosting provider
- Configure your server to serve `index.html` for all routes (SPA fallback)

## Learn More
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://typescriptlang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [esbuild Documentation](https://esbuild.github.io)
