// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FaqAccordion from './faq-accordion';
import FaqSection from './faq-section';

describe('FaqAccordion', () => {
  const mockItems = [
    { question: 'What is FitLab?', answer: 'FitLab is a precision tracking app.' },
    { question: 'Is coaching included?', answer: 'Yes, 1-on-1 coaching is included.' },
  ];

  it('renders all questions and toggles open/close on click', () => {
    render(<FaqAccordion items={mockItems} defaultOpenIndex={0} />);

    expect(screen.getByText('What is FitLab?')).toBeDefined();
    expect(screen.getByText('Is coaching included?')).toBeDefined();

    // Default open index 0: first answer is visible
    expect(screen.getByText('FitLab is a precision tracking app.')).toBeDefined();

    // Second answer is collapsed
    expect(screen.queryByText('Yes, 1-on-1 coaching is included.')).toBeNull();

    // Click second question button to open it
    const button2 = screen.getByText('Is coaching included?');
    fireEvent.click(button2);

    expect(screen.getByText('Yes, 1-on-1 coaching is included.')).toBeDefined();
    // First answer is now collapsed
    expect(screen.queryByText('FitLab is a precision tracking app.')).toBeNull();
  });
});

describe('FaqSection', () => {
  it('renders section in English with translations', async () => {
    const Component = await FaqSection({ locale: 'en' });
    render(Component);

    expect(screen.getByText('Frequently Asked Questions')).toBeDefined();
    expect(screen.getByText('Do I need prior gym experience to start?')).toBeDefined();
  });

  it('renders section in Romanian with translations', async () => {
    const Component = await FaqSection({ locale: 'ro' });
    render(Component);

    expect(screen.getByText('Tot Ce Trebuie Să Știi')).toBeDefined();
    expect(screen.getByText('Am nevoie de experiență anterioară la sală pentru a începe?')).toBeDefined();
  });
});
