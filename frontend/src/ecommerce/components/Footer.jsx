import React from "react";
import styles from "./Footer.module.css";
import { FaFacebookSquare, FaYoutube, FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brandSection}>
          <div className={styles.brandName}>Clothy</div>
          <div className={styles.brandDescription}>
            Discover the latest trends in fashion with Clothy. We offer premium clothing 
            for men, women, and kids with exceptional quality and style. Shop with confidence 
            and express your unique fashion statement.
          </div>
        </div>

        {/*Address Section*/}
        <nav className={styles.footerNav}>
          <div className={styles.navColumn}>
            <h3 className={styles.columnTitle}>
              <FaMapMarkerAlt className={styles.columnIcon} />
              Address
            </h3>
            <div className={styles.navLink}>123 Fashion Street</div>
            <div className={styles.navLink}>Style District, NY 10001</div>
            <div className={styles.navLink}>United States</div>
          </div>

          {/*Opening Hours Section*/}
          <div className={styles.navColumn}>
            <h3 className={styles.columnTitle}>
              <FaClock className={styles.columnIcon} />
              Opening Hours
            </h3>
            <div className={styles.navLink}>Mon - Fri: 9:00 AM - 8:00 PM</div>
            <div className={styles.navLink}>Saturday: 10:00 AM - 6:00 PM</div>
            <div className={styles.navLink}>Sunday: 11:00 AM - 5:00 PM</div>
          </div>

          {/*Contact Us Section*/}
          <div className={styles.navColumn}>
            <h3 className={styles.columnTitle}>
              <FaPhone className={styles.columnIcon} />
              Contact Us
            </h3>
            <div className={styles.navLink}>
              <FaPhone className={styles.linkIcon} />
              +1 (555) 123-4567
            </div>
            <div className={styles.navLink}>
              <FaEnvelope className={styles.linkIcon} />
              info@clothy.com
            </div>
            <div className={styles.navLink}>Live Chat Available</div>
          </div>

          {/*Social Icons Section*/}
          <div className={styles.navColumn}>
            <h3 className={styles.columnTitle}>Follow Us</h3>
            <div className={styles.socialIcons}>
              <FaFacebookSquare size={20} color="#ffffff" />
              <FaYoutube size={20} color="#ffffff" />
              <FiInstagram size={20} color="#ffffff" />
            </div>
          </div>
        </nav>

        {/*Copyright*/}
        <div className={styles.copyright}>
          © 2024 Clothy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
