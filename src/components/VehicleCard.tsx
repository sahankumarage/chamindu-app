'use client';

import { DollarSign, Tag, Bike, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './VehicleCard.module.css';

interface VehicleProps {
    _id: string;
    name: string;
    type: string;
    price: number;
    description: string;
    isAvailable: boolean;
    contact: string;
}

export default function VehicleCard({ vehicle, index }: { vehicle: VehicleProps; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.card}
        >
            {/* Hover Effect Border */}
            <div className={styles.hoverBorder} />

            <div className={styles.header}>
                <div className={styles.iconBox}>
                    <Bike className={styles.icon} />
                </div>
                <span className={`${styles.statusBadge} ${vehicle.isAvailable ? styles.available : styles.rented}`}>
                    {vehicle.isAvailable ? 'AVAILABLE' : 'RENTED'}
                </span>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{vehicle.name}</h3>
                <p className={styles.description}>{vehicle.description}</p>
            </div>

            <div className={styles.footer}>
                <div>
                    <p className={styles.priceLabel}>Price per Day</p>
                    <div className={styles.price}>
                        <DollarSign className={styles.dollarIcon} />
                        {vehicle.price}
                    </div>
                </div>

                <a href={`tel:${vehicle.contact}`} className={`btn btn-secondary ${styles.rentBtn}`}>
                    Contact
                </a>
            </div>
        </motion.div>
    );
}
