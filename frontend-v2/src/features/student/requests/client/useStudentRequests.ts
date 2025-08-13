import { useState, useEffect, useMemo, useCallback } from 'react';
import type { RetakeRequest } from '../types/request';
import { getStudentRetakeRequests } from '../services/requests';

export const useStudentRequests = (sortDesc: boolean) => {
    const [requests, setRequests] = useState<RetakeRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getStudentRetakeRequests();
            setRequests(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const sorted = useMemo(
        () => [...requests].sort((a, b) =>
            sortDesc
                ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
        [requests, sortDesc]
    );

    return { requests: sorted, loading, refetch: fetchRequests };
};
