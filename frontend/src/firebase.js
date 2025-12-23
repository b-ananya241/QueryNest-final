import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBnI1eLN0mbDVYx5IWySSWM_VViw29cfwg",
  authDomain: "querynest-b1bf6.firebaseapp.com",
  databaseURL: "https://querynest-b1bf6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "querynest-b1bf6",
  storageBucket: "querynest-b1bf6.firebasestorage.app",
  messagingSenderId: "524115108878",
  appId: "1:524115108878:web:583febab60a9642eb3885f"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);

export default app;