import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Queue {
  queue_id: string;
  queue_name: string;
  current_count: number;
  max_capacity: number;
  estimated_wait_time: number;
  status: string;
}

interface QueueState {
  queues: Queue[];
  loading: boolean;
  error: string | null;
}

const initialState: QueueState = {
  queues: [],
  loading: false,
  error: null,
};

const queueSlice = createSlice({
  name: 'queue',
  initialState,
  reducers: {
    setQueues: (state, action: PayloadAction<Queue[]>) => {
      state.queues = action.payload;
    },
    updateQueue: (state, action: PayloadAction<Queue>) => {
      const index = state.queues.findIndex((q) => q.queue_id === action.payload.queue_id);
      if (index !== -1) {
        state.queues[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setQueues, updateQueue, setLoading, setError } = queueSlice.actions;
export default queueSlice.reducer;
