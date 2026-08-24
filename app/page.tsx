import ChatInterface from "./chat/ChatInterface";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <ChatInterface />
      </main>
    </div>
  );
}
