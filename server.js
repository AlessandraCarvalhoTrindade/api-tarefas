const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Banco de dados em memória (simples para aprendizado)
let tarefas = [
  { id: 1, texto: "Estudar JavaScript", concluida: false },
  { id: 2, texto: "Criar projetos para o portfólio", concluida: true }
];

let proximoId = 3;

// Rota de teste
app.get("/", (req, res) => {
  res.json({
    mensagem: "API de Tarefas funcionando!",
    endpoints: {
      "GET /tarefas": "Listar todas as tarefas",
      "POST /tarefas": "Criar nova tarefa",
      "PUT /tarefas/:id": "Atualizar tarefa",
      "DELETE /tarefas/:id": "Excluir tarefa"
    }
  });
});

// Listar todas as tarefas
app.get("/tarefas", (req, res) => {
  res.json(tarefas);
});

// Criar nova tarefa
app.post("/tarefas", (req, res) => {
  const { texto } = req.body;

  if (!texto || texto.trim() === "") {
    return res.status(400).json({ erro: "O campo 'texto' é obrigatório" });
  }

  const novaTarefa = {
    id: proximoId++,
    texto: texto.trim(),
    concluida: false
  };

  tarefas.push(novaTarefa);
  res.status(201).json(novaTarefa);
});

// Atualizar tarefa (marcar como concluída ou editar texto)
app.put("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const tarefa = tarefas.find(t => t.id === id);

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  const { texto, concluida } = req.body;

  if (texto !== undefined) {
    tarefa.texto = texto;
  }

  if (concluida !== undefined) {
    tarefa.concluida = concluida;
  }

  res.json(tarefa);
});

// Excluir tarefa
app.delete("/tarefas/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = tarefas.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ erro: "Tarefa não encontrada" });
  }

  const removida = tarefas.splice(index, 1)[0];
  res.json({ mensagem: "Tarefa removida com sucesso", tarefa: removida });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
