// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FeatureCard from './feature-card';

describe('FeatureCard', () => {
  it('renders icon, title, and description', () => {
    render(
      <FeatureCard
        icon={<span data-testid="test-icon">Icon</span>}
        title="Card Title"
        description="Card Description"
      />
    );

    expect(screen.getByTestId('test-icon')).toBeDefined();
    expect(screen.getByText('Card Title')).toBeDefined();
    expect(screen.getByText('Card Description')).toBeDefined();
  });

  it('renders tags when provided', () => {
    render(
      <FeatureCard
        icon={<span>Icon</span>}
        title="Card With Tags"
        description="Has tags"
        tags={['Tag A', 'Tag B', 'Tag C']}
      />
    );

    expect(screen.getByText('Tag A')).toBeDefined();
    expect(screen.getByText('Tag B')).toBeDefined();
    expect(screen.getByText('Tag C')).toBeDefined();
  });

  it('renders custom children when provided', () => {
    render(
      <FeatureCard
        icon={<span>Icon</span>}
        title="Custom Card"
      >
        <div data-testid="custom-child">Child Content</div>
      </FeatureCard>
    );

    expect(screen.getByTestId('custom-child')).toBeDefined();
  });
});
