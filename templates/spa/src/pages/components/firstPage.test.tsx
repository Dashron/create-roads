import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FirstPage, title } from './firstPage';
import * as React from 'react';

describe('FirstPage', () => {
  it('should export the correct title', () => {
    expect(title).toBe('First Page');
  });

  it('should render the page content', () => {
    render(<FirstPage />);

    expect(screen.getByText('Hi!')).toBeDefined();
    expect(screen.getByText('This is the first page')).toBeDefined();
  });

  it('should have correct styling classes', () => {
    const { container } = render(<FirstPage />);
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper.className).toContain('flex');
    expect(wrapper.className).toContain('flex-col');
    expect(wrapper.className).toContain('items-center');
  });
});
