"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/dashboard");
  }, [router]);
  return (
    <div className="container">
      <h1 className={styles.tituloHome}>Hello World!!!</h1>
      <h2>Hello World!!!</h2>
      <h3>Hello World!!!</h3>
      <p className="txtDestaque">Primeiro exemplo no Next</p>
      <p>Primeiro exemplo no Next</p>
      <small>Texto menor</small>
      <br />
      <div className="quadrado"></div>
  
     <Image
      src="/temp/arvore.jpg"
      alt="Picture of the author"
      width={130}
      height={90}
    />
    <Image
      src="/temp/arvorePequena.jpg"
      alt="Picture of the author"
      width={1300}
      height={900}
    />
     
    </div>
  );
}