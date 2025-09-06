import fs from 'node:fs';
import path from 'node:path';
import { minimatch } from 'minimatch';
import type { Template } from './templates.js';

export interface TemplateVariables {
  projectName: string
  packageName: string
  description?: string
  author?: string
}

export class FileOperations {
	private shouldExcludeFile(filePath: string, template: Template): boolean {
		if (!template.excludeFiles) return false;

		return template.excludeFiles.some(pattern =>
			minimatch(filePath, pattern, { dot: true })
		);
	}

	private shouldIncludeFile(filePath: string, template: Template): boolean {
		if (!template.includeFiles || template.includeFiles.length === 0) return true;

		return template.includeFiles.some(pattern =>
			minimatch(filePath, pattern, { dot: true })
		);
	}

	private substituteVariables(content: string, variables: TemplateVariables): string {
		return content
			.replace(/{{projectName}}/g, variables.projectName)
			.replace(/{{packageName}}/g, variables.packageName)
			.replace(/{{description}}/g, variables.description || '')
			.replace(/{{author}}/g, variables.author || '');
	}

	private isTextFile(filePath: string): boolean {
		const textExtensions = [
			'.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.txt', '.html', '.css', '.scss',
			'.less', '.yaml', '.yml', '.xml', '.svg', '.gitignore', '.env'
		];
		const ext = path.extname(filePath).toLowerCase();
		return textExtensions.includes(ext) || path.basename(filePath).startsWith('.');
	}

	canSkipEmptyDir(dir: string): boolean {
		if (!fs.existsSync(dir)) {
			return true;
		}

		const files = fs.readdirSync(dir);
		if (files.length === 0) {
			return true;
		}
		if (files.length === 1 && files[0] === '.git') {
			return true;
		}

		return false;
	}

	emptyDir(dir: string): void {
		if (!fs.existsSync(dir)) {
			return;
		}
		for (const file of fs.readdirSync(dir)) {
			if (file === '.git') {
				continue;
			}
			fs.rmSync(path.resolve(dir, file), { recursive: true, force: true });
		}
	}

	copyTemplate(
		templateRoot: string,
		targetRoot: string,
		template: Template,
		variables: TemplateVariables
	): void {
		const write = (file: string, content?: string) => {
			const targetPath = path.join(targetRoot, file);
			if (content) {
				fs.writeFileSync(targetPath, content);
			} else {
				this.copy(path.join(templateRoot, file), targetPath, template, variables, file);
			}
		};

		const files = fs.readdirSync(templateRoot);
		for (const file of files.filter((f) => f !== 'package.json')) {
			if (this.shouldExcludeFile(file, template)) {
				continue;
			}
			if (!this.shouldIncludeFile(file, template)) {
				continue;
			}
			write(file);
		}
	}

	generatePackageJson(
		templateRoot: string,
		targetRoot: string,
		variables: TemplateVariables
	): void {
		const pkg = JSON.parse(fs.readFileSync(path.join(templateRoot, 'package.json'), 'utf-8'));

		pkg.name = variables.packageName;
		pkg.description = variables.description;
		pkg.version = '0.1.0';

		delete pkg.author;
		delete pkg.main;
		delete pkg.types;
		delete pkg.files;

		fs.writeFileSync(
			path.join(targetRoot, 'package.json'),
			`${JSON.stringify(pkg, null, 2)  }\n`
		);
	}

	private copy(
		src: string,
		dest: string,
		template: Template,
		variables: TemplateVariables,
		relativePath: string = ''
	): void {
		const stat = fs.statSync(src);
		if (stat.isDirectory()) {
			this.copyDir(src, dest, template, variables, relativePath);
		} else {
			if (this.isTextFile(src)) {
				const content = fs.readFileSync(src, 'utf-8');
				const substituted = this.substituteVariables(content, variables);
				fs.writeFileSync(dest, substituted, 'utf-8');
			} else {
				fs.copyFileSync(src, dest);
			}
		}
	}

	private copyDir(
		srcDir: string,
		destDir: string,
		template: Template,
		variables: TemplateVariables,
		relativePath: string = ''
	): void {
		fs.mkdirSync(destDir, { recursive: true });
		for (const file of fs.readdirSync(srcDir)) {
			const currentRelativePath = relativePath ? `${relativePath}/${file}` : file;

			if (this.shouldExcludeFile(currentRelativePath, template)) {
				continue;
			}

			if (!this.shouldIncludeFile(currentRelativePath, template)) {
				continue;
			}

			const srcFile = path.resolve(srcDir, file);
			const destFile = path.resolve(destDir, file);
			this.copy(srcFile, destFile, template, variables, currentRelativePath);
		}
	}
}