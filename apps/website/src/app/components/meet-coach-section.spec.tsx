// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MeetCoachSection from './meet-coach-section';

describe('MeetCoachSection', () => {
  it('renders coach name, credentials, and link in English', async () => {
    const Component = await MeetCoachSection({ locale: 'en' });
    render(Component);

    expect(screen.getByText('Meet Your Coach')).toBeDefined();
    expect(screen.getAllByText('Diana Bucelea').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Certified Nutritionist & Personal Trainer').length).toBeGreaterThan(0);
    expect(screen.getByText('ISSA Certified Personal Trainer')).toBeDefined();
    expect(screen.getByText('Read Full Story & Credentials')).toBeDefined();
  });

  it('renders coach name, credentials, and link in Romanian', async () => {
    const Component = await MeetCoachSection({ locale: 'ro' });
    render(Component);

    expect(screen.getByText('Antrenorul Tău')).toBeDefined();
    expect(screen.getAllByText('Diana Bucelea').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Nutriționist & Antrenor Personal Certificat').length).toBeGreaterThan(0);
    expect(screen.getByText('Antrenor Personal Certificat ISSA')).toBeDefined();
    expect(screen.getByText('Citește Povestea & Diplomele')).toBeDefined();
  });
});
