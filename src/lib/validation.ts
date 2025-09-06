export function formatTargetDir(targetDir: string | undefined): string {
	return targetDir?.trim().replace(/\/+$/g, '') || 'roads-app';
}

export function isValidPackageName(projectName: string): boolean {
	return /^(?:@[a-z0-9-*~][a-z0-9-*._~]*\/)?[a-z0-9-~][a-z0-9-._~]*$/.test(projectName);
}

export function toValidPackageName(projectName: string): string {
	return projectName
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/^[._]/, '')
		.replace(/[^a-z0-9-~]+/g, '-');
}