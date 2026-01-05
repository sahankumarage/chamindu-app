
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import { ArrowRight, Car, Bike } from 'lucide-react';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.page}>
      <Navbar />

      {/* Decorative Gradients */}
      <div className={`${styles.blob} ${styles.blobPrimary}`} />
      <div className={`${styles.blob} ${styles.blobSecondary}`} />

      <section className={styles.heroSection}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className={styles.badge}>
            Future of Transport
          </span>
          <h1 className={styles.heading}>
            Move with <span className="gradient-text">Style</span> & <br /> Speed.
          </h1>
          <p className={styles.description}>
            One platform for all your travel needs. Whether you need a quick ride or want to rent a bike for adventure, Velocita has you covered.
          </p>

          <div className={styles.ctaButtons}>
            <Link href="/ride" className="btn btn-primary group">
              <Car className="mr-2 w-5 h-5" />
              Find a Driver
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/rent" className="btn btn-secondary group">
              <Bike className="mr-2 w-5 h-5" />
              Rent a Vehicle
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards Preview */}
        <div className={styles.featuresGrid}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className={styles.featureCard}
          >
            <div className={`${styles.iconWrapper} ${styles.iconWrapperPrimary}`}>
              <Car className="w-6 h-6" />
            </div>
            <h3 className={styles.cardTitle}>Ride Hailing</h3>
            <p className={styles.cardDesc}>Connect with local drivers for Cars, Tuk-tuks, and Bikes. Direct contact, no hidden fees.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className={styles.featureCard}
          >
            <div className={`${styles.iconWrapper} ${styles.iconWrapperSecondary}`}>
              <Bike className="w-6 h-6" />
            </div>
            <h3 className={styles.cardTitle}>Rental Service</h3>
            <p className={styles.cardDesc}>Explore the city on your own terms. Rent premium bicycles and motorbikes easily.</p>
          </motion.div>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Velocita. All rights reserved.</p>
      </footer>
    </main>
  );
}
