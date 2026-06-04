import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect('/login?redirect=/admin');
    if (user.role !== 'admin') redirect('/portal');

    return (
        <DashboardShell
            variant="admin"
            user={{ name: user.name, email: user.email, role: user.role }}
        >
            {children}
        </DashboardShell>
    );
}
