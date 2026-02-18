import { AddWeightStrategy } from './add-weight.strategy';
import { EditWeightStrategy } from './edit-weight.strategy';
import { TFunction } from 'i18next';
import { Weight } from '../../store/user.store';

export interface WeightStrategy {
  weight(weight: Partial<Weight>, userId: string, t: TFunction<'translation', undefined>): Promise<void>;
}

export type PartialWeight = Omit<Weight, 'id'>;

type StrategyType = 'add' | 'edit';

const entries: [StrategyType, WeightStrategy][] = [
  ['add', new AddWeightStrategy()],
  ['edit', new EditWeightStrategy()]
];

const strategies = new Map<StrategyType, WeightStrategy>(entries);

export class WeightStrategyFactory {
  static getStrategy(strategy: StrategyType): WeightStrategy {
    const selectedStrategy = strategies.get(strategy);

    if (!selectedStrategy) {
      throw new Error(`Invalid strategy type: ${strategy}`);
    }

    return selectedStrategy;
  }
}
