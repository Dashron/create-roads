import { describe, it, expect, vi } from 'vitest';

// Mock fs before importing staticUtil to avoid file system errors during test loading
vi.mock('fs', () => ({
  default: {
    statSync: vi.fn(() => ({ mtime: new Date('2024-01-01') })),
    readFileSync: vi.fn(() => 'mock file content'),
  },
  statSync: vi.fn(() => ({ mtime: new Date('2024-01-01') })),
  readFileSync: vi.fn(() => 'mock file content'),
}));

import { getReactUrl, getReactSrcPath, getReactBuildPath } from './staticUtil.js';

describe('staticUtil', () => {
  describe('getReactUrl', () => {
    it('should generate URL without sourcemap or last modified', () => {
      const url = getReactUrl('example/components/home', false, false);
      expect(url).toBe('/static/js/example/components/home.js');
    });

    it('should generate URL with sourcemap', () => {
      const url = getReactUrl('example/components/home', true, false);
      expect(url).toBe('/static/js/example/components/home.js.map');
    });

    it('should generate URL with last modified query param', () => {
      const url = getReactUrl('example/components/home', false, true);
      expect(url).toMatch(/^\/static\/js\/example\/components\/home\.js\?q=\d+$/);
    });
  });

  describe('getReactSrcPath', () => {
    it('should generate correct source path', () => {
      const srcPath = getReactSrcPath('example/components/home');
      expect(srcPath).toContain('src/projects/example/components/home.tsx');
    });
  });

  describe('getReactBuildPath', () => {
    it('should generate build path without sourcemap', () => {
      const buildPath = getReactBuildPath('example/components/home', false);
      expect(buildPath).toContain('public/dist-js/example/components/home.js');
    });

    it('should generate build path with sourcemap', () => {
      const buildPath = getReactBuildPath('example/components/home', true);
      expect(buildPath).toContain('public/dist-js/example/components/home.js.map');
    });
  });
});
