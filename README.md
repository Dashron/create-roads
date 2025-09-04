# create-roads

[![npm version](https://badge.fury.io/js/create-roads.svg)](https://badge.fury.io/js/create-roads)
[![Node.js Version](https://img.shields.io/node/v/create-roads.svg)](https://nodejs.org)

A scaffolding tool for Roads.js applications with TypeScript, React, and modern tooling.

## Quick Start

```bash
# With npm
npm create roads@latest my-app

# With yarn
yarn create roads my-app

# With pnpm
pnpm create roads my-app
```

## Features

- 🚀 **Two Templates**: Choose between SSR (Server-Side Rendering) or SPA (Single Page Application)
- 📦 **Package Manager Detection**: Automatically detects and uses your preferred package manager (npm, yarn, pnpm)
- 🎯 **TypeScript First**: Fully typed codebase with TypeScript configurations
- ⚡ **Modern Tooling**: Tailwind CSS, ESBuild
- 🛠 **Development Ready**: Includes build scripts, watchers, and development servers
- 📋 **Interactive CLI**: Guided setup with validation and progress indicators

## Templates

Both templates use roads for server side routing and express as a safe wrapper to handle requests, tailwind for css and react for interactivity. The main difference is how that interactivity is managed.

### SSR Template (default)
- Front end "Island" architecture optimized for most apps with standard client side interactivity.
- Renders everything server side then serves the minimum javascript necessary to turn interactive parts interactive.
- Leads to faster load times on devices with slow networks and websites with a lot of different pages.

### SPA Template
- Single Page Application with client-side routing for apps with more complex client side interactivity.
- Server-side renders the first page a user lands on, and then sends the whole app up to the client for speedy transitions
- Larger initial load time can speed up page transitions.

## Usage

### Basic Usage

```bash
# Create a new SSR project
create-roads my-ssr-app

# Create a new SPA project
create-roads my-spa-app --template spa
```

### Advanced Options

```bash
# Specify template and package manager
create-roads my-app --template spa --pm yarn

# Skip dependency installation
create-roads my-app --skip-install

# Show help
create-roads --help

# Show version
create-roads --version
```

### Available Options

| Option | Alias | Description | Values |
|--------|-------|-------------|---------|
| `--template` | `-t` | Choose template type | `default`, `spa` |
| `--package-manager` | `--pm` | Package manager to use | `npm`, `yarn`, `pnpm` |
| `--skip-install` | | Skip dependency installation | |
| `--help` | `-h` | Show help message | |
| `--version` | `-v` | Show version number | |

## Project Structure

### SSR Template Structure
```
my-app/
├── src/
│   ├── middleware/          # Custom Roads.js middleware
│   ├── projects/
│   │   ├── core/           # Framework utilities
│   │   └── example/        # Example application
│   │       ├── components/ # React components
│   │       └── routes.tsx  # Route definitions
│   └── server.ts           # Server entry point
├── css/                    # Source CSS files
│   └── input.css          # Tailwind input file
├── public/                 # Static assets
├── package.json
├── tsconfig.json          # Server-side TypeScript config
└── tsconfig-frontend.json # Client-side TypeScript config
```

### SPA Template Structure
```
my-app/
├── src/
│   ├── components/        # Shared components
│   ├── core/             # Core utilities (router, etc.)
│   ├── pages/            # Page components
│   └── main.tsx          # Application entry point
├── css/                  # Source CSS files
│   └── input.css        # Tailwind input file
├── public/               # Static assets and HTML
├── package.json
├── tsconfig.json         # TypeScript configuration
└── tailwind.config.js    # Tailwind CSS config
```

## Development

### SSR Template Commands
```bash
# Start development server with auto-restart and file watching
npm run watch-all

# Build TypeScript and start server once
npm start

# Build TypeScript only
npm run build-js

# Build CSS only
npm run build-css

# Watch and rebuild CSS on changes
npm run watch-css
```

### SPA Template Commands
```bash
# Start development server (builds and serves)
npm run watch-all

# Build for production
npm run build

# Start static file server only
npm start

# Build JavaScript only
npm run build-js

# Build CSS only
npm run build-css

# Watch and rebuild CSS on changes
npm run watch-css
```

## Requirements

- **Node.js**: >= 18.0.0
- **Package Manager**: npm, yarn, or pnpm

## License

MIT © [Aaron Hedges](http://www.dashron.com)

## Related

- [Roads.js](https://github.com/Dashron/roads) - The underlying web framework
- [React](https://reactjs.org/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework