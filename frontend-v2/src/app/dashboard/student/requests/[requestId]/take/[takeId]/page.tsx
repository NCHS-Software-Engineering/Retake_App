"use client";

import { useParams, useRouter } from "next/navigation";
import AttemptPage from "@/features/student/attempts/client/AttemptPage";

export default function TakePage() {
    const router = useRouter();
    const { takeId } = useParams();

    if (!takeId) {
        router.push("/dashboard/student");
        return null;
    }

    return <AttemptPage />;
}
