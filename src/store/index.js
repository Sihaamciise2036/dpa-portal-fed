import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import RootReducer from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
// import AsyncStorage from '@react-native-async-storage/async-storage';

const persistConfig = {
    key: "root",
    version: 1,
    storage: storage,
};

const persistedReducer = persistReducer(persistConfig, RootReducer);

// // Create the logger middleware
// const loggerMiddleware = createLogger();
// const store = configureStore({
//     reducer: persistedReducer,
//     middleware: (getDefaultMiddleware) =>
//         getDefaultMiddleware({
//             serializableCheck: false,
//         }).concat(loggerMiddleware),
// });

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

persistStore(store);

export default store;
