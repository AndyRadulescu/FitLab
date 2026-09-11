// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import WhatIOfferSection from './what-i-offer';

describe('WhatIOfferSection', () => {
  it('renders all 3 offering feature cards in English', async () => {
    const Component = await WhatIOfferSection({ locale: 'en' });
    render(Component);

    expect(screen.getByText('What I Offer')).toBeDefined();
    expect(screen.getByText('A Sustainable, Science-Driven Program')).toBeDefined();
    expect(screen.getByText('Custom Nutrition & Workouts')).toBeDefined();
    expect(screen.getByText('Objective Progress Tracking')).toBeDefined();
    expect(screen.getByText('1-on-1 Continuous Guidance')).toBeDefined();
  });

  it('renders all 3 offering feature cards in Romanian', async () => {
    const Component = await WhatIOfferSection({ locale: 'ro' });
    render(Component);

    expect(screen.getByText('Ce Îți Ofer')).toBeDefined();
    expect(screen.getByText('Un Program Sustenabil, Bazat pe Știință')).toBeDefined();
    expect(screen.getByText('Nutriție & Antrenamente Personalizate')).toBeDefined();
    expect(screen.getByText('Monitorizare Obiectivă a Progresului')).toBeDefined();
    expect(screen.getByText('Ghidare Continuă 1-la-1')).toBeDefined();
  });
});
