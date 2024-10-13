import { User } from "@/services/user/types";
import { getTokenCookie, setTokenCookie } from "@/utils/cookies";
import { create } from "zustand";

interface AuthStore {
  accessToken?: string;
  refreshToken?: string;
  setToken: (accessToken: string, refreshToken: string) => void;
  user?: User;
  setUser: (user: User) => void;
  resetAuth: () => void;
}

const intialState = getTokenCookie();

export const useAuthStore = create<AuthStore>((setState) => ({
  setToken: (accessToken: string, refreshToken: string) => {
    setState((state) => ({ ...state, accessToken, refreshToken }));
    setTokenCookie(accessToken, refreshToken);
  },
  accessToken: intialState?.accessToken,
  refreshToken: intialState?.refreshToken,
  setUser: (user: User) => setState((state) => ({ ...state, user })),
  resetAuth: () => {
    return setState((state) => ({
      ...state,
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,
    }));
  },
}));
