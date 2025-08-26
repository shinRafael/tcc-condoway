export default function Table() {
    return (
        <div className="content">
           <h2>Reservas Recentes</h2>
            <table>
             <thead>
                <tr>
                    <th>Morador</th>
                    <th>Ambiente</th>
                    <th>Data</th>
                    <th>Status</th>
                </tr>
             </thead>
             <tbody>
                <tr>
                    <td>João Silva</td>
                    <td>Salão de Festas</td>
                    <td>25/05/2025</td>
                    <td>Aprovada</td>
                </tr>
                <tr>
                    <td>Maria Oliveira</td>
                    <td>Churrasqueira</td>
                    <td>27/05/2025</td>
                    <td>Pendente</td>
                </tr>
                <tr>
                    <td>Carlos Souza</td>
                    <td>Clube de Jogos</td>
                    <td>31/05/2025</td>
                    <td>Cancelada</td>
                </tr>
              </tbody>
            </table>
        </div>
    );
}