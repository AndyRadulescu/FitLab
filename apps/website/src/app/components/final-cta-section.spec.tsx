// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FinalCtaSection from './final-cta-section';

describe('FinalCtaSection', () => {
  it('renders final CTA with Instagram link in English', async () => {
    const Component = await FinalCtaSection({ locale: 'en' });
    render(Component);

    expect(screen.getByText('Ready to Build a Sustainable, Science-Backed Body?')).toBeDefined();
    const link = screen.getByRole('link', { name: /DM on IG/i });
    expect(link).toBeDefined();
    expect(link.getAttribute('href')).toBe('https://www.instagram.com/dianabucelea/');
    expect(link.getAttribute('target')).toBe('_blank');
  });

  it('renders final CTA in Romanian', async () => {
    const Component = await FinalCtaSection({ locale: 'ro' });
    render(Component);

    expect(screen.getByText('Ești Gata Să Îți Transformi Corpul Pe Baze Științifice?')).toBeDefined();
    const link = screen.getByRole('link', { name: /DM pe Insta/i });
    expect(link).toBeDefined();
  });
});
