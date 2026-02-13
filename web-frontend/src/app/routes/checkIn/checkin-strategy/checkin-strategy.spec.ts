import { describe, expect, it, vi } from 'vitest';
import { AddCheckInStrategy } from './add.strategy';
import { UpdateCheckInStrategy } from './update.strategy';
import { DeleteCheckInStrategy } from './delete.strategy';
import { CheckInStrategyFactory } from './checkin-strategy';

vi.mock('./add.strategy', () => ({
  AddCheckInStrategy: class {}
}));
vi.mock('./update.strategy', () => ({
  UpdateCheckInStrategy: class {}
}));
vi.mock('./delete.strategy', () => ({
  DeleteCheckInStrategy: class {}
}));

describe('CheckInStrategyFactory', () => {

  it('should return AddCheckInStrategy for type "add"', () => {
    const strategy = CheckInStrategyFactory.getStrategy('add');
    expect(strategy).toBeInstanceOf(AddCheckInStrategy);
  });

  it('should return UpdateCheckInStrategy for type "edit"', () => {
    const strategy = CheckInStrategyFactory.getStrategy('edit');
    expect(strategy).toBeInstanceOf(UpdateCheckInStrategy);
  });

  it('should return DeleteCheckInStrategy for type "delete"', () => {
    const strategy = CheckInStrategyFactory.getStrategy('delete');
    expect(strategy).toBeInstanceOf(DeleteCheckInStrategy);
  });

  it('should return AddCheckInStrategy as a default case', () => {
    const strategy = CheckInStrategyFactory.getStrategy('unknown' as any);
    expect(strategy).toBeInstanceOf(AddCheckInStrategy);
  });

});
