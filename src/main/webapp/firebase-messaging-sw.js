/* eslint-disable no-undef */

// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.15.0/firebase-messaging-compat.js')

// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: 'AIzaSyDqpA3Qzonx-KhG7ru6V_FG-ZpDBPwLg9M',
  authDomain: 'repasseconsorcio-7fb64.firebaseapp.com',
  projectId: 'repasseconsorcio-7fb64',
  storageBucket: 'repasseconsorcio-7fb64.appspot.com',
  messagingSenderId: '536151546974',
  appId: '1:536151546974:web:e526a4d2855b8cdefb68cf',
  measurementId: 'G-QJ2QCGLXBD',
}

firebase.initializeApp(firebaseConfig)

// Retrieve firebase messaging
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title
  const notificationOptions = {
    body: payload.data.body,
    icon: '../content/images/512x512.png',
  }

  self.addEventListener('notificationclick', function (event) {
    event.notification.close()
    event.waitUntil(clients.openWindow('https://app.repasseconsorcio.com.br' + payload.data.redirectUrl))
  })

  return self.registration.showNotification(notificationTitle, notificationOptions)
})
