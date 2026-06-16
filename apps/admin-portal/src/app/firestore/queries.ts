import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import { CheckInFormDataDto, CHECKINS_TABLE, User, USERS_TABLE, WEIGHT_TABLE, WeightString } from './constants';

export const fetchUserInfo = async (userId: string) => {
  const userDoc = await getDoc(doc(db, USERS_TABLE, userId));
  if (userDoc.exists()) {
    return { id: userDoc.id, ...userDoc.data() };
  }
  return null;
};

export const updateUserName = async (userId: string, displayName: string) => {
  const userRef = doc(db, USERS_TABLE, userId);
  await updateDoc(userRef, { displayName });
};

export const fetchCheckins = async (userId: string) => {
  const checkinsQuery = query(
    collection(db, CHECKINS_TABLE),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(checkinsQuery);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt
    } as CheckInFormDataDto;
  });
};

export const fetchWeights = async (userId: string) => {
  const weightsQuery = query(
    collection(db, WEIGHT_TABLE),
    where('userId', '==', userId),
    orderBy('createdAt', 'asc')
  );
  const weightsSnapshot = await getDocs(weightsQuery);
  return weightsSnapshot.docs.map(doc => {
    const data = doc.data();

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt
    } as WeightString;
  });
};

export const fetchClientIds = async (coachId: string): Promise<User[]> => {
  const connectionsQuery = query(
    collection(db, 'connections'),
    where('coachId', '==', coachId),
    where('status', '==', 'active')
  );

  const connectionsSnapshot = await getDocs(connectionsQuery);
  const clientIds = connectionsSnapshot.docs.map(doc => doc.data().clientId);

  if (clientIds.length === 0) {
    return [];
  }

  const usersQuery = query(
    collection(db, 'users'),
    where('__name__', 'in', clientIds)
  );

  const usersSnapshot = await getDocs(usersQuery);
  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as unknown as User[] ?? [];
}

