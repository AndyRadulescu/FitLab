import { useEffect, useState } from 'react';
import { userStore } from '../store/user.store';
import { fetchCheckins, fetchClientIds, fetchUserInfo, fetchWeights } from '../firestore/queries';
import { AllUserData } from '@my-org/core';

export const useFetchClients = (coachId: string | undefined) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const setUserList = userStore((state) => state.setUserList);
  const setUserProfile = userStore((state) => state.setUserProfile);

  useEffect(() => {
    const fetchFullClientData = async () => {
      if (!coachId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setIsUnauthorized(false);

      try {
        // Step 1: Verify coach / admin permissions
        const profile = await fetchUserInfo(coachId);
        setUserProfile(profile);

        const isCoachOrAdmin = profile && (profile.isCoach === true || profile.isAdmin === true);
        if (!isCoachOrAdmin) {
          setIsUnauthorized(true);
          setUserList(null);
          setLoading(false);
          return;
        }

        // Step 2: Fetch and enrich client data
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
          setError('Permission Required: You must have coach or administrative privileges to view client data.');
          setIsUnauthorized(true);
        } else {
          setError(`An error occurred: ${error.message || 'Unknown error'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFullClientData();
  }, [coachId, setUserList, setUserProfile]);

  return { loading, error, isUnauthorized };
};

