"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
    useMemo,
} from "react";
import { User } from "@/shared/types/user";
import { fetchProfile } from "../services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refresh: async () => {},
    setUser: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const refresh = useCallback(async () => {
        setLoading(true);
        try {
            const { user } = await fetchProfile();
            setUser(user);
        } catch {
            setUser(null); // User is just not signed in
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const value = useMemo(() => ({ user, loading, refresh, setUser }),
        [user, loading, refresh]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}