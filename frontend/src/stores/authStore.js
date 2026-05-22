import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ================= AXIOS INSTANCE =================

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(
  (res) => res,

  async (err) => {

    // Prevent infinite logout loops
    if (
      err.response?.status === 401 &&
      useAuth.getState().isAuthenticated
    ) {

      useAuth.setState({
        currentUser: null,
        isAuthenticated: false,
        error: "Session expired",
      });
    }

    return Promise.reject(err);
  }
);

export { api };

// ================= AUTH STORE =================

export const useAuth = create(

  persist(

    (set, get) => ({

      // ---------- STATE ----------

      currentUser: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      watchlist: [],

      // ================= LOGIN =================

      login: async (userCredObj) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const res = await api.post(
            "/user-api/login",
            userCredObj
          );

          const { payload } = res.data;

          set({
            currentUser: payload,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          await get().fetchWatchlist();

          return true;

        } catch (err) {

          set({
            loading: false,
            currentUser: null,
            isAuthenticated: false,
            error:
              err.response?.data?.message ||
              "Login failed",
          });

          return false;
        }
      },

      // ================= LOGOUT =================

      logout: async () => {

        try {

          await api.get("/user-api/logout");

        } catch (err) {

          console.log("Logout API failed");

        } finally {

          set({
            currentUser: null,
            isAuthenticated: false,
            loading: false,
            error: null,
            watchlist: [],
          });
        }
      },

      // ================= VERIFY SESSION =================

      verifySession: async () => {

        try {

          const res = await api.get("/user-api/verify");

          set({
            currentUser: res.data.payload,
            isAuthenticated: true,
          });

          await get().fetchWatchlist();

        } catch (err) {

          console.log("Session verification failed");

          set({
            currentUser: null,
            isAuthenticated: false,
          });
        }
      },

      // ================= WATCHLIST =================

      fetchWatchlist: async () => {

        try {

          const res = await api.get(
            "/user-api/watchlist"
          );

          set({
            watchlist: res.data.payload || [],
          });

        } catch (err) {

          console.log(
            "Failed to fetch watchlist",
            err
          );
        }
      },

      toggleWatchlist: async (symbol) => {

        try {

          const res = await api.post(
            "/user-api/watchlist",
            { symbol }
          );

          set({
            watchlist: res.data.payload || [],
          });

        } catch (err) {

          console.log(
            "Failed to toggle watchlist",
            err
          );
        }
      },

      // ================= CLEAR ERROR =================

      clearError: () =>
        set({
          error: null,
        }),
    }),

    // ================= PERSIST =================

    {
      name: "auth-storage",

      partialize: (state) => ({
        currentUser: state.currentUser,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);