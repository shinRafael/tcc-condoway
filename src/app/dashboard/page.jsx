import Header from "@/componentes/Header/header";
import Card from "@/componentes/Card/card";
import Table from "@/componentes/Table/table";
import '../../styles/globals.css';

export default function Dashboard() {
    return (
        <div className="main">
            <Header />
            <div className="dashboard">
                <Card title={"Moradores"} value="120" />
                <Card title={"Reservas Hoje"} value="8" />
                <Card title={"Visitantes"} value="5" />
                <Card title={"Encomendas"} value="12" />
                <Card title={"Gerenciamento"} value="5"/>
            </div>
            <table />
        </div>
    );
}