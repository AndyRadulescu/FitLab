import { CheckInFormDataDto } from '@my-org/core';

export function calculateCm(checkin: CheckInFormDataDto) {
  return checkin.waistSize + checkin.hipSize + checkin.buttSize + checkin.breastSize + checkin.rightThigh+ checkin.leftThigh + checkin.leftArm + checkin.rightArm
}
