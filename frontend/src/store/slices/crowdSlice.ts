import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Zone {
  zone_id: string;
  zone_name: string;
  zone_type: string;
  max_capacity: number;
  current_occupancy: number;
  alert_level: 'green' | 'yellow' | 'red';
}

interface CrowdState {
  zones: Zone[];
  loading: boolean;
  error: string | null;
}

const initialState: CrowdState = {
  zones: [],
  loading: false,
  error: null,
};

const crowdSlice = createSlice({
  name: 'crowd',
  initialState,
  reducers: {
    setZones: (state, action: PayloadAction<Zone[]>) => {
      state.zones = action.payload;
    },
    updateZone: (state, action: PayloadAction<Zone>) => {
      const index = state.zones.findIndex((z) => z.zone_id === action.payload.zone_id);
      if (index !== -1) {
        state.zones[index] = action.payload;
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

export const { setZones, updateZone, setLoading, setError } = crowdSlice.actions;
export default crowdSlice.reducer;
