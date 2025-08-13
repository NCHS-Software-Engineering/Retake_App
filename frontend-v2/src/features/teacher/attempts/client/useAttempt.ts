import { useState, useEffect } from "react";
import { fetchAttempt, Attempt } from "../services/attemptService";
import { useClass } from "../../common/client/useClass";

export function useAttempt(
    requestId?: number,
    attemptId?: number
): { data?: Attempt; loading: boolean; error?: string } {
    const [data, setData] = useState<Attempt>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();
    const { setAttemptId, setRequestId } = useClass();

    useEffect(() => {
        if (requestId && attemptId) {
            fetchAttempt(requestId, attemptId)
                .then((res) => setData(res))
                .catch((e) => setError(e.message))
                .finally(() => {
                    setAttemptId(attemptId);
                    setRequestId(requestId);
                    setLoading(false);
                });
        }
    }, [requestId, attemptId, setAttemptId, setRequestId]);


    return { data, loading, error };
}
