import { createContext, useContext, useEffect } from "react";
import type { IUser } from "../types/user.types";
import { setLogoutHandler } from "../utils/authHandler";
import { setAuthToken } from "../api/axios";
import {
  useQuery,
  useQueryClient,
  type QueryObserverResult,
} from "@tanstack/react-query";
import { checkAuth } from "../api/auth.api";
import { OrbitProgress } from "react-loading-indicators";

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  logout: () => void;
  refetchUser: () => Promise<QueryObserverResult<any, any>>;
}

const AuthContext = createContext<IAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["authUser"],
    queryFn: checkAuth,
    retry: false,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const user = data?.user ?? null;
  const isAuthenticated = !!user;

  const logout = () => {
    setAuthToken(null);
    queryClient.setQueryData(["authUser"], null);
  };

  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <OrbitProgress dense color="#000000" size="medium" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logout,
        refetchUser: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
