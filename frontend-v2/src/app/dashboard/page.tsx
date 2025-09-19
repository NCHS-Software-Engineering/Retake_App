import { redirect } from "next/navigation";
import { fetchProfileServer } from "@/features/auth/services/serverAuthService";

export default async function DashboardEntry() {
    const {user} = await fetchProfileServer();
    if(user === null) {
        return redirect("/auth");
    }

    if(user.role === "teacher") {
        return redirect("/dashboard/teacher");
    }
    if(user.role === "student") {
        return redirect("/dashboard/student");
    }

    return redirect("/auth");
}