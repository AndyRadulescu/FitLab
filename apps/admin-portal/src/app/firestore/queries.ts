import { collection, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { USERS_TABLE, CHECKINS_TABLE, WEIGHT_TABLE } from './constants';

export const fetchUserInfo = async (userId: string) => {
  const userDoc = await getDoc(doc(db, USERS_TABLE, userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const fetchCheckins = async (userId: string) => {
  const checkinsQuery = query(
    collection(db, CHECKINS_TABLE),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(checkinsQuery);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const fetchWeights = async (userId: string) => {
  const weightsQuery = query(
    collection(db, WEIGHT_TABLE),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );
  const weightsSnapshot = await getDocs(weightsQuery);
  return weightsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
