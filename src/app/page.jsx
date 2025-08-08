import styles from './page.module.css';
export default function Home() {
  return(
    <div>
      <div className="container">
    <h1 className={styles.tituloHome}>Hello World!!!</h1>
    <h2>Hello World!!!</h2>
    <h3>Hello World!!!</h3>
    <p className="txtDestaque">Primeiro exemplo no Next</p>
     <small>Texto menor</small>
     <br /> 
    <div className="quadrado"></div>
    </div>
      </div>
  );
} 