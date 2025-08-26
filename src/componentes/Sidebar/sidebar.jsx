'use cliente'; 

import Link from "next/link"

export default function Sidebar() {
    return(
        <div className="sidebar">
            <h2>CondoWay</h2>
            <ul>
                <li><Link href={"/dashboard"}>Dashboard</Link></li>
                <li><Link href={"/usuarios"}>Usuarios</Link></li>
                <li><Link href={"/apartamentos"}>Apartamentos</Link></li>
                <li><Link href={"/reservas"}>Reservas</Link></li>
                <li><Link href={"/visitantes"}>Visitantes</Link></li>
                <li><Link href={"/encomendas"}>Encomendas</Link></li>
                <li><Link href={"/notificacaoes"}>Notificações</Link></li>
                <li><Link href={"/mensagens"}>Mensagens</Link></li>
            </ul>
        </div>
    );
}
