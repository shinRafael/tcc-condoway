'use cliente'; 

import Link from "next/link"

export default function Sidebar() {
    return(
        <div className="sidebar">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '30px' }}>
                <img src="/temp/logodoway.png" alt="Logo CondoWay" style={{ width: '38px', height: '38px', objectFit: 'contain', background: 'none' }} />
                <h2 style={{ margin: 0, fontSize: '1.7rem', fontWeight: 700, letterSpacing: '1px' }}>CondWay</h2>
            </div>
            <ul>
                <li><Link href={"/dashboard"}>Dashboard haha</Link></li>
                <li><Link href={"/usuarios"}>Usuarios</Link></li>
                <li><Link href={"/apartamentos"}>Apartamentos</Link></li>
                <li><Link href={"/reservas"}>Reservas</Link></li>
                <li><Link href={"/visitantes"}>Visitantes</Link></li>
                <li><Link href={"/encomendas"}>Encomendas</Link></li>
                <li><Link href={"/notificacaoes"}>Notificações</Link></li>
                <li><Link href={"/mensagens"}>Mensagens</Link></li>
                <li><Link href={"/gerenciamento"}>Gerenciamento</Link></li>
            </ul>
        </div>
    );
}
