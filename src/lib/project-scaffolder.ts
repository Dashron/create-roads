import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Template } from './templates.js';
import type { TemplateVariables } from './file-operations.js';
import { FileOperations } from './file-operations.js';
import type { PackageManager } from './package-manager.js';
import { getPackageManagerCommands, runCommand } from './package-manager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ScaffoldOptions {
  targetDir: string
  template: Template
  packageName: string
  packageManager: PackageManager
  skipInstall?: boolean
  onProgress?: (message: string, step?: number, total?: number) => void
  verbose?: boolean
}

export interface ScaffoldResult {
  success: boolean
  root: string
  installSuccess?: boolean
  buildSuccess?: boolean
}

export class ProjectScaffolder {
	private fileOps = new FileOperations();

	async scaffold(options: ScaffoldOptions): Promise<ScaffoldResult> {
		const {
			targetDir, template, packageName, packageManager, skipInstall = false, onProgress, verbose = false 
		} = options;

		const root = path.join(process.cwd(), targetDir);
		const totalSteps = skipInstall ? 3 : (template.name === 'default' ? 6 : 5);
		let currentStep = 1;

		const progress = (message: string) => {
			onProgress?.(message, currentStep++, totalSteps);
		};

		// Create/clean target directory
		if (!this.fileOps.canSkipEmptyDir(root)) {
			progress('Cleaning target directory...');
			this.fileOps.emptyDir(root);
		} else if (!fs.existsSync(root)) {
			progress('Creating project directory...');
			fs.mkdirSync(root, { recursive: true });
		}

		// Scaffold project files
		progress(`Scaffolding ${template.display} project in ${root}...`);

		const templateRoot = path.resolve(__dirname, '..', '..', 'templates', template.name);

		if (!fs.existsSync(templateRoot)) {
			throw new Error(`Template "${template.name}" not found!`);
		}

		const variables: TemplateVariables = {
			projectName: targetDir,
			packageName,
			description: `A new ${template.display} application`,
			author: ''
		};

		this.fileOps.copyTemplate(templateRoot, root, template, variables, verbose);

		// Generate package.json
		progress('Generating package.json...');
		this.fileOps.generatePackageJson(templateRoot, root, variables);

		if (skipInstall) {
			return { success: true, root };
		}

		// Install dependencies
		const pmCommands = getPackageManagerCommands(packageManager);
		progress(`Installing dependencies with ${packageManager}...`);

		const installSuccess = await runCommand(
			pmCommands.install.split(' ')[0],
			pmCommands.install.split(' ').slice(1),
			root,
			verbose
		);

		if (!installSuccess) {
			return { success: false, root, installSuccess };
		}

		// Build project based on template
		let buildSuccess = true;

		if (template.name === 'default') {
			progress('Creating dist-js directory...');
			const distJsPath = path.join(root, 'public', 'dist-js');
			fs.mkdirSync(distJsPath, { recursive: true });

			progress('Building SSR with npm run build...');
			buildSuccess = await runCommand(
				pmCommands.run.split(' ')[0],
				[...pmCommands.run.split(' ').slice(1), 'build'],
				root,
				verbose
			);
		} else if (template.name === 'spa') {
			progress('Building SPA with npm run build...');
			buildSuccess = await runCommand(
				pmCommands.run.split(' ')[0],
				[...pmCommands.run.split(' ').slice(1), 'build'],
				root,
				verbose
			);
		}

		return {
			success: true,
			root,
			installSuccess,
			buildSuccess
		};
	}
}