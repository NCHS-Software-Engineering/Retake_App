import { useRef, useCallback } from "react";

export function useDebouncedCallback<T extends (...args: string[]) => void>(
    fn: T,
    delay = 1000
) {
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    return useCallback((...args: Parameters<T>) => {
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => {
            fn(...args);
            timer.current = null;
        }, delay);
    }, [fn, delay]);
}
