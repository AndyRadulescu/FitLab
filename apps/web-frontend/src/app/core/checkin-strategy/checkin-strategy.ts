import { UpdateCheckInStrategy } from './update.strategy';
import { AddCheckInStrategy } from './add.strategy';
import { DeleteCheckInStrategy } from './delete.strategy';
import { CheckInFormData } from '../../routes/checkIn/types';

export type CheckinStrategyType = Omit<CheckInFormData, 'imgUrls'> & { id?: string, createdAt?: Date };

export interface CheckInStrategy {
  checkIn: ({ data, userId }: { data: CheckinStrategyType, userId: string }) => Promise<void>;
}

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
