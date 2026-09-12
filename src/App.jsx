import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { authCheck } from "@/store/actions";
import "./App.css";
import store from "./store";
import Routing from "./routes";
import { APP_ENVIRONMENT } from "./constants/ApiConstant";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./guard/AuthProvider";
import ToastProvider from "./components/common/ToastProvider";

store.dispatch(authCheck());

function App() {
    useEffect(() => {
        if (APP_ENVIRONMENT && APP_ENVIRONMENT === "production") {
            console.log = function () {};
            console.info = function () {};
            console.warn = function () {};
            console.error = function () {};
        }
    }, []);
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker
            .register("/firebase-messaging-sw.js?v=1")
            .then((registration) => {
                // console.log("Service Worker registered:", registration);
            })
            .catch((error) => {
                console.error("Service Worker registration failed:", error);
            });
    }
    return (
        <Provider store={store}>
            <ToastProvider />
            <AuthProvider>
                <BrowserRouter>
                    <Routing />
                </BrowserRouter>
            </AuthProvider>
        </Provider>
    );
}

export default App;
