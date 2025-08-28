
"use client";

import Link from "next/link"
import styles from "./sidebar.module.css";

export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <div className={styles.logoBox}>
                <img 
                  src="/temp/logosemtransparente.png" 
                  alt="Logo CondoWay" 
                  className={styles.logoImg}
                />
                <h2 className={styles.logoText}>CondWay</h2>
            </div>
            <ul>
                <li><Link href={"/dashboard"}>Dashaaaaaboard haha</Link></li>
                <li><Link href={"/usuarios"}>Usuarios</Link></li>
                <li><Link href={"/apartamentos"}>Apartamentos</Link></li>
                <li><Link href={"/reservas"}>Reservas</Link></li>
                <li><Link href={"/visitantes"}>Visitantes</Link></li>
                <li><Link href={"/encomendas"}>Encomendas</Link></li>
                <li><Link href={"/notificacaoes"}>Notificações</Link></li>
                <li><Link href={"/mensagens"}>Mensagens</Link></li>
                <li><Link href={"/gerenciamentoDash"}>Gerenciamento</Link></li>
            </ul>
        </div>
    );
}
