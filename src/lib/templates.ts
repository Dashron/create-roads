export interface Template {
  name: string
  display: string
  color: string
  variant: string
  excludeFiles?: string[]
  includeFiles?: string[]
}

export const TEMPLATES: Template[] = [
	{
		name: 'default',
		display: 'SSR (Server-Side Rendering)',
		color: 'blue',
		variant: 'ssr',
		excludeFiles: [
			'node_modules/**',
			'dist/**',
			'build/**',
			'types/**',
			'*.js.map',
			'*.d.ts.map',
			'package-lock.json',
			'yarn.lock',
			'pnpm-lock.yaml',
			'public/dist-js/**'
		]
	},
	{
		name: 'spa',
		display: 'SPA (Single Page Application)',
		color: 'green',
		variant: 'spa',
		excludeFiles: [
			'node_modules/**',
			'dist/**',
			'build/**',
			'types/**',
			'*.js.map',
			'*.d.ts.map',
			'package-lock.json',
			'yarn.lock',
			'pnpm-lock.yaml',
			'public/js/main.js'
		]
	}
];

export function getTemplate(name: string): Template | undefined {
	return TEMPLATES.find(t => t.name === name);
}

export function getTemplateNames(): string[] {
	return TEMPLATES.map(t => t.name);
}

export function getTemplateChoices() {
	return TEMPLATES.map((template) => ({
		title: template.display,
		value: template.name,
	}));
}