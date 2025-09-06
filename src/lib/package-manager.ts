import fs from 'node:fs';
import { spawn } from 'node:child_process';

export type PackageManager = 'npm' | 'yarn' | 'pnpm'

export interface PackageManagerCommands {
  install: string
  add: string
  run: string
}

export function detectPackageManager(): PackageManager {
	if (fs.existsSync('pnpm-lock.yaml')) return 'pnpm';
	if (fs.existsSync('yarn.lock')) return 'yarn';
	return 'npm';
}

export function getPackageManagerCommands(pm: PackageManager): PackageManagerCommands {
	switch (pm) {
		case 'yarn':
			return { install: 'yarn', add: 'yarn add', run: 'yarn' };
		case 'pnpm':
			return { install: 'pnpm install', add: 'pnpm add', run: 'pnpm' };
		case 'npm':
		default:
			return { install: 'npm install', add: 'npm install', run: 'npm run' };
	}
}

export function runCommand(command: string, args: string[], cwd: string, verbose = false): Promise<boolean> {
	return new Promise((resolve) => {
		if (verbose) {
			console.log(`\nRunning: ${command} ${args.join(' ')}`);
		}
		const child = spawn(command, args, {
			cwd,
			stdio: verbose ? 'inherit' : 'pipe',
			shell: process.platform === 'win32'
		});

		child.on('close', (code) => {
			resolve(code === 0);
		});
	});
}