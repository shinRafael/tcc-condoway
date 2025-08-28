import '../../styles/usuarios.css';

export default function Usuarios() {
  return (
    <div className="usuarios-page">
      <div className="header">
        <h1>Usuários</h1>
        <div className="user-info">
          <span>Síndico</span>
          <img src="/placeholder.png" alt="User" />
        </div>
      </div>

      <div className="content">
        <h2>Lista de Usuários</h2>

        <button className="add-user-btn">+ Adicionar Usuário</button>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Telefone</th>
              <th>Tipo</th>
              <th>Senha</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>João Silva</td>
              <td>joao@email.com</td>
              <td>(11) 99999-9999</td>
              <td>Morador</td>
              <td>********</td>
              <td><button className="edit-btn">Editar</button></td>
            </tr>
            <tr>
              <td>2</td>
              <td>Maria Oliveira</td>
              <td>maria@email.com</td>
              <td>(11) 98888-8888</td>
              <td>Síndico</td>
              <td>********</td>
              <td><button className="edit-btn">Editar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
