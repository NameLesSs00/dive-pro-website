import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthSession } from '@/lib/models/auth';

interface AuthState {
  session: AuthSession | null;
  hydrated: boolean;
}

const initialState: AuthState = {
  session: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth(state, action: PayloadAction<AuthSession | null>) {
      state.session = action.payload;
      state.hydrated = true;
    },
    setAuthSession(state, action: PayloadAction<AuthSession>) {
      state.session = action.payload;
      state.hydrated = true;
    },
    clearAuthSession(state) {
      state.session = null;
      state.hydrated = true;
    },
  },
});

export const { clearAuthSession, hydrateAuth, setAuthSession } = authSlice.actions;
export default authSlice.reducer;
