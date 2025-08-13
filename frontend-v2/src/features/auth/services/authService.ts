import { API_BASE } from "@/constants/env";
import { ProfileResponse } from "../types/auth";

export async function fetchProfile(): Promise<ProfileResponse> {
    const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        throw new Error(`Fetch failed: ${res.status}`);
    }
    return res.json();
}