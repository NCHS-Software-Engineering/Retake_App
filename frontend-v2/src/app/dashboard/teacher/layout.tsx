import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { fetchProfileServer } from "@/features/auth/services/serverAuthService";
import { ClassProvider } from "@/features/teacher/common/client/ClassContext";
import TeacherSideNavbar from "@/features/teacher/dashboard/client/TeacherSideNavbar";

// Might need to make TeacherSideNavbar dynamic from next/dynamic to prevent ssr errors (getting in dev) 

export default async function TeacherDashboardLayout({ children }: { children: ReactNode }) {
    const { user } = await fetchProfileServer();
    if (user === null) {
        return redirect("/auth");
    }

    if (user.role !== "teacher") {
        return redirect("/auth");
    }

    return (
        <div className="flex">
            <ClassProvider>
                <TeacherSideNavbar />
                <main className="flex-1 pt-16 px-4 md:px-8 md:ml-64">
                    {children}
                </main>
            </ClassProvider>
        </div>
    )
}