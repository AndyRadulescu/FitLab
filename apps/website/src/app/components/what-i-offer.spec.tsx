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

    // Coaching workflow steps
    expect(screen.getByText('The Coaching Journey')).toBeDefined();
    expect(screen.getByText('How I work with you')).toBeDefined();
    expect(screen.getAllByText('Initial Get-to-Know Call').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Start Training').length).toBeGreaterThan(0);
    expect(screen.getAllByText('App-Powered Progress & Check-Ins').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Feedback & Continuous Form Correction').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Personalized Nutrition & Macro Guidance').length).toBeGreaterThan(0);
  });

  it('renders all 3 offering feature cards in Romanian', async () => {
    const Component = await WhatIOfferSection({ locale: 'ro' });
    render(Component);

    expect(screen.getByText('Ce Îți Ofer')).toBeDefined();
    expect(screen.getByText('Un Program Sustenabil, Bazat pe Știință')).toBeDefined();
    expect(screen.getByText('Nutriție & Antrenamente Personalizate')).toBeDefined();
    expect(screen.getByText('Monitorizare Obiectivă a Progresului')).toBeDefined();
    expect(screen.getByText('Ghidare Continuă 1-la-1')).toBeDefined();

    // Coaching workflow steps
    expect(screen.getByText('Procesul de Coaching')).toBeDefined();
    expect(screen.getByText('Cum lucrez cu tine')).toBeDefined();
    expect(screen.getAllByText('Apel Inițial de Cunoaștere').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Începerea Antrenamentelor').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Monitorizare în Aplicație & Check-In').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Feedback & Corectare Tehnică').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nutriție Personalizată & Stil de Viață').length).toBeGreaterThan(0);
  });
});
