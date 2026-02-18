import { describe, expect, it, vi } from 'vitest';
import { AddWeightStrategy } from './add-weight.strategy';
import { EditWeightStrategy } from './edit-weight.strategy';
import { WeightStrategyFactory } from './weight-strategy';

vi.mock('./add-weight.strategy', () => ({
  AddWeightStrategy: vi.fn()
}));

vi.mock('./edit-weight.strategy', () => ({
  EditWeightStrategy: vi.fn()
}));

describe('WeightStrategyFactory', () => {
  it('should return an instance of AddWeightStrategy when type is "add"', () => {
    const strategy = WeightStrategyFactory.getStrategy('add');
    expect(strategy).toBeInstanceOf(AddWeightStrategy);
  });

  it('should return an instance of EditWeightStrategy when type is "edit"', () => {
    const strategy = WeightStrategyFactory.getStrategy('edit');
    expect(strategy).toBeInstanceOf(EditWeightStrategy);
  });

  it('should throw an error if an invalid strategy is requested (defensive check)', () => {
    // @ts-expect-error - testing invalid input
    expect(() => WeightStrategyFactory.getStrategy('delete')).toThrow();
  });
});
