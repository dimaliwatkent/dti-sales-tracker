import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistReducer, persistStore } from "redux-persist";
import { api } from "./api";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";

// const rootReducer = combineReducers({ user: userReducer });
const rootReducer = userReducer;

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);
