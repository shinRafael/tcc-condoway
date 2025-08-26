import Sidebar from "@/componentes/Sidebar/sidebar";
import Header from "@/componentes/Header/header";
import Card from "@/componentes/Card/card";
import Table from "@/componentes/Table/table";

export default function Dashboard() {
    return (
        <div className="body">
            <Sidebar />
            <div className="main">
                <Header />

                <div className="dashboard">
                    <Card title={"Moradores"} value="120" />
                    <Card title={"Reservas Hoje"} value="8" />
                    <Card title={"Visitantes"} value="5" />
                    <Card title={"Encomendas"} value="12" />
                </div>
                <table />
            </div>
        </div>
    );
}