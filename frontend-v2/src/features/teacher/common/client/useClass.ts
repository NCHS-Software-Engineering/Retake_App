"use client";

import { useContext } from "react";
import { ClassContext } from "./ClassContext";

export function useClass() {
    const ctx = useContext(ClassContext);
    if (!ctx) {
        throw new Error("Error using ClassContext");
    }
    return ctx;
}