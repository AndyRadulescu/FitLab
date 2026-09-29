// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DiplomasGrid from './diplomas-grid';

describe('DiplomasGrid', () => {
  it('renders credentials header and diplomas in English', () => {
    render(<DiplomasGrid locale="en" />);

    expect(screen.getByText('Credentials & Accreditations')).toBeDefined();
    expect(screen.getByText('Diplomas & Certifications')).toBeDefined();
    expect(
      screen.getByText(
        'Years of continuous study in nutrition, exercise physiology, and clinical research interpretation.'
      )
    ).toBeDefined();

    // Verify presence of diplomas in both desktop grid and mobile scroller
    expect(screen.getAllByText('Henselmans PT Course Certification').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Certified Personal Trainer (CPT)').length).toBeGreaterThan(0);
  });

  it('renders credentials header and diplomas in Romanian', () => {
    render(<DiplomasGrid locale="ro" />);

    expect(screen.getByText('Calificări & Acreditări')).toBeDefined();
    expect(screen.getByText('Diplome & Certificări')).toBeDefined();
    expect(
      screen.getByText(
        'Ani de studiu continuu în nutriție, fiziologia efortului și interpretarea cercetărilor științifice.'
      )
    ).toBeDefined();

    expect(screen.getAllByText('Certificare Henselmans PT Course').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Antrenor Personal Certificat (CPT)').length).toBeGreaterThan(0);
  });

  it('renders the MobileCardsScroller with accessible carousel region', () => {
    render(<DiplomasGrid locale="en" />);

    const carousels = screen.getAllByRole('region', { name: 'Features carousel' });
    expect(carousels.length).toBeGreaterThan(0);
  });
});
