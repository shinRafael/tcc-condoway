import LoginForm from "@/componentes/loginForm/loginForm";
import styles from "@/styles/Login.module.css";

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <LoginForm />
    </div>
  );
}