'use client';

import { addDriver, addVehicle, deleteDriver, deleteVehicle } from '../actions';
import { useRef } from 'react';
import { motion } from 'framer-motion';
import styles from './page.module.css';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ClientAdminForms({ drivers, vehicles }: { drivers: any[], vehicles: any[] }) {
    const driverFormRef = useRef<HTMLFormElement>(null);
    const vehicleFormRef = useRef<HTMLFormElement>(null);

    return (
        <>
            {/* Driver Section */}
            <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`glass-panel ${styles.section}`}
            >
                <h2 className={styles.sectionTitle}>
                    <span className={`${styles.indicator} ${styles.primaryIndicator}`} /> Add New Driver
                </h2>
                <form
                    ref={driverFormRef}
                    action={async (formData) => {
                        const res = await addDriver(formData);
                        if (res.success) {
                            toast.success('Driver Added Successfully!');
                            driverFormRef.current?.reset();
                        } else {
                            toast.error(res.message);
                        }
                    }}
                    className={styles.form}
                >
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Full Name</label>
                        <input name="name" type="text" required className={styles.input} placeholder="e.g. Kamal Perera" />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Vehicle Type</label>
                            <select name="type" className={styles.select}>
                                <option value="bike">Bike</option>
                                <option value="wheel">Tuk Tuk</option>
                                <option value="car">Car</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Contact No</label>
                            <input name="contact" type="tel" required className={styles.input} placeholder="077xxxxxxx" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Location</label>
                        <input name="location" type="text" required className={styles.input} placeholder="e.g. Colombo 7" />
                    </div>

                    <button type="submit" className={`btn btn-primary ${styles.submitBtn}`}>Add Driver</button>
                </form>

                <div className={styles.listContainer}>
                    <h3 className={styles.listHeader}>Existing Drivers</h3>
                    <div className={styles.list}>
                        {drivers.map((driver) => (
                            <div key={driver._id} className={styles.listItem}>
                                <div className={styles.itemInfo}>
                                    <h4>{driver.name}</h4>
                                    <p>{driver.contact}</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (confirm('Delete this driver?')) {
                                            const res = await deleteDriver(driver._id);
                                            if (res.success) toast.success('Driver deleted');
                                            else toast.error('Failed to delete');
                                        }
                                    }}
                                    className={styles.deleteBtn}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {drivers.length === 0 && <p className="text-sm text-gray-400">No drivers found.</p>}
                    </div>
                </div>
            </motion.section>

            {/* Vehicle Section */}
            <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className={`glass-panel ${styles.section}`}
            >
                <h2 className={styles.sectionTitle}>
                    <span className={`${styles.indicator} ${styles.secondaryIndicator}`} /> Add Rental Vehicle
                </h2>
                <form
                    ref={vehicleFormRef}
                    action={async (formData) => {
                        const res = await addVehicle(formData);
                        if (res.success) {
                            toast.success('Vehicle Added Successfully!');
                            vehicleFormRef.current?.reset();
                        } else {
                            toast.error(res.message);
                        }
                    }}
                    className={styles.form}
                >
                    <div className={styles.formGroup}>
                        <label className={styles.label}>Vehicle Name</label>
                        <input name="name" type="text" required className={`${styles.input} ${styles.vehicleInput}`} placeholder="e.g. Yamaha FZ" />
                    </div>

                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Type</label>
                            <select name="type" className={`${styles.select} ${styles.vehicleSelect}`}>
                                <option value="bike">Motorbike</option>
                                <option value="bicycle">Bicycle</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Price per Day (LKR)</label>
                            <input name="price" type="number" required className={`${styles.input} ${styles.vehicleInput}`} placeholder="2500" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Contact No</label>
                        <input name="contact" type="tel" required className={`${styles.input} ${styles.vehicleInput}`} placeholder="077xxxxxxx" />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Description</label>
                        <textarea name="description" rows={3} className={`${styles.textarea} ${styles.vehicleTextarea}`} placeholder="Vehicle details..." />
                    </div>

                    <button type="submit" className={`btn btn-secondary ${styles.submitBtn}`}>Add Vehicle</button>
                </form>

                <div className={styles.listContainer}>
                    <h3 className={styles.listHeader}>Existing Vehicles</h3>
                    <div className={styles.list}>
                        {vehicles.map((vehicle) => (
                            <div key={vehicle._id} className={`${styles.listItem} ${styles.vehicleItem}`}>
                                <div className={styles.itemInfo}>
                                    <h4>{vehicle.name}</h4>
                                    <p>Rs. {vehicle.price}/day</p>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (confirm('Delete this vehicle?')) {
                                            const res = await deleteVehicle(vehicle._id);
                                            if (res.success) toast.success('Vehicle deleted');
                                            else toast.error('Failed to delete');
                                        }
                                    }}
                                    className={styles.deleteBtn}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {vehicles.length === 0 && <p className="text-sm text-gray-400">No vehicles found.</p>}
                    </div>
                </div>
            </motion.section>
        </>
    );
}
