import { API_BASE } from "@/constants/env";
import { ProfileResponse } from "../types/auth";
import { cookies } from "next/headers";

export async function fetchProfileServer(): Promise<ProfileResponse> {
    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();
    const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "GET",
        headers: {
            Cookie: cookieHeader,
        },
        credentials: "include",
    });
    if (!res.ok) {
        return {user: null};
    }

    return res.json();
}