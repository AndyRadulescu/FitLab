interface CheckinListProps {
  checkins: any[];
  onSelectCheckin: (id: string) => void;
}

export const CheckinList = ({ checkins, onSelectCheckin }: CheckinListProps) => {
  if (checkins.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <p>No check-ins found for this user.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {checkins.map((checkin) => (
          <div
            key={checkin.id}
            onClick={() => onSelectCheckin(checkin.id)}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-400 hover:shadow-md cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="bg-indigo-100 p-2 rounded-lg text-indigo-700">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {checkin.createdAt?.toDate 
                    ? checkin.createdAt.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                    : 'Unknown Date'}
                </p>
                <p className="text-sm text-gray-500">
                  {checkin.kg ? `Weight: ${checkin.kg} kg` : 'No weight recorded'}
                </p>
              </div>
            </div>
            <div className="text-indigo-600 font-medium text-sm flex items-center gap-1 group">
              View Details
              <svg className="h-4 w-4 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
