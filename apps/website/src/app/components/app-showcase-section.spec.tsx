// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import AppShowcaseSection from './app-showcase-section';

describe('AppShowcaseSection', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders English showcase content with all 4 feature pillars', async () => {
    const Component = await AppShowcaseSection({ locale: 'en' });
    render(Component);

    // Section title & eyebrow
    expect(screen.getByText('The FitLab App')).toBeDefined();
    expect(screen.getByText('Your Complete Health & Fitness Ecosystem')).toBeDefined();

    // The 4 core features (present in both desktop columns and mobile scroller)
    expect(screen.getAllByText('Weekly Check-Ins').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Workout Tracker').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Food Library').length).toBeGreaterThan(0);
    expect(screen.getAllByText('All-in-One Health Hub').length).toBeGreaterThan(0);

    // Feature tags
    expect(screen.getAllByText('Body Circumferences').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Set & Rep Tracking').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Macro Breakdown').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Sleep & Recovery').length).toBeGreaterThan(0);

    // Phone image mockup
    expect(screen.getByAltText('Amazonia FitLab Mobile Application')).toBeDefined();

    // Mobile carousel region
    expect(screen.getByRole('region', { name: 'Features carousel' })).toBeDefined();
  });

  it('renders Romanian showcase content with all 4 feature pillars', async () => {
    const Component = await AppShowcaseSection({ locale: 'ro' });
    render(Component);

    // Section title & eyebrow
    expect(screen.getByText('Aplicația FitLab')).toBeDefined();
    expect(screen.getByText('Ecosistemul Tău Complet de Sănătate & Fitness')).toBeDefined();

    // The 4 core features in Romanian
    expect(screen.getAllByText('Check-in-uri Săptămânale').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Jurnal de Antrenamente').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Bibliotecă Alimentară').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Aplicație Completă de Sănătate').length).toBeGreaterThan(0);

    // Feature tags in Romanian
    expect(screen.getAllByText('Măsurători Corporale').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Serii & Repetări').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Distribuție Macronutrienți').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Somn & Recuperare').length).toBeGreaterThan(0);

    // Phone image mockup
    expect(screen.getByAltText('Aplicația mobilă Amazonia FitLab')).toBeDefined();
  });
});
