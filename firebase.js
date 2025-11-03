// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

// ✅ إعدادات مشروعك في Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBC5IqUYQeJqCda2zc9Ct7UO8VwzBAFf10",
  authDomain: "mirtah-dajaj.firebaseapp.com",
  projectId: "mirtah-dajaj",
  storageBucket: "mirtah-dajaj.appspot.com",
  messagingSenderId: "621712846145",
  appId: "1:621712846145:web:492d6bad123b3ae54c85c0",
  measurementId: "G-8K08NBY2FL"
};

// 🔥 تشغيل Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

// ✅ تصدير المتغيرات دي لأي ملف تاني يستخدمها
export { app, analytics, db, auth, storage };
