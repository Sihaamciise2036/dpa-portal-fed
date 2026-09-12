importScripts("./assets/js/firebase/firebase-app-compat.js");
importScripts("./assets/js/firebase/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyBm8IoWFzIIeEX6PcYOyuYyx-vGgnlOsz0",
    authDomain: "foodscan-e51f1.firebaseapp.com",
    projectId: "foodscan-e51f1",
    messagingSenderId: "448296373438",
    appId: "1:448296373438:web:c60e27dcf714c9d7b9e2ef",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log("Received background message:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
