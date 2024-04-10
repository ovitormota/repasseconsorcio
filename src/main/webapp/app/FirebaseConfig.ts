import { initializeApp } from 'firebase/app'

import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: 'AIzaSyDqpA3Qzonx-KhG7ru6V_FG-ZpDBPwLg9M',
  authDomain: 'repasseconsorcio-7fb64.firebaseapp.com',
  projectId: 'repasseconsorcio-7fb64',
  storageBucket: 'repasseconsorcio-7fb64.appspot.com',
  messagingSenderId: '536151546974',
  appId: '1:536151546974:web:e526a4d2855b8cdefb68cf',
  measurementId: 'G-QJ2QCGLXBD',
}

const app = initializeApp(firebaseConfig)

export const messaging = getMessaging(app)
