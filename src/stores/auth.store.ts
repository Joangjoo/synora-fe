import { create } from "zustand";

interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
    set({ token, user, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; max-age=0";
    set({ token: null, user: null, isAuthenticated: false });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const user = JSON.parse(userStr) as User;
      set({ token, user, isAuthenticated: true });
    }
  },
}));
