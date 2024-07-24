import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth'

const firebaseConfig = {

  apiKey: "AIzaSyAP72-7govcVkF4rN9RS7ME8Uuna9VAMag",
  authDomain: "carlog-record.firebaseapp.com",
  projectId: "carlog-record",
  storageBucket: "carlog-record.appspot.com",
  messagingSenderId: "706183165791",
  appId: "1:706183165791:web:9d3d9752e821e1972968ea"
  
  };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const storage = getStorage()
export const auth = getAuth(app);