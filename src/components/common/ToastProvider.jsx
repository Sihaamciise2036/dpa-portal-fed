import React, { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { initializeApp, getApps } from "firebase/app";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
import store from "@/store";
import { setDeviceToken } from "@/store/actions";
import "react-toastify/dist/ReactToastify.css";

const REQUIRED_FIREBASE_CONFIG_KEYS = [
    "notification_firebase_api_key",
    "notification_firebase_auth_domain",
    "notification_fcm_project_id",
    "notification_firebase_storage_bucket",
    "notification_firebase_messaging_sender_id",
    "notification_firebase_app_id",
    "notification_firebase_vapid_key",
];

export default function ToastProvider() {
    const { generalSetting } = useSelector((state) => state?.GeneralSetting);
    const messagingRef = useRef(null);
    const unsubscribeRef = useRef(null);

    const setupMessageHandler = useCallback(() => {
        if (!messagingRef.current) return;

        // Clear existing subscription if any
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }
        unsubscribeRef.current = onMessage(messagingRef.current, (payload) => {
            try {
                // Show toast notification
                toast(payload.notification?.body, {
                    type: "info",
                    title: payload.notification?.title,
                });

                // Show browser notification
                if (Notification.permission === "granted") {
                    new Notification(payload.notification?.title || "New Message", {
                        body: payload.notification?.body,
                        icon: payload.notification?.icon,
                        badge: payload.notification?.badge,
                        data: payload.data,
                        tag: payload.notification?.tag || "default",
                        requireInteraction: true,
                    });
                }
            } catch (error) {
                console.error("Error showing notification:", error);
            }
        });
    }, []);

    const requestPermissionAndToken = useCallback(async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                console.warn("Notification permission not granted");
                return;
            }

            if (!messagingRef.current) {
                throw new Error("Firebase messaging not initialized");
            }

            const currentToken = await getToken(messagingRef.current, {
                vapidKey: generalSetting?.notification_firebase_vapid_key,
            });

            if (!currentToken) {
                throw new Error("Failed to generate notification token");
            }

            await store.dispatch(setDeviceToken(currentToken));
            await setupMessageHandler();
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            toast.error("Failed to enable notifications");
        }
    }, [generalSetting?.notification_firebase_vapid_key, setupMessageHandler]);

    const initializeFirebase = useCallback(async () => {
        try {
            const hasFirebaseConfig = REQUIRED_FIREBASE_CONFIG_KEYS.every((key) => generalSetting?.[key]);
            if (!hasFirebaseConfig) {
                return;
            }

            const firebaseConfig = {
                apiKey: generalSetting.notification_firebase_api_key,
                authDomain: generalSetting.notification_firebase_auth_domain,
                projectId: generalSetting.notification_fcm_project_id,
                storageBucket: generalSetting.notification_firebase_storage_bucket,
                messagingSenderId: generalSetting.notification_firebase_messaging_sender_id,
                appId: generalSetting.notification_firebase_app_id,
                measurementId: generalSetting.notification_firebase_measurement_id,
            };

            // Check if Firebase is already initialized
            let app;
            if (!getApps().length) {
                app = initializeApp(firebaseConfig);
            } else {
                app = getApps()[0];
            }

            messagingRef.current = getMessaging(app);

            // Check notification support and initialize
            if ("Notification" in window) {
                if (Notification.permission === "granted") {
                    await requestPermissionAndToken();
                } else if (Notification.permission !== "denied") {
                    await requestPermissionAndToken();
                }
            } else {
                console.warn("This browser does not support notifications");
            }
        } catch (error) {
            console.error("Firebase initialization error:", error);
            toast.error("Failed to initialize notifications");
        }
    }, [generalSetting, requestPermissionAndToken]);

    useEffect(() => {
        initializeFirebase();
        return () => {
            // Cleanup message listener on unmount
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [initializeFirebase]);

    return <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />;
}
