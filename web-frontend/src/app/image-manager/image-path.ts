export const getCheckinPath = (userId: string, checkinId: string) => {
  return `checkin-imgs/${userId}/${checkinId}`;
};

export const imagePath = (userId: string, checkinId: string, slot: string, isSmall = false) => {
  if (isSmall) {
    return `${getCheckinPath(userId, checkinId)}/${slot}_75x75`;
  }
  return `${getCheckinPath(userId, checkinId)}/${slot}`;
};
