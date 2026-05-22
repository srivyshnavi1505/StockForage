import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Axios instance — base URL + credentials in one place
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Auto-attach JWT from store to every request
api.interceptors.request.use((config) => {
  const token = useAuth.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});



// Auto-logout on 401 (expired/invalid token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useAuth.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);



export { api }; // use this `api` instance everywhere instead of plain axios

export const useAuth = create(
  // persist saves to localStorage automatically — survives refresh
  persist(
    (set, get) => ({
      currentUser: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      login: async (userCredObj) => {
        try {
          set({ loading: true, error: null });

          const res = await api.post("/user-api/login", userCredObj);

          // Expect backend to return { payload: userObj, token: "jwt..." }
          const { payload, token } = res.data;

          set({
            loading: false,
            isAuthenticated: true,
            currentUser: payload,
            token,
            error: null,
          });
          get().fetchWatchlist();
        } catch (err) {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            token: null,
            error: err.response?.data?.message || "Login failed",
          });
        }
      },
      

      logout: async () => {
        try {
          set({ loading: true, error: null });
          await api.get("/user-api/logout");
        } catch {
          // Even if server logout fails, clear client state
        } finally {
          set({
            loading: false,
            isAuthenticated: false,
            currentUser: null,
            token: null,
            error: null,
          });
        }
      },

      // Call this once on app boot to revalidate persisted token
      verifySession: async () => {
        const { token } = get();
        if (!token) return;

        try {
          const res = await api.get("/user-api/verify");
          set({ currentUser: res.data.payload, isAuthenticated: true });
          get().fetchWatchlist();
        } catch {
          // Token expired — clear everything
          get().logout();
        }
      },

      watchlist: [],
      fetchWatchlist: async () => {
        try {
          const res = await api.get("/user-api/watchlist");
          set({ watchlist: res.data.payload || [] });
        } catch (err) {
          console.error("Failed to fetch watchlist", err);
        }
      },
      toggleWatchlist: async (symbol) => {
        try {
          const res = await api.post("/user-api/watchlist", { symbol });
          set({ watchlist: res.data.payload || [] });
        } catch (err) {
          console.error("Failed to toggle watchlist", err);
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",         // localStorage key
      partialize: (state) => ({     // only persist these fields
        token: state.token,
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);