import React from "react";
import styles from "./Header.module.css";

function Header() {
  const navItems = [
    "Home"
  ];


  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/cba48e938fe0e43cb36cd15ff6a6dfae41fbf8ecdc39e1f47427c70277cf381f?placeholderIfAbsent=true&apiKey=8a1e4083f58f4588a29f4fafd0874267"
          alt="FBA.ai Logo"
          className={styles.logoImage}
        />
        <span className={styles.logoText}>
          <span className={styles.logoBold}>FBA</span>
          <span className={styles.logoLight}>.ai</span>
        </span>
      </div>
      <nav className={styles.mainNav}>
        <ul>
          {navItems.map((item, index) => (
            <li key={index}>
              <a href={item == "Home" ? "/cv-home" : "#"} className={styles.navLink}>
                {item}
              </a>
            </li>
          ))}
          <li key="upload">
          <a href="/uploadCV" className={styles.navLink}>
          Upload CV
         </a>
          </li>
          <li key="recruit">
          <a href="/recruit" className={styles.navLink}>
          Recruiting?
        </a>
          </li>
        </ul>
      </nav>
      <div className={styles.userActions}>
      <a href="#" className={styles.navLink}>
          User Dashboard
        </a>
      </div>
    </header>
  );
}

export default Header;
