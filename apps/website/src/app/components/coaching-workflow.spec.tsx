// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import CoachingWorkflow from './coaching-workflow';

describe('CoachingWorkflow', () => {
  afterEach(() => {
    cleanup();
  });

  const mockSteps = [
    {
      tag: 'step-01 // discovery',
      title: 'Initial Consultation',
      description: 'Discuss goals and background.',
    },
    {
      tag: 'step-02 // foundation',
      title: 'Start Training',
      description: 'Begin customized workouts.',
    },
    {
      tag: 'step-03 // analytics',
      title: 'App Tracking',
      description: 'Log workouts and photos.',
    },
    {
      tag: 'step-04 // refinement',
      title: 'Feedback Loop',
      description: 'Form corrections and adjustments.',
    },
    {
      tag: 'step-05 // longevity',
      title: 'Sustainable Nutrition',
      description: 'Custom meal plans and macros.',
    },
  ];

  it('renders eyebrow, title, subtitle, and all 5 workflow steps', () => {
    render(
      <CoachingWorkflow
        eyebrow="The Coaching Journey"
        title="How Diana Works With You"
        subtitle="A step-by-step roadmap to results."
        steps={mockSteps}
      />
    );

    expect(screen.getByText('The Coaching Journey')).toBeDefined();
    expect(screen.getByText('How Diana Works With You')).toBeDefined();
    expect(screen.getByText('A step-by-step roadmap to results.')).toBeDefined();

    mockSteps.forEach((step) => {
      expect(screen.getAllByText(step.tag).length).toBeGreaterThan(0);
      expect(screen.getAllByText(step.title).length).toBeGreaterThan(0);
      expect(screen.getAllByText(step.description).length).toBeGreaterThan(0);
    });
  });
});
