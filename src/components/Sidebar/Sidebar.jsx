import React from 'react';
import styles from './Sidebar.module.css';
import colors from '../../assets/theme-dark/base/colors';

const Sidebar = () => {
    return (
        <div className={styles.sidebar} style={{
                background: `linear-gradient(to top, ${colors.background.sidenav}, ${colors.background.card})`,
        }}>
            <div className={styles.logo}>
                <h2>B&B System</h2>
            </div>
            <ul className={styles.navList}>
                <li className={styles.navItem}><a href="/dashboard">Dashboard</a></li>
                <li className={`${styles.navItem} ${styles.disabled}`}><a href="#">Reservations (Coming soon)</a></li>
                <li className={`${styles.navItem} ${styles.disabled}`}><a href="#">Accommodations (Coming soon)</a></li>
                <li className={`${styles.navItem} ${styles.disabled}`}><a href="#">Settings (Coming soon)</a></li>
            </ul>
        </div>
    );
};

export default Sidebar;