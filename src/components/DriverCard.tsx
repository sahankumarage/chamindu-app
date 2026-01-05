'use client';

import { Phone, MapPin, User, CarFront, Bike } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './DriverCard.module.css';

interface DriverProps {
    _id: string;
    name: string;
    type: string;
    contact: string;
    location: string;
    status: string;
}

export default function DriverCard({ driver, index }: { driver: DriverProps; index: number }) {
    const Icon = driver.type === 'car' ? CarFront : driver.type === 'bike' ? Bike : User;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.card}
        >
            <div className={styles.hoverGradient} />

            <div className={styles.header}>
                <div className={styles.driverInfo}>
                    <div className={styles.iconWrapper}>
                        <Icon className={styles.icon} />
                    </div>
                    <div className={styles.nameBlock}>
                        <h3 className={styles.name}>{driver.name}</h3>
                        <span className={styles.type}>{driver.type}</span>
                    </div>
                </div>
                <div className={`${styles.statusBadge} ${driver.status === 'active' ? styles.active : styles.busy}`}>
                    {driver.status}
                </div>
            </div>

            <div className={styles.details}>
                <div className={styles.detailRow}>
                    <MapPin className={styles.detailIcon} />
                    {driver.location}
                </div>
                <div className={styles.detailRow}>
                    <Phone className={styles.detailIcon} />
                    {driver.contact}
                </div>
            </div>

            <a href={`tel:${driver.contact}`} className={`btn btn-primary ${styles.contactBtn}`}>
                Contact Driver
            </a>
        </motion.div>
    );
}
