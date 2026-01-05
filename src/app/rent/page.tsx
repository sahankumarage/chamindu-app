import Navbar from '../../components/Navbar';
import VehicleCard from '../../components/VehicleCard';
import dbConnect from '../../lib/db';
import Vehicle from '../../models/Vehicle';
import styles from './page.module.css';

const MOCK_VEHICLES = [
    { _id: '1', name: 'Yamaha FZ', type: 'bike', price: 2500, description: 'Sporty look, great for city rides.', isAvailable: true },
    { _id: '2', name: 'Honda Dio', type: 'bike', price: 1500, description: 'Easy to handle, automatic scooter.', isAvailable: true },
    { _id: '3', name: 'Mountain Trekker', type: 'bicycle', price: 500, description: 'Perfect for off-road adventures.', isAvailable: false },
    { _id: '4', name: 'Urban Cruiser', type: 'bicycle', price: 400, description: 'Comfortable city bicycle.', isAvailable: true },
    { _id: '5', name: 'Bajaj Pulsar', type: 'bike', price: 2200, description: 'Powerful engine, long rides.', isAvailable: true },
];

async function getVehicles() {
    try {
        const conn = await dbConnect();
        if (!conn) return MOCK_VEHICLES;

        const vehicles = await Vehicle.find({}).lean();
        if (vehicles.length === 0) return MOCK_VEHICLES;

        return JSON.parse(JSON.stringify(vehicles));
    } catch (error) {
        console.error('Failed to fetch vehicles:', error);
        return MOCK_VEHICLES;
    }
}

export default async function RentPage() {
    const vehicles = await getVehicles();

    return (
        <main className={styles.page}>
            <Navbar />

            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.title}>
                        Rent a <span className="gradient-text">Vehicle</span>
                    </h1>
                    <p className={styles.description}>
                        Need a ride for a day or week? Explore our wide range of rental options.
                    </p>
                </header>

                <div className={styles.grid}>
                    {vehicles.map((vehicle: any, index: number) => (
                        <VehicleCard key={vehicle._id} vehicle={vehicle} index={index} />
                    ))}
                </div>
            </div>
        </main>
    );
}
