import { CheckInPayload } from '../../store/checkin.store';

import { UpdateCheckInStrategy } from './update.strategy';
import { AddCheckInStrategy } from './add.strategy';
import { DeleteCheckInStrategy } from './delete.strategy';

export interface CheckInStrategy {
  checkIn: ({ data, userId }: { data: CheckInPayload, userId: string }) => Promise<void>;
}

export const SLOTS = ['front', 'back', 'side'] as const;
type StrategyType = 'add' | 'edit' | 'delete';

export class CheckInStrategyFactory {
  static getStrategy(strategy: StrategyType): CheckInStrategy {
    switch (strategy) {
      case 'edit':
        return new UpdateCheckInStrategy();
      case 'delete':
        return new DeleteCheckInStrategy();
      default:
        return new AddCheckInStrategy();
    }
  }
}
