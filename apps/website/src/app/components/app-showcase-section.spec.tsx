// @vitest-environment jsdom

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AppShowcaseSection from './app-showcase-section';

describe('AppShowcaseSection', () => {
  it('renders English showcase content with all 4 feature pillars', async () => {
    const Component = await AppShowcaseSection({ locale: 'en' });
    render(Component);

    // Section title & eyebrow
    expect(screen.getByText('The FitLab App')).toBeDefined();
    expect(screen.getByText('Your Complete Health & Fitness Ecosystem')).toBeDefined();

    // The 4 core features
    expect(screen.getByText('Weekly Check-Ins')).toBeDefined();
    expect(screen.getByText('Workout Tracker')).toBeDefined();
    expect(screen.getByText('Food Library')).toBeDefined();
    expect(screen.getByText('All-in-One Health Hub')).toBeDefined();

    // Feature tags
    expect(screen.getByText('Body Circumferences')).toBeDefined();
    expect(screen.getByText('Set & Rep Tracking')).toBeDefined();
    expect(screen.getByText('Macro Breakdown')).toBeDefined();
    expect(screen.getByText('Sleep & Recovery')).toBeDefined();

    // Phone image mockup
    expect(screen.getByAltText('Amazonia FitLab Mobile Application')).toBeDefined();
  });

  it('renders Romanian showcase content with all 4 feature pillars', async () => {
    const Component = await AppShowcaseSection({ locale: 'ro' });
    render(Component);

    // Section title & eyebrow
    expect(screen.getByText('Aplicația FitLab')).toBeDefined();
    expect(screen.getByText('Ecosistemul Tău Complet de Sănătate & Fitness')).toBeDefined();

    // The 4 core features in Romanian
    expect(screen.getByText('Check-in-uri Săptămânale')).toBeDefined();
    expect(screen.getByText('Jurnal de Antrenamente')).toBeDefined();
    expect(screen.getByText('Bibliotecă Alimentară')).toBeDefined();
    expect(screen.getByText('Aplicație Completă de Sănătate')).toBeDefined();

    // Feature tags in Romanian
    expect(screen.getByText('Măsurători Corporale')).toBeDefined();
    expect(screen.getByText('Serii & Repetări')).toBeDefined();
    expect(screen.getByText('Distribuție Macronutrienți')).toBeDefined();
    expect(screen.getByText('Somn & Recuperare')).toBeDefined();

    // Phone image mockup
    expect(screen.getByAltText('Aplicația mobilă Amazonia FitLab')).toBeDefined();
  });
});
