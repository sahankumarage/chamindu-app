import Navbar from '../../components/Navbar';
import DriverCard from '../../components/DriverCard';
import dbConnect from '../../lib/db';
import Driver from '../../models/Driver';
import styles from './page.module.css';

// Mock data for display when DB is not configured
const MOCK_DRIVERS = [
    { _id: '1', name: 'Chamindu Silva', type: 'car', contact: '0771234567', location: 'Colombo', status: 'active' },
    { _id: '2', name: 'Kasun Perera', type: 'wheel', contact: '0719876543', location: 'Galle', status: 'active' },
    { _id: '3', name: 'Amal De Silva', type: 'bike', contact: '0765554444', location: 'Kandy', status: 'busy' },
    { _id: '4', name: 'Nimal Bandara', type: 'car', contact: '0701112222', location: 'Negombo', status: 'active' },
    { _id: '5', name: 'Sunil Kumar', type: 'wheel', contact: '0772223333', location: 'Matara', status: 'active' },
];

async function getDrivers() {
    try {
        const conn = await dbConnect();
        if (!conn) return MOCK_DRIVERS;

        const drivers = await Driver.find({ status: 'active' }).lean();
        if (drivers.length === 0) return MOCK_DRIVERS; // Show mock if empty DB too

        return JSON.parse(JSON.stringify(drivers));
    } catch (error) {
        console.error('Failed to fetch drivers:', error);
        return MOCK_DRIVERS;
    }
}

export default async function RidePage() {
    const drivers = await getDrivers();

    return (
        <main className={styles.page}>
            <Navbar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Find Your <span className="gradient-text">Ride</span>
                    </h1>
                    <p className={styles.description}>
                        Choose from our top-rated drivers. Whether it's a quick bike ride or a comfortable car trip, we have you sorted.
                    </p>
                </header>

                <div className={styles.grid}>
                    {drivers.map((driver: any, index: number) => (
                        <DriverCard key={driver._id} driver={driver} index={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}
