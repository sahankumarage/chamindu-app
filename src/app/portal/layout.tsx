import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import DashboardShell from '@/components/DashboardShell';

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
    const user = await getCurrentUser();
    if (!user) redirect('/login?redirect=/portal');

    return (
        <DashboardShell
            variant="portal"
            user={{ name: user.name, email: user.email, role: user.role }}
        >
            {children}
        </DashboardShell>
    );
}
