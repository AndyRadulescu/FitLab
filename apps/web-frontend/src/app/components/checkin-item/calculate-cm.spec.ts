import { describe, it, expect } from 'vitest';
import { calculateCm } from './calculate-cm';
import { CheckInFormDataDto } from '../../store/checkin.store';

describe('calculateCm', () => {
  it('should correctly sum all body measurements', () => {
    const mockCheckin = {
      waistSize: 80,
      hipSize: 100,
      buttSize: 105,
      breastSize: 95,
      rightThigh: 60,
      leftThigh: 60,
      rightArm: 30,
      leftArm: 30,
      kg: 75
    } as CheckInFormDataDto;
    const result = calculateCm(mockCheckin);
    expect(result).toBe(560);
  });

  it('should handle zero values correctly', () => {
    const zeroCheckin = {
      waistSize: 0,
      hipSize: 0,
      buttSize: 0,
      breastSize: 0,
      rightThigh: 0,
      leftThigh: 0,
      rightArm: 0,
      leftArm: 0
    } as CheckInFormDataDto;

    expect(calculateCm(zeroCheckin)).toBe(0);
  });

  it('should handle decimal values (floating point precision)', () => {
    const decimalCheckin = {
      waistSize: 70.5,
      hipSize: 90.2,
      buttSize: 100,
      breastSize: 85,
      rightThigh: 55,
      leftThigh: 55,
      rightArm: 28,
      leftArm: 28
    } as CheckInFormDataDto;
    expect(calculateCm(decimalCheckin)).toBeCloseTo(511.7);
  });
});
