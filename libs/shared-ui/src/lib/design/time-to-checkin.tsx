import { CheckInFormDataDto } from '@my-org/core';
import clsx from 'clsx';

export function TimeToCheckin({ checkins }: { checkins: CheckInFormDataDto[] }) {
  if (!checkins || checkins.length === 0) {
    return <span>N/A</span>;
  }

  const sortedCheckins = [...checkins].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const lastCheckin = new Date(sortedCheckins[0].createdAt);
  const nextCheckin = new Date(lastCheckin);
  nextCheckin.setDate(lastCheckin.getDate() + 7);

  const now = new Date();
  const diffInMs = nextCheckin.getTime() - now.getTime();
  const isOverdue = diffInMs < 0;

  // Calculate absolute values for display
  const absoluteDiff = Math.abs(diffInMs);
  const days = Math.floor(absoluteDiff / (1000 * 60 * 60 * 24));

  return (
    <div className={clsx(
      "font-bold", // Base classes
      {
        "text-red-500": isOverdue,
        "text-gray-800 dark:text-gray-300": !isOverdue
      }
    )}>
      {isOverdue && "-"}
      {days}d
    </div>
  );
}
