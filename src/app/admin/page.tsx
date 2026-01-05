import Navbar from '../../components/Navbar';
import { logout } from '../actions';
import styles from './page.module.css';
import { LogOut } from 'lucide-react';
import dbConnect from '../../lib/db';
import Driver from '../../models/Driver';
import Vehicle from '../../models/Vehicle';
import ClientAdminForms from './ClientAdminForms';

async function getData() {
    try {
        await dbConnect();
        const drivers = await Driver.find({}).lean();
        const vehicles = await Vehicle.find({}).lean();
        return {
            drivers: JSON.parse(JSON.stringify(drivers)),
            vehicles: JSON.parse(JSON.stringify(vehicles))
        };
    } catch (error) {
        console.error('Failed to fetch admin data:', error);
        return { drivers: [], vehicles: [] };
    }
}

export default async function AdminPage() {
    const { drivers, vehicles } = await getData();

    return (
        <main className={styles.page}>
            <Navbar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <div className="flex justify-between items-center mb-4">
                        <h1 className={styles.title}>
                            Admin <span className="gradient-text">Dashboard</span>
                        </h1>
                        <form action={logout}>
                            <button type="submit" className="btn btn-secondary flex items-center gap-2">
                                <LogOut size={18} /> Logout
                            </button>
                        </form>
                    </div>
                    <p className={styles.description}>Manage drivers and rental fleet.</p>
                </header>

                <div className={styles.dashboardGrid}>
                    <ClientAdminForms drivers={drivers} vehicles={vehicles} />
                </div>
            </div>
        </main>
    );
}
