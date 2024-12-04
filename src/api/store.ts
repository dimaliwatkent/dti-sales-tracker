import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./apiSlice";
import authReducer from "./auth/authSlice";
import eventReducer from "./event/eventSlice";
import businessReducer from "./business/businessSlice";
import saleReducer from "./sale/saleSlice";
import userReducer from "./user/userSlice";
import notificationReducer from "./notification/notificationSlice";
import productReducer from "./product/productSlice";

import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const authPersistConfig = {
  key: "auth",
  storage,
};

const eventPersistConfig = {
  key: "event",
  storage,
};

const businessPersistConfig = {
  key: "business",
  storage,
};

const salePersistConfig = {
  key: "sale",
  storage,
};

const userPersistConfig = {
  key: "user",
  storage,
};

const notificationPersistConfig = {
  key: "notification",
  storage,
};

const productPersistConfig = {
  key: "notification",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedEventReducer = persistReducer(eventPersistConfig, eventReducer);
const persistedBusinessReducer = persistReducer(
  businessPersistConfig,
  businessReducer,
);
const persistedSaleReducer = persistReducer(salePersistConfig, saleReducer);
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

const persistedNotificationReducer = persistReducer(
  notificationPersistConfig,
  notificationReducer,
);

const persistedProductReducer = persistReducer(
  productPersistConfig,
  productReducer,
);

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer,
    event: persistedEventReducer,
    business: persistedBusinessReducer,
    sale: persistedSaleReducer,
    user: persistedUserReducer,
    notification: persistedNotificationReducer,
    product: persistedProductReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;

export const persistor = persistStore(store);

export default store;
