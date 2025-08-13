"use client";
import clsx from "clsx";
import { Request } from "../types/request";

import { STATUS_ORDER, STATUS_COLOR, STATUS_LABELS } from "./statusConstants";

export function FilterTabs({
    current,
    onChange,
}: {
    current: "all" | Request["status"];
    onChange: (s: typeof current) => void;
}) {
    return (
        <div className="flex space-x-2 overflow-x-auto">
            <button onClick={() => onChange("all")}
                className={clsx("px-3 py-1 rounded-full cursor-pointer", current === "all" ? "bg-blue-600 text-white" : "bg-gray-100")}>
                All
            </button>
            {STATUS_ORDER.map(s => (
                <button key={s} onClick={() => onChange(s)}
                    className={clsx("px-3 py-1 rounded-full cursor-pointer",
                        current === s ? STATUS_COLOR[s] : "bg-gray-100")}>
                    {STATUS_LABELS[s]}
                </button>
            ))}
        </div>
    );
}
