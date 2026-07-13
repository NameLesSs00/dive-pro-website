import { RootState } from '@/store/store';

export const selectAuthSession = (state: RootState) => state.auth.session;
export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;
export const selectAccessToken = (state: RootState) => state.auth.session?.accessToken ?? null;
export const selectAdminEmail = (state: RootState) => state.auth.session?.email ?? null;
export const selectAdminRoles = (state: RootState) => state.auth.session?.roles ?? [];
