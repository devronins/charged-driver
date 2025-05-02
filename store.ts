// stateStore.ts
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DriverReducer, PermissionReducer, RideReducer, VehicleReducer } from '@/reducers';

// Combine all reducers
const rootReducer = combineReducers({
  Driver: DriverReducer,
  Permission: PermissionReducer,
  Vehicle: VehicleReducer,
  Ride: RideReducer,
});

// Configure redux-persist for React Native
const persistConfig = {
  key: 'root',
  storage: AsyncStorage, // ✅ Use AsyncStorage instead of localStorage
  whitelist: ['Driver', 'Vehicle', 'Ride'],
};

// Apply persist reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // ✅ disable to avoid warnings with non-serializable values
    }),
});

// Persistor instance
const persistor = persistStore(store);

// Types for app-wide usage
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks for dispatch and selector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store, persistor };
