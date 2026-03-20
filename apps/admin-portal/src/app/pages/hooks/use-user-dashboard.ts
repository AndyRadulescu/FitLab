import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserInfo, fetchCheckins, fetchWeights } from '../../firestore/queries';

export const useUserDashboard = () => {
  const { userId, checkinId } = useParams<{ userId: string; checkinId?: string }>();
  const navigate = useNavigate();
  const [checkins, setCheckins] = useState<any[]>([]);
  const [weights, setWeights] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoading(true);
      setError(null);
      try {
        const [userData, checkinsData, weightsData] = await Promise.all([
          fetchUserInfo(userId),
          fetchCheckins(userId),
          fetchWeights(userId),
        ]);

        if (userData) {
          setUser(userData);
        }

        const weightsMap = new Map(weightsData.map((w: any) => [w.id, w.weight]));
        setWeights(weightsData);

        const list = checkinsData.map((data: any) => {
          return {
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

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return {
    user,
    checkins,
    weights,
    loading,
    error,
    selectedCheckin,
    checkinId,
    handleCloseModal,
    handleSelectCheckin,
    handleGoBack,
    userId
  };
};
