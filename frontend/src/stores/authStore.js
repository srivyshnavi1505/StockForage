import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {

    // Only clear auth if session is confirmed and not still loading
    const { isAuthenticated, sessionLoading } = useAuth.getState();
    if (
      error.response?.status === 401 &&
      isAuthenticated &&
      !sessionLoading
    ) {
      useAuth.setState({
        currentUser: null,
        isAuthenticated: false,
        watchlist: [],
        error: "Session expired",
      });
    }

    return Promise.reject(error);
  }
);

export { api };


export const useAuth = create(

  persist(

    (set, get) => ({

      currentUser: null,
      isAuthenticated: false,
      sessionLoading: true,   // true until first verifySession() completes
      loading: false,
      error: null,
      watchlist: [],


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

          // fetch watchlist after login
          await get().fetchWatchlist();

          return true;

        } catch (error) {

          set({
            currentUser: null,
            isAuthenticated: false,
            loading: false,
            error:
              error.response?.data?.message ||
              "Login failed",
          });

          return false;
        }
      },


      register: async (newUser) => {

        try {

          set({
            loading: true,
            error: null,
          });

          const res = await api.post(
            "/user-api/register",
            newUser
          );

          set({
            loading: false,
            error: null,
          });

          return {
            success: true,
            data: res.data,
          };

        } catch (error) {

          set({
            loading: false,
            error:
              error.response?.data?.message ||
              "Registration failed",
          });

          return {
            success: false,
          };
        }
      },


      logout: async () => {

        try {

          await api.get(
            "/user-api/logout"
          );

        } catch (error) {

          console.log(
            "Logout API failed",
            error
          );

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


      verifySession: async () => {

        set({ sessionLoading: true });

        try {

          const res = await api.get(
            "/user-api/verify"
          );

          set({
            currentUser: res.data.payload,
            isAuthenticated: true,
            sessionLoading: false,
            error: null,
          });

          await get().fetchWatchlist();

        } catch (error) {

          console.log(
            "Session verification failed"
          );

          set({
            currentUser: null,
            isAuthenticated: false,
            sessionLoading: false,
            watchlist: [],
          });
        }
      },

  

      fetchWatchlist: async () => {

        try {

          const res = await api.get(
            "/user-api/watchlist"
          );

          set({
            watchlist:
              res.data.payload || [],
          });

        } catch (error) {

          console.log(
            "Failed to fetch watchlist",
            error
          );
        }
      },



      toggleWatchlist: async (
        symbol
      ) => {

        try {

          const res = await api.post(
            "/user-api/watchlist",
            { symbol }
          );

          set({
            watchlist:
              res.data.payload || [],
          });

        } catch (error) {

          console.log(
            "Failed to toggle watchlist",
            error
          );
        }
      },


      clearError: () => {

        set({
          error: null,
        });
      },
    }),


    {
      name: "auth-storage",

      partialize: (state) => ({
        currentUser:
          state.currentUser,
      }),
    }
  )
);