import { redirect } from "next/navigation";

export default async function AssignmentsRedirect() {
    return redirect("/dashboard/teacher/classes");
}