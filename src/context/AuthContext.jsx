import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as store from '../services/store.js';

const AuthContext = createContext(null);

// The signed-in customer, shared across the site. `ready` turns true once the saved session
// has been read, so pages don't flash the sign-in form for a customer who is already signed in.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    store.getSession().then((u) => { setUser(u); setReady(true); });
  }, []);

  const login = useCallback(async (creds) => { const u = await store.login(creds); setUser(u); return u; }, []);
  const register = useCallback(async (data) => { const u = await store.register(data); setUser(u); return u; }, []);
  const logout = useCallback(async () => { await store.logout(); setUser(null); }, []);
  const updateProfile = useCallback(async (data) => { const u = await store.updateProfile(data); setUser(u); return u; }, []);

  const value = useMemo(() => ({ user, ready, login, register, logout, updateProfile }), [user, ready, login, register, logout, updateProfile]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
