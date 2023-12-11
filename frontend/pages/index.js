import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          CCIP Encrypted Messaging
        </h1>
        <h4>Send your encrypted message cross chain and decrypt on any chain you want</h4>

        <Link href="/app" target="_blank">
          <button className={styles.button}>Enter App</button>
        </Link>
        <Link href="/encrypt-decrypt">
        <button className={styles.buttonMint}> encrypt-decrypt</button>
        </Link>
      </main>
    </div>
  );
}
