import { Request } from "../types/request";

export const STATUS_ORDER: Request['status'][] = [
    'pending',
    'assigned',
    'submitted',
    'graded',
    'resolved',
];

export const STATUS_LABELS: Record<Request['status'], string> = {
    pending: 'Pending',
    assigned: 'Assigned',
    submitted: 'Submitted',
    graded: 'Graded',
    resolved: 'Resolved',
};

export const STATUS_COLOR: Record<Request['status'], string> = {
    pending: 'bg-orange-100 text-orange-700',
    assigned: 'bg-blue-100 text-blue-700',
    submitted: 'bg-purple-100 text-purple-700',
    graded: 'bg-green-100 text-green-700',
    resolved: 'bg-gray-200 text-gray-600',
};