import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/ContactCode.module.css';

const contactItems = [
  {
    social: 'website',
    link: 'asif-alam-portfolio.vercel.app',
    href: 'https://asif-alam-portfolio.vercel.app',
    color: '#61dafb'
  },
  {
    social: 'email',
    link: 'asiftalukder151@gmail.com',
    href: 'mailto:asiftalukder151@gmail.com',
    color: '#d83b01'
  },
  {
    social: 'github',
    link: 'asif-alam1',
    href: 'https://github.com/asif-alam1',
    color: '#6e5494'
  },
  {
    social: 'linkedin',
    link: 'asif-alam-talukder',
    href: 'https://www.linkedin.com/in/asif-alam-talukder',
    color: '#0077b5'
  },
  {
    social: 'instagram',
    link: 'asif_.alam',
    href: 'https://www.instagram.com/asif_.alam',
    color: '#e4405f'
  }
];

const ContactCode = () => {
  const [visibleLines, setVisibleLines] = useState([]);
  const totalLines = contactItems.length + 2; // +2 for opening and closing braces

  // Animate lines appearing one by one
  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleLines(prev => {
        if (prev.length < totalLines) {
          return [...prev, prev.length];
        } else {
          clearInterval(timer);
          return prev;
        }
      });
    }, 150);

    return () => clearInterval(timer);
  }, [totalLines]);

  return (
    <div className={styles.codeBlock}>
      <div className={styles.code}>
        {/* Opening brace line */}
        <div className={`${styles.line} ${visibleLines.includes(0) ? styles.visible : ''}`}>
          <span className={styles.className}>.socials</span> &#123;
        </div>

        {/* Contact items */}
        {contactItems.map((item, index) => (
          <div
            key={index}
            className={`${styles.line} ${visibleLines.includes(index + 1) ? styles.visible : ''}`}
          >
            <span className={styles.indentation}>&nbsp;&nbsp;</span>
            <span className={styles.property}>{item.social}</span>
            <span className={styles.syntax}>:</span>
            <span
              className={styles.value}
              style={{ color: item.color }}
            >
              <Link href={item.href} target='_blank' rel='noopener noreferrer'>
                {item.link}
              </Link>
            </span>
            <span className={styles.syntax}>;</span>
          </div>
        ))}

        {/* Closing brace line */}
        <div className={`${styles.line} ${visibleLines.includes(totalLines - 1) ? styles.visible : ''}`}>
          &#125;
        </div>

        {/* Code typing cursor */}
        {visibleLines.length < totalLines && (
          <div className={styles.cursor} style={{ top: `${(visibleLines.length) * 2}rem` }}></div>
        )}
      </div>

      {/* Code annotations */}

    </div>
  );
};

export default ContactCode;