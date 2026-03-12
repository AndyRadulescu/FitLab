import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { CheckinList } from '../components/checkin-list';
import { Button } from '@my-org/shared-ui';
import { CheckinDetailModal } from '../components/checkin-detail-modal';

export const UserDashboard = () => {
  const { userId, checkinId } = useParams<{ userId: string; checkinId?: string }>();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);
      try {
        // Fetch user info
        const userDoc = await getDoc(doc(db, 'users', userId));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        }

        // Fetch checkins
        const checkinsQuery = query(
          collection(db, 'checkins'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(checkinsQuery);
        
        // Fetch weights
        const weightsQuery = query(
          collection(db, 'weights'),
          where('userId', '==', userId)
        );
        const weightsSnapshot = await getDocs(weightsQuery);
        const weightsMap = new Map(weightsSnapshot.docs.map(doc => [doc.id, doc.data().weight]));

        const list = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            kg: weightsMap.get(data.weightId) || data.kg // Fallback to data.kg for legacy checkins
          };
        });
        setCheckins(list);
      } catch (err: any) {
        console.error('Error fetching user data:', err);
        setError(`Failed to load user data: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const selectedCheckin = useMemo(() => {
    if (!checkinId) return null;
    return checkins.find(c => c.id === checkinId);
  }, [checkinId, checkins]);

  const handleCloseModal = () => {
    navigate(`/dashboard/${userId}`);
  };

  const handleSelectCheckin = (cid: string) => {
    navigate(`/dashboard/${userId}/${cid}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-700">{error}</p>
        <Button type="tertiary" onClick={() => navigate('/dashboard')} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
              {user?.displayName || user?.email || 'User'}'s Dashboard
            </h2>
            <div className="flex flex-col md:flex-row md:items-center gap-x-6 gap-y-1 mt-1">
              {user?.email && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mr-1.5 whitespace-nowrap">Email:</span>
                  <span className="font-medium text-gray-600 truncate max-w-xs">{user.email}</span>
                </div>
              )}
              {user?.id && (
                <div className="flex items-center text-sm text-gray-500">
                  <span className="font-bold text-gray-400 uppercase text-[10px] tracking-widest mr-1.5 whitespace-nowrap">User ID:</span>
                  <code className="bg-gray-100/80 px-1.5 py-0.5 rounded text-xs font-mono text-gray-600 border border-gray-200/50">{user.id}</code>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-xl p-6 border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Check-in History</h3>
        <CheckinList checkins={checkins} onSelectCheckin={handleSelectCheckin} />
      </div>

      {checkinId && (
        <CheckinDetailModal
          checkin={selectedCheckin}
          isOpen={!!checkinId}
          onClose={handleCloseModal}
          loading={!selectedCheckin && loading}
        />
      )}
    </div>
  );
};
