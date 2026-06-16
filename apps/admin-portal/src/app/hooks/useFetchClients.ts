import { useEffect, useState } from 'react';
import { userStore } from '../store/user.store';
import { fetchCheckins, fetchClientIds, fetchWeights } from '../firestore/queries';
import { AllUserData } from '@my-org/core';

export const useFetchClients = (coachId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const setUserList = userStore((state) => state.setUserList);

  useEffect(() => {
    const fetchFullClientData = async () => {
      if (!coachId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const clients = await fetchClientIds(coachId);
        
        const enrichedClients = await Promise.all(
          clients.map(async (client) => {
            const [checkins, weights] = await Promise.all([
              fetchCheckins(client.id),
              fetchWeights(client.id)
            ]);
            
            return {
              ...client,
              checkins,
              weights
            } as AllUserData;
          })
        );

        setUserList(enrichedClients);
      } catch (err: unknown) {
        console.error('Error fetching enriched client list:', err);
        const error = err as { code?: string; message?: string };
        if (error.code === 'permission-denied') {
          setError('Permission Required: You must have administrative privileges to view the registered users list.');
        } else {
          setError(`An error occurred: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFullClientData();
  }, [coachId, setUserList]);

  return { loading, error };
};
