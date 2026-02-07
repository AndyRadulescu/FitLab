import { describe, it, expect } from 'vitest';
import { getCheckinPath, imagePath } from './image-path';

describe('Storage Path Utilities', () => {
  const userId = 'user123';
  const checkinId = 'checkin456';
  const slot = 'front';

  describe('getCheckinPath', () => {
    it('should return the correct folder path for a user check-in', () => {
      const expected = `checkin-imgs/user123/checkin456`;
      expect(getCheckinPath(userId, checkinId)).toBe(expected);
    });
  });

  describe('imagePath', () => {
    it('should return the path for a full-sized image when isSmall is false', () => {
      const expected = `checkin-imgs/user123/checkin456/front`;
      expect(imagePath(userId, checkinId, slot)).toBe(expected);
    });

    it('should return the path with _75x75 suffix when isSmall is true', () => {
      const expected = `checkin-imgs/user123/checkin456/front_75x75`;
      expect(imagePath(userId, checkinId, slot, true)).toBe(expected);
    });

    it('should handle different slots correctly (back, side)', () => {
      expect(imagePath(userId, checkinId, 'back')).toContain('/back');
      expect(imagePath(userId, checkinId, 'side', true)).toContain('/side_75x75');
    });
  });
});
