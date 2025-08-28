import '../../styles/globals.css';

const menu = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Usuários", path: "/usuarios" },
  { label: "Apartamentos", path: "/apartamentos" },
  { label: "Reservas", path: "/reservas" },
  { label: "Visitantes", path: "/visitantes" },
  { label: "Encomendas", path: "/encomendas" },
  { label: "Notificações", path: "/notificacoes" },
  { label: "Mensagens", path: "/mensagens" },
  { label:"Gerenciamento", path: "/gerenciamento" }
];

function SidebarReserva() {
  return (
    <aside className="sidebarReserva">
      <h2 className="logoReserva">CondoWay</h2>
      <nav>
        <ul className="menuReserva">
          {menu.map((item) => (
            <li key={item.label}>
              <a
                href={item.path}
                className={item.label === "Mensagens" ? "menuActiveReserva" : "menuLinkReserva"}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default function Mensagens() {
  return (
    <div className="containerReserva">
      {/* SidebarReserva has been removed to avoid duplication */}
      <div className="mainContentReserva">
        {/* Conteúdo da página de mensagens */}
      </div>
    </div>
  );
}
