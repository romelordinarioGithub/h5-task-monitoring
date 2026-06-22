import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const allowedDomains = [
  process.env.REACT_APP_SMARTLYDOMAIN,
  process.env.REACT_APP_ADLIBDOMAIN,
];

export const firebaseSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const email = result.user.email;
    const domain = email.split('@')[1];
    if (!allowedDomains.includes(domain)) {
      await firebaseSignOut();
      throw 'Account does not exist';
    }

    return { success: true, data: result?.user };
  } catch (error) {
    console.log(error.message);
    return { success: false, error: 'Sign-in failed! Please try again' };
  }
};

export const firebaseSignOut = async () => {
  await signOut(auth);
};
