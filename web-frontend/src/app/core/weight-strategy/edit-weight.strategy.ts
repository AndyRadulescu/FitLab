import { WeightStrategy } from './weight-strategy';
import { TFunction } from 'i18next';

export class EditWeightStrategy implements WeightStrategy {
  weight(weight: number, userId: string, t: TFunction<'translation', undefined>): Promise<void> {
    throw new Error('Method not implemented.');
  }

}
