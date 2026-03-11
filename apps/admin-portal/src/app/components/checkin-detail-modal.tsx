import { Modal } from '@my-org/shared-ui';

interface CheckinDetailModalProps {
  checkin: any;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export const CheckinDetailModal = ({ checkin, isOpen, onClose, loading }: CheckinDetailModalProps) => {
  const formatDate = (date: any) => {
    if (date?.toDate) return date.toDate().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    return 'Unknown Date';
  };

  const DataItem = ({ label, value, unit = '' }: { label: string; value: any; unit?: string }) => (
    <div className="flex flex-col p-3 bg-gray-50 rounded-lg border border-gray-100">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-lg font-bold text-gray-900">{value !== undefined ? `${value} ${unit}` : 'N/A'}</span>
    </div>
  );

  const StatBadge = ({ label, value, max = 10 }: { label: string; value: number; max?: number }) => (
    <div className="flex flex-col p-3 bg-indigo-50 rounded-lg border border-indigo-100">
      <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{label}</span>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black text-indigo-900">{value}</span>
        <span className="text-sm text-indigo-400 mb-1">/ {max}</span>
      </div>
      <div className="w-full bg-indigo-200 h-1.5 rounded-full mt-2 overflow-hidden">
        <div
          className="bg-indigo-600 h-full rounded-full"
          style={{ width: `${(value / max) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="!max-w-4xl">
      <div className="bg-white rounded-2xl w-full h-full overflow-hidden flex flex-col shadow-2xl min-h-[400px]">
        {loading ? (
           <div className="flex-1 flex items-center justify-center">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
           </div>
        ) : checkin ? (
          <>
            <header className="bg-indigo-600 px-8 py-6 text-white shrink-0">
              <h2 className="text-2xl font-black tracking-tight">Check-in Details</h2>
              <p className="text-indigo-100 font-medium opacity-90">{formatDate(checkin.createdAt)}</p>
            </header>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* Photos Section */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Progress Photos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['Front', 'Back', 'Side'].map((label, index) => (
                    <div key={label} className="space-y-2">
                      <div className="aspect-[3/4] rounded-xl bg-gray-100 overflow-hidden border-2 border-gray-100 shadow-inner group relative">
                        {checkin.imgUrls?.[index] ? (
                          <img
                            src={checkin.imgUrls[index]}
                            alt={label}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 italic text-sm">
                            No photo
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <span className="text-white text-xs font-bold uppercase">{label} View</span>
                        </div>
                      </div>
                      <p className="text-center text-xs font-bold text-gray-500 uppercase">{label}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Lifestyle Section */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Lifestyle Stats
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatBadge label="Plan Accuracy" value={checkin.planAccuracy} />
                  <StatBadge label="Energy Level" value={checkin.energyLevel} />
                  <StatBadge label="Mood Check" value={checkin.moodCheck} />
                  <DataItem label="Sleep" value={checkin.hoursSlept} unit="hrs" />
                </div>
                <div className="mt-4">
                  <DataItem label="Daily Steps" value={checkin.dailySteps?.toLocaleString()} unit="steps" />
                </div>
              </section>

              {/* Measurements Section */}
              <section>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                  Body Measurements
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-3">
                  <DataItem label="Weight" value={checkin.kg} unit="kg" />
                  <DataItem label="Bust" value={checkin.breastSize} unit="cm" />
                  <DataItem label="Waist" value={checkin.waistSize} unit="cm" />
                  <DataItem label="Hips" value={checkin.hipSize} unit="cm" />
                  <DataItem label="Glutes" value={checkin.buttSize} unit="cm" />
                  <DataItem label="Left Thigh" value={checkin.leftThigh} unit="cm" />
                  <DataItem label="Right Thigh" value={checkin.rightThigh} unit="cm" />
                  <DataItem label="Left Arm" value={checkin.leftArm} unit="cm" />
                  <DataItem label="Right Arm" value={checkin.rightArm} unit="cm" />
                </div>
              </section>
            </div>

            <footer className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-colors uppercase tracking-widest text-xs"
              >
                Close Preview
              </button>
            </footer>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-gray-500">
            <p>Check-in data not found.</p>
            <button onClick={onClose} className="mt-4 text-indigo-600 font-bold">Close</button>
          </div>
        )}
      </div>
    </Modal>
  );
};
