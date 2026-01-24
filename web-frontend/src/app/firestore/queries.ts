import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { db } from '../../init-firebase-auth';

export const getStartDataQuery = (user: firebase.User)=> {
  return query(
    collection(db, 'start'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
}

export const getCheckinQuery = (user: firebase.User)=> {
  return query(
    collection(db, 'checkins'),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
}
