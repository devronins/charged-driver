import { RideActions } from '@/reducers';
import { DriverModal } from '@/utils/modals/driver';
import {
  firebaseCollectionName,
  firebaseDriverRidesModal,
  firebaseRidesModal,
} from '@/utils/modals/firebase';
import { initializeApp } from 'firebase/app';
//@ts-ignore
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { onSnapshot, Unsubscribe } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RideModal, RideStatus } from '@/utils/modals/ride';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

//firebase error object
const firebaseErrorMap: Record<string, string> = {
  'auth/email-already-in-use': 'This email is already registered.',
  'auth/invalid-email': 'The email address is not valid.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/missing-password': 'Password is required.',
  'auth/invalid-credential': 'Invalid Credentials',
  'auth/current-user-session-not-found': 'Firebase current user session not exist',
  'firestore/listner-error': 'Firestore listner error',
  'firestore/record-not-found': 'Record not found',
};

export const formatFirebaseError = (code: any) => {
  const errorMessage = firebaseErrorMap[code] || 'An unexpected error occurred.';

  return {
    response: {
      status: 400,
    },
    data: {
      code: code,
      message: errorMessage,
    },
  };
};

const listenerMap = new Map<string, Unsubscribe>();
// API methods
export const firebaseApi = {
  // GET request
  loginWithEmailAndPassword: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      const data = await signInWithEmailAndPassword(auth, email, password);
      return data.user;
    } catch (error: any) {
      throw formatFirebaseError(error.code);
    }
  },
  registerUserWithEmailAndPassword: async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> => {
    try {
      const data = await createUserWithEmailAndPassword(auth, email, password);
      return data.user;
    } catch (error: any) {
      throw formatFirebaseError(error.code);
    }
  },
  get: async (collectionName: string): Promise<any> => {
    try {
      const dataCol = collection(db, collectionName);
      const dataSnapshot = await getDocs(dataCol);
      const dataList = dataSnapshot.docs.map((doc) => doc.data());
      return dataList;
    } catch (error: any) {
      const errorMessage = firebaseErrorMap[error.code] || 'An unexpected error occurred.';
      throw formatFirebaseError(error.code);
    }
  },
  getById: async ({
    collectionName,
    docId,
  }: {
    collectionName: string;
    docId: string;
  }): Promise<any> => {
    try {
      const dataCol = collection(db, collectionName);
      const dataSnapshot = await getDocs(dataCol);
      const dataList = dataSnapshot.docs.map((doc) => doc.data());
      const data = dataList?.find((ele) => ele?.id === docId);
      if (!data) throw { status: 401, message: 'document not found' };
      return data;
    } catch (error: any) {
      throw formatFirebaseError(error.code);
    }
  },
  getManyByIds: async ({
    collectionName,
    docIds,
  }: {
    collectionName: string;
    docIds: string[];
  }): Promise<any> => {
    try {
      const dataCol = collection(db, collectionName);
      const dataSnapshot = await getDocs(dataCol);
      const dataList = dataSnapshot.docs.map((doc) => doc.data());

      let data: any = [];
      docIds?.forEach((id) => {
        const res = dataList?.find((doc) => doc?.id === id);
        data.push(res);
      });
      if (!data) throw { status: 401, message: 'document not found' };
      return data;
    } catch (error) {
      throw error;
    }
  },
  getNewAccessToken: async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        const newToken = await auth.currentUser.getIdToken(true);
        return { accessToken: newToken };
      }
      throw { code: 'auth/current-user-session-not-found' };
    } catch (error: any) {
      console.log('136>>>>>>>', error);
      throw formatFirebaseError(error.code);
    }
  },

  cancelDriverRideByRideId: async (
    ride_id: number,
    driver_id: number,
    updateData: firebaseDriverRidesModal
  ): Promise<void> => {
    try {
      // Use Firestore query to filter by ride_id
      const dataCol = collection(db, firebaseCollectionName.DriverRides);
      const rideQuery = query(
        dataCol,
        where('ride_id', '==', ride_id),
        where('driver_id', '==', driver_id)
      );
      const snapshot = await getDocs(rideQuery);

      if (snapshot.empty) {
        throw new Error(`firestore/record-not-found`);
      }

      const targetDoc = snapshot.docs[0];
      const docRef = doc(db, firebaseCollectionName.DriverRides, targetDoc.id);

      console.log('176>>>>>>>', targetDoc, updateData);

      await updateDoc(docRef, { status: updateData.status });
    } catch (error: any) {
      const errorMessage = firebaseErrorMap[error.code] || 'An unexpected error occurred.';
      throw formatFirebaseError(error.code ?? error.message);
    }
  },

  //firebase listner
  startFirebaseDriverRideListner: async (dispatch: Function, driverDetails: DriverModal | null) => {
    try {
      const dataCol = collection(db, firebaseCollectionName.DriverRides);
      const queryInstance = query(dataCol, where('driver_id', '==', driverDetails?.id));
      const unsubscribe = onSnapshot(
        queryInstance,
        (snapshot) => {
          //@ts-ignore
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as firebaseDriverRidesModal[];
          console.log('Changes detected in:', firebaseCollectionName.DriverRides, data);
          dispatch(
            RideActions.setRideRequests({
              rideRequests: data?.filter((item) => !item.status),
            })
          );
        },
        (error) => {
          formatFirebaseError('firestore/listner-error');
        }
      );
      listenerMap.set(firebaseCollectionName.DriverRides, unsubscribe);
    } catch (err) {
      formatFirebaseError('firestore/listner-error');
    }
  },

  stopFirebaseDriverRideListener: (dispatch: Function) => {
    const unsubscribe = listenerMap.get(firebaseCollectionName.DriverRides);
    if (unsubscribe) {
      dispatch(RideActions.removeAllRideRequest({}));
      console.log(
        'Stopping Firestore listener for Collection...',
        firebaseCollectionName.DriverRides
      );
      unsubscribe();
      listenerMap.delete(firebaseCollectionName.DriverRides);
    } else {
      console.warn(`No active Firestore listener for ${firebaseCollectionName.DriverRides}`);
    }
  },

  startFirebaseRidesListner: async (dispatch: Function, activeRide: RideModal | null) => {
    try {
      const dataCol = collection(db, firebaseCollectionName.Rides);
      const queryInstance = query(
        dataCol,
        where('driver_id', '==', activeRide?.driver_id),
        where('ride_id', '==', activeRide?.id),
        where('status', '==', RideStatus.Cancelled)
      );
      const unsubscribe = onSnapshot(
        queryInstance,
        (snapshot) => {
          //@ts-ignore
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as firebaseRidesModal[];

          //we are assuming at same time, driver have only one acrive ride request
          console.log('Changes detected in:', firebaseCollectionName.Rides, data?.[0]);
          if (data?.[0]) {
            dispatch(
              RideActions.setActiveRideStatus({
                status: data?.[0]?.status,
              })
            );
          }
        },
        (error) => {
          formatFirebaseError('firestore/listner-error');
        }
      );
      listenerMap.set(firebaseCollectionName.Rides, unsubscribe);
    } catch (err) {
      formatFirebaseError('firestore/listner-error');
    }
  },

  stopFirebaseRidesListener: () => {
    const unsubscribe = listenerMap.get(firebaseCollectionName.Rides);
    if (unsubscribe) {
      console.log('Stopping Firestore listener for Collection...', firebaseCollectionName.Rides);
      unsubscribe();
      listenerMap.delete(firebaseCollectionName.Rides);
    } else {
      console.warn(`No active Firestore listener for ${firebaseCollectionName.Rides}`);
    }
  },
};
