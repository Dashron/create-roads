import { describe, it, expect } from 'vitest';
import emptyTo404 from './emptyTo404.js';
import { Response } from 'roads';

describe('emptyTo404 middleware', () => {
  it('should return 404 response when response is null', async () => {
    const result = await emptyTo404('GET', '/', '', {}, () => Promise.resolve(null as any));

    expect(result.status).toBe(404);
    expect(result.body).toBe('Page not found');
  });

  it('should return original response when response exists', async () => {
    const contentResponse = new Response('Hello World', 200);
    const result = await emptyTo404('GET', '/', '', {}, () => Promise.resolve(contentResponse));

    expect(result.status).toBe(200);
    expect(result.body).toBe('Hello World');
  });

  it('should pass through redirect responses unchanged', async () => {
    const redirectResponse = new Response('', 302, { location: '/redirect' });
    const result = await emptyTo404('GET', '/', '', {}, () => Promise.resolve(redirectResponse));

    expect(result.status).toBe(302);
  });
});
