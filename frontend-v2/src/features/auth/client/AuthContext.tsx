"use client";

import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from "react";
import { User } from "@/shared/types/user";
import { fetchProfile } from "../services/authService";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    refresh: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    refresh: async () => { },
})

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
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return (
        <AuthContext.Provider value={{ user, loading, refresh }}>
            {children}
        </AuthContext.Provider>
    )
}