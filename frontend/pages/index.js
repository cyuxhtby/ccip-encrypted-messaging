import Link from 'next/link';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome
        </h1>

        <Link href="/dex" target="_blank">
          <button className={styles.button}>Enter DEX</button>
        </Link>
        <Link href="/mint">
        <button className={styles.buttonMint}> Mint</button>
        </Link>
      </main>
    </div>
  );
}
