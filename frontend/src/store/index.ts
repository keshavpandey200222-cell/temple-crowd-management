import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import crowdReducer from './slices/crowdSlice';
import bookingReducer from './slices/bookingSlice';
import queueReducer from './slices/queueSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    crowd: crowdReducer,
    booking: bookingReducer,
    queue: queueReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
