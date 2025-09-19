import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { fetchProfileServer } from "@/features/auth/services/serverAuthService";

export default async function StudentDashboardLayout({ children }: { children: ReactNode }) {
    const { user } = await fetchProfileServer();
    if (user === null) {
        return redirect("/auth");
    }

    if (user.role !== "student") {
        return redirect("/auth");
    }

    return <>{children}</>
}