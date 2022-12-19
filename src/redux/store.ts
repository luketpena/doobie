import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { api } from '../services/api';
import authenticationReducer from './authentication-slice';

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    authentication: authenticationReducer,
  },
  middleware: (getDefaultMiddleware) => {
    console.info('Store middleware init');
    return getDefaultMiddleware().concat(api.middleware);
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
