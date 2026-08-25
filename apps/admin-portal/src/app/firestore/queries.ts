import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../init-firebase-auth';
import {
  CheckInFormDataDto,
  CHECKINS_TABLE,
  Connection,
  CONNECTIONS_TABLE,
  ConnectionStatus,
  User,
  USERS_TABLE,
  WEIGHT_TABLE,
  WeightString
} from './constants';

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

export const unlinkClient = async (coachId: string, clientId: string): Promise<void> => {
  const connectionsQuery = query(
    collection(db, CONNECTIONS_TABLE),
    where('coachId', '==', coachId),
    where('clientId', '==', clientId),
    where('status', '==', 'active')
  );

  const snapshot = await getDocs(connectionsQuery);
  const updatePromises = snapshot.docs.map(doc => updateDoc(doc.ref, { status: 'unlinked' as ConnectionStatus }));
  await Promise.all(updatePromises);
};

export const linkClient = async (coachId: string, clientId: string): Promise<void> => {
  const connectionsQuery = query(
    collection(db, CONNECTIONS_TABLE),
    where('coachId', '==', coachId),
    where('clientId', '==', clientId)
  );

  const snapshot = await getDocs(connectionsQuery);
  if (!snapshot.empty) {
    const updatePromises = snapshot.docs.map(doc => updateDoc(doc.ref, { status: 'active' as ConnectionStatus }));
    await Promise.all(updatePromises);
  } else {
    const newConnection: Omit<Connection, 'id'> = {
      coachId,
      clientId,
      status: 'active',
      createdAt: new Date()
    };
    await addDoc(collection(db, CONNECTIONS_TABLE), newConnection);
  }
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

export const fetchClientIds = async (coachId: string, statusFilter?: ConnectionStatus): Promise<User[]> => {
  const connectionsQuery = statusFilter
    ? query(
        collection(db, CONNECTIONS_TABLE),
        where('coachId', '==', coachId),
        where('status', '==', statusFilter)
      )
    : query(
        collection(db, CONNECTIONS_TABLE),
        where('coachId', '==', coachId)
      );

  const connectionsSnapshot = await getDocs(connectionsQuery);
  if (connectionsSnapshot.empty) {
    return [];
  }

  const clientStatusMap = new Map<string, ConnectionStatus>();
  connectionsSnapshot.docs.forEach(doc => {
    const data = doc.data() as Connection;
    const clientId = data.clientId;
    if (!clientId) return;
    const status: ConnectionStatus = data.status || 'active';
    // If client has multiple connection records, 'active' takes precedence
    if (!clientStatusMap.has(clientId) || status === 'active') {
      clientStatusMap.set(clientId, status);
    }
  });

  const clientIds = Array.from(clientStatusMap.keys());
  if (clientIds.length === 0) {
    return [];
  }

  const chunks: string[][] = [];
  for (let i = 0; i < clientIds.length; i += 30) {
    chunks.push(clientIds.slice(i, i + 30));
  }

  const userSnapshots = await Promise.all(
    chunks.map(chunk =>
      getDocs(
        query(
          collection(db, USERS_TABLE),
          where('__name__', 'in', chunk)
        )
      )
    )
  );

  const users: User[] = [];
  userSnapshots.forEach(usersSnapshot => {
    usersSnapshot.docs.forEach(doc => {
      const status = clientStatusMap.get(doc.id) || 'active';
      const userData = doc.data();
      users.push({
        id: doc.id,
        userId: doc.id,
        ...userData,
        connectionStatus: status
      } as User);
    });
  });

  return users;
};


