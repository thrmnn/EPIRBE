import { useState, useCallback } from "react";

const TOKEN_KEY = "epirbe_admin_token";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );
  const [isAdmin, setIsAdmin] = useState(!!token);

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();
      const newToken = data.token as string;

      localStorage.setItem(TOKEN_KEY, newToken);
      setToken(newToken);
      setIsAdmin(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setIsAdmin(false);
  }, []);

  return { isAdmin, token, login, logout };
}
