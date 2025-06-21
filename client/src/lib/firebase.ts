// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCdRCUcczKIy_q5-MICVLAyDqGQinpDv3M",
  authDomain: "webmicrofasta.firebaseapp.com",
  projectId: "webmicrofasta",
  storageBucket: "webmicrofasta.firebasestorage.app",
  messagingSenderId: "704799157473",
  appId: "1:704799157473:web:f8e9e726e9773adf775ba0",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
