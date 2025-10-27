'use client';

import Link from 'next/link';
import styles from './BackLink.module.scss';

interface BackLinkProps {
  href: string;
  text: string;
}

const BackLink = ({ href, text }: BackLinkProps): React.ReactElement => {
  return (
    <Link href={href} className={styles.backLink}>
      <span className={styles.arrow}>&lt;&lt;</span>
      <span className={styles.text}>{text}</span>
    </Link>
  );
};

export default BackLink;


