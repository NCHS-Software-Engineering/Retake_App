import { redirect } from 'next/navigation';

export default function Page() {
    redirect('/dashboard/teacher/requests');
    return null;
}
