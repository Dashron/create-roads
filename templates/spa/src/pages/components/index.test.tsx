import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Index, title } from './index';
import * as React from 'react';

describe('Index', () => {
  it('should export the correct title', () => {
    expect(title).toBe('Home');
  });

  it('should render the homepage content', () => {
    render(<Index />);

    expect(screen.getByText('Hi!')).toBeDefined();
    expect(screen.getByText('This is the homepage')).toBeDefined();
  });

  it('should render the github link', () => {
    render(<Index />);

    const link = screen.getByText('Check out the the roads-spa github');
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://github.com/Dashron/roads-spa');
  });
});
