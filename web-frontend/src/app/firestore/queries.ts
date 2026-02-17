import { collection, limit, orderBy, query, where } from 'firebase/firestore';
import firebase from 'firebase/compat/app';
import { db } from '../../init-firebase-auth';

export const USERS_TABLE = 'users';
export const CHECKINS_TABLE = 'checkins';
export const WEIGHT_TABLE = 'weights';
export const CHECKINS_STORAGE = 'checkin-imgs/'

export const getStartDataQuery = (user: firebase.User)=> {
  return query(
    collection(db, USERS_TABLE),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc'),
    limit(1)
  );
}

export const getCheckinQuery = (user: firebase.User)=> {
  return query(
    collection(db, CHECKINS_TABLE),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
}


export const getWeightQuery = (user: firebase.User)=> {
  return query(
    collection(db, WEIGHT_TABLE),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
}
